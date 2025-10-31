import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Document from '@/models/Document';
import User from '@/models/User';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'student_head') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Get current user
    const user = await User.findOne({ email: session.user.email }).select('_id').lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch only essential fields for listing
    const documents = await Document.find({ createdBy: user._id })
      .select('title clubName status createdAt eventDate documentNumber approvalHistory')
      .sort({ createdAt: -1 }) // Most recent first
      .lean();
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching student documents:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}