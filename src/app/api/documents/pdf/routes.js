import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongoose';
import Document from '@/models/Document';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data with uploaded PDF
    const formData = await req.formData();
    const pdf = formData.get('pdf');
    const documentId = formData.get('documentId');
    const version = formData.get('version');
    
    if (!pdf || !documentId || !version) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if PDF is a file
    if (!(pdf instanceof File)) {
      return NextResponse.json({ error: 'Invalid PDF file' }, { status: 400 });
    }

    // Connect to database
    await dbConnect();
    
    // Check if document exists
    const document = await Document.findById(documentId);
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Create directory if it doesn't exist
    const pdfDir = path.join(process.cwd(), 'public', 'uploads', 'pdfs');
    await mkdir(pdfDir, { recursive: true });
    
    // Generate unique filename
    const fileName = `${version}-${documentId}-${Date.now()}.pdf`;
    const filePath = path.join(pdfDir, fileName);
    
    // Convert signature data to Buffer and save
    const pdfData = await pdf.arrayBuffer();
    await writeFile(filePath, Buffer.from(pdfData));
    
    // File path to be stored in the database (relative to public folder)
    const dbFilePath = `/uploads/pdfs/${fileName}`;
    
    return NextResponse.json({ 
      success: true,
      pdfPath: dbFilePath
    });
    
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}