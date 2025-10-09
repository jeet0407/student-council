import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Document from '@/models/Document';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'faculty') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get documents that need faculty review (status: 'submitted' or 'faculty_approved')
    const documents = await Document.find({
      status: { $in: ['submitted', 'faculty_approved'] }
    }).sort({ createdAt: -1 });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching faculty documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}