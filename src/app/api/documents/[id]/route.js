import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Document from '@/models/Document';
import User from '@/models/User';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { id } = await params;
    
    // Fetch document by ID
    const document = await Document.findById(id).populate('createdBy', 'name email');
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check authorization based on role
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Authorization based on role
    if (session.user.role === 'student_head') {
      // Students can only access their own documents (including drafts)
      // Handle both populated and non-populated createdBy
      const createdById = document.createdBy._id || document.createdBy;
      if (createdById.toString() !== user._id.toString()) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    } else if (session.user.role === 'faculty') {
      // Faculty can access pending documents or documents they've already processed
      const hasFacultyApproval = document.approvalHistory?.some(a => a.role === 'faculty');
      if (document.status !== 'pending_faculty' && !hasFacultyApproval) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    } else if (session.user.role === 'dean_swo') {
      // Dean SWO can access pending documents or documents they've already processed
      const hasDeanSWOApproval = document.approvalHistory?.some(a => a.role === 'dean_swo');
      if (document.status !== 'pending_dean_swo' && !hasDeanSWOApproval) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    } else if (session.user.role === 'dean_sw') {
      // Dean SW can access pending documents or documents they've already processed
      const hasDeanSWApproval = document.approvalHistory?.some(a => a.role === 'dean_sw');
      if (document.status !== 'pending_dean_sw' && !hasDeanSWApproval) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }
    
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { id } = await params;
    const updateData = await req.json();
    
    // Fetch document by ID
    const document = await Document.findById(id);
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Get current user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Authorization checks based on document status and user role
    if (session.user.role === 'student_head') {
      // Student head can only update own documents in draft status
      // Handle both populated and non-populated createdBy
      const createdById = document.createdBy._id || document.createdBy;
      if (createdById.toString() !== user._id.toString() || 
          document.status !== 'draft') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
      
      // Update document fields
      Object.keys(updateData).forEach(key => {
        if (key !== '_id' && key !== 'createdBy' && key !== 'createdAt' && key !== 'status') {
          document[key] = updateData[key];
        }
      });
    } else if (session.user.role === 'faculty') {
      // Faculty can only update documents in pending_faculty status
      if (document.status !== 'pending_faculty') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
      
      if (updateData.status === 'rejected') {
        document.status = 'rejected';
        document.feedback = updateData.feedback;
        document.rejectedBy = user._id;
      } else if (updateData.signatures?.faculty) {
        document.signatures.faculty = updateData.signatures.faculty;
        document.status = 'pending_dean_swo';
        document.signedAt.faculty = new Date();
        document.pdfVersions.facultySigned = updateData.pdfVersions?.facultySigned || document.pdfVersions.facultySigned;
      }
    } else if (session.user.role === 'dean_swo') {
      // Dean SWO can only update documents in pending_dean_swo status
      if (document.status !== 'pending_dean_swo') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
      
      if (updateData.status === 'rejected') {
        document.status = 'rejected';
        document.feedback = updateData.feedback;
        document.rejectedBy = user._id;
      } else if (updateData.signatures?.deanSWO) {
        document.signatures.deanSWO = updateData.signatures.deanSWO;
        document.status = 'pending_dean_sw';
        document.signedAt.deanSWO = new Date();
        document.pdfVersions.deanSWOSigned = updateData.pdfVersions?.deanSWOSigned || document.pdfVersions.deanSWOSigned;
      }
    } else if (session.user.role === 'dean_sw') {
      // Dean SW can only update documents in pending_dean_sw status
      if (document.status !== 'pending_dean_sw') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
      
      if (updateData.status === 'rejected') {
        document.status = 'rejected';
        document.feedback = updateData.feedback;
        document.rejectedBy = user._id;
      } else if (updateData.signatures?.deanSW) {
        document.signatures.deanSW = updateData.signatures.deanSW;
        document.status = 'passed';
        document.signedAt.deanSW = new Date();
        document.pdfVersions.final = updateData.pdfVersions?.final || document.pdfVersions.final;
      }
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
    }
    
    document.updatedAt = new Date();
    await document.save();
    
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}