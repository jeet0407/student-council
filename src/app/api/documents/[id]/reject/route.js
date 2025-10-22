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

    // Get feedback from request body
    const body = await request.json();
    const { feedback } = body;

    if (!feedback || !feedback.trim()) {
      return NextResponse.json(
        { error: 'Feedback is required for rejection' },
        { status: 400 }
      );
    }

    // Update document status to rejected
    document.status = 'rejected';
    document.feedback = feedback;
    document.rejectedBy = user._id;
    document.rejectedAt = new Date();

    // Initialize approvalHistory if it doesn't exist
    if (!document.approvalHistory) {
      document.approvalHistory = [];
    }

    // Add rejection to approval history
    document.approvalHistory.push({
      approvedBy: user._id,
      role: user.role,
      approvedAt: new Date(),
      action: 'rejected',
      feedback: feedback,
    });

    await document.save();

    return NextResponse.json({
      message: 'Document rejected successfully',
      document,
    });
  } catch (error) {
    console.error('Error rejecting document:', error);
    return NextResponse.json(
      { error: 'Failed to reject document' },
      { status: 500 }
    );
  }
}
