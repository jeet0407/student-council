import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Document from '@/models/Document';
import User from '@/models/User';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'faculty') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch documents pending faculty approval
    const documents = await Document.find({ 
      status: 'pending_faculty' 
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .lean();
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching faculty documents:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}