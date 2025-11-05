import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Document from '@/models/Document';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'dean_swo') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch only essential fields for listing
    const documents = await Document.find({ 
      status: 'pending_dean_swo' 
    })
    .select('title clubName status createdAt eventDate documentNumber createdBy approvalHistory')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(50) // Limit to recent 50 pending documents
    .lean();
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching Dean SWO documents:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}