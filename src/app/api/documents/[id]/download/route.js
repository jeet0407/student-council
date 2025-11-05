import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { renderToBuffer } from '@react-pdf/renderer';
import dbConnect from '@/lib/mongoose';
import Document from '@/models/Document';
import { getPDFComponent, PDFFormatTypes } from '@/pdfFormat';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get the document
    const { id: documentId } = await params;
    const document = await Document.findById(documentId)
      .populate('createdBy', 'name email')
      .lean();

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Only allow download if document is passed
    if (document.status !== 'passed') {
      return NextResponse.json(
        { error: 'Document must be approved before download' },
        { status: 403 }
      );
    }

    // Generate PDF
    const PDFComponent = getPDFComponent(PDFFormatTypes.CLUB_EVENT_VOUCHER);
    const pdfBuffer = await renderToBuffer(<PDFComponent document={document} />);

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="document-${documentId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}
