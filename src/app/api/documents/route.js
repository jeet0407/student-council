import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Document from '@/models/Document';
import User from '@/models/User';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'student_head') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Get current user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse request body
    const formData = await req.json();
    
    // Create new document
    const newDocument = new Document({
      title: formData.eventTitle,
      documentNumber: formData.documentNumber,
      documentDate: formData.documentDate,
      subject: formData.subject,
      clubName: formData.clubName,
      clubCode: formData.clubCode,
      eventDate: formData.eventSchedule,
      eventVenue: formData.eventVenue,
      eventCategory: formData.eventCategory,
      description: formData.briefDescription,
      objectives: formData.objectives,
      targetAudience: formData.targetAudience,
      expectedParticipants: formData.expectedParticipants,
      judges: formData.judges,
      
      // Student Head info
      studentHead: {
        name: formData.studentHeadName,
        rollNo: formData.studentHeadRollNo,
        branch: formData.studentHeadBranch,
        mobile: formData.studentHeadMobile,
      },
      
      // Student Secretary info
      studentSecretary: {
        name: formData.studentSecretaryName || '',
        rollNo: formData.studentSecretaryRollNo || '',
        branch: formData.studentSecretaryBranch || '',
        mobile: formData.studentSecretaryMobile || '',
      },
      
      // Faculty info
      facultyCoChairman1: {
        name: formData.facultyCoChairman1Name || '',
        designation: formData.facultyCoChairman1Designation || '',
        department: formData.facultyCoChairman1Dept || '',
        mobile: formData.facultyCoChairman1Mobile || '',
      },
      
      facultyCoChairman2: {
        name: formData.facultyCoChairman2Name || '',
        designation: formData.facultyCoChairman2Designation || '',
        department: formData.facultyCoChairman2Dept || '',
        mobile: formData.facultyCoChairman2Mobile || '',
      },
      
      facultyChairman: {
        name: formData.facultyChairmanName || '',
        designation: formData.facultyChairmanDesignation || '',
        department: formData.facultyChairmanDept || '',
        mobile: formData.facultyChairmanMobile || '',
      },
      
      // Other document metadata
      status: 'pending_student_signature',
      createdBy: user._id,
      pdfVersions: {
        base: null,
        studentSigned: null,
        facultySigned: null,
        deanSWOSigned: null,
        final: null,
      },
      signatures: {
        student: null,
        faculty: null,
        deanSWO: null,
        deanSW: null,
      },
    });
    
    await newDocument.save();
    
    return NextResponse.json(newDocument, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}