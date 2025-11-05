import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Document from '@/models/Document';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'student_head') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const document = await Document.findById(id);

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check if the user is the creator
    if (document.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if document is in draft status
    if (document.status !== 'draft') {
      return NextResponse.json({ error: 'Document has already been submitted' }, { status: 400 });
    }

    // Update status to pending_faculty (submit to faculty)
    document.status = 'pending_faculty';
    document.updatedAt = Date.now();
    await document.save();

    return NextResponse.json({ 
      message: 'Document submitted successfully',
      document 
    });
  } catch (error) {
    console.error('Error submitting document:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
