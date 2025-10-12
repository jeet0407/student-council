'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import PDFViewer and PDFDownloadLink to avoid SSR issues
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false }
);

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

// Import our PDFDocument component
const PDFDocument = dynamic(
  () => import('@/components/PDFDocument'),
  { ssr: false }
);

const PDFRenderer = ({ document, fileName = 'document.pdf' }) => {
  if (!document) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* PDF Preview */}
      <div className="border rounded-lg shadow-lg p-4 bg-gray-100">
        <div className="h-[80vh] w-full">
          <PDFViewer
            width="100%"
            height="100%"
            style={{ border: "1px solid #cccccc" }}
          >
            <PDFDocument data={document} />
          </PDFViewer>
        </div>
      </div>

      {/* Download Link */}
      <div className="flex justify-end">
        <PDFDownloadLink 
          document={<PDFDocument data={document} />} 
          fileName={fileName}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          {({ blob, url, loading, error }) => 
            loading ? 'Generating PDF...' : 'Download PDF'
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default PDFRenderer;
