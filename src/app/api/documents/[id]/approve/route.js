import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongoose';
import Document from '@/models/Document';
import User from '@/models/User';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get the user to check their role
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the document
    const { id: documentId } = await params;
    const document = await Document.findById(documentId);
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Determine next status based on current status and user role
    let newStatus;
    let approvalRole;

    if (user.role === 'faculty' && document.status === 'pending_faculty') {
      newStatus = 'pending_dean_swo';
      approvalRole = 'faculty';
    } else if (user.role === 'dean_swo' && document.status === 'pending_dean_swo') {
      newStatus = 'pending_dean_sw';
      approvalRole = 'dean_swo';
    } else if (user.role === 'dean_sw' && document.status === 'pending_dean_sw') {
      newStatus = 'passed';
      approvalRole = 'dean_sw';
    } else {
      return NextResponse.json(
        { error: 'Invalid approval action for current document status' },
        { status: 400 }
      );
    }

    // Update document status
    document.status = newStatus;

    // Initialize approvalHistory if it doesn't exist
    if (!document.approvalHistory) {
      document.approvalHistory = [];
    }

    // Add approval to history
    document.approvalHistory.push({
      approvedBy: user._id,
      role: approvalRole,
      approvedAt: new Date(),
      action: 'approved',
    });

    await document.save();

    return NextResponse.json({
      message: 'Document approved successfully',
      document,
    });
  } catch (error) {
    console.error('Error approving document:', error);
    return NextResponse.json(
      { error: 'Failed to approve document' },
      { status: 500 }
    );
  }
}
