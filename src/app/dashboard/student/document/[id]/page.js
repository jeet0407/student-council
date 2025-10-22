'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import DashboardLayout from '@/components/DashboardLayout';
import { saveAs } from 'file-saver';
import { getPDFComponent, PDFFormatTypes } from '@/pdfFormat';

export default function DocumentPreview({ params }) {
  const documentId = React.use(params).id;
  
  const router = useRouter();
  const { data: session, status } = useSession();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (status === 'authenticated' && documentId) {
      fetchDocument(documentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, documentId]);

  const fetchDocument = async (id) => {
    try {
      const response = await fetch(`/api/documents/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      
      const data = await response.json();
      
      if (!data.financialProposal) {
        data.financialProposal = [];
      }
      
      setDocument(data);
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to load document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setPdfError(null);
      const PDFComponent = getPDFComponent(PDFFormatTypes.CLUB_EVENT_VOUCHER);
      const asPdf = pdf(<PDFComponent document={document} />);
      const blob = await asPdf.toBlob();
      saveAs(blob, `document-${documentId}.pdf`);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setPdfError(`Failed to download PDF: ${err.message}`);
    }
  };

  const handleSubmitDocument = async () => {
    if (!confirm('Are you sure you want to submit this document? Once submitted, you cannot edit it anymore.')) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/submit`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to submit document');
      }

      alert('Document submitted successfully! It has been sent to Faculty for approval.');
      router.push('/dashboard/student');
    } catch (err) {
      console.error('Error submitting document:', err);
      alert('Failed to submit document. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDocument = () => {
    router.push(`/dashboard/student/edit-document/${documentId}`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
      pending_faculty: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Faculty' },
      pending_dean_swo: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Pending Dean SWO' },
      pending_dean_sw: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Pending Dean SW' },
      passed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Passed' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    };
    const badge = badges[status] || badges.draft;
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const renderPDF = () => {
    try {
      const PDFComponent = getPDFComponent(PDFFormatTypes.CLUB_EVENT_VOUCHER);
      return <PDFComponent document={document} />;
    } catch (err) {
      console.error('Error rendering PDF:', err);
      setPdfError(`Error rendering PDF: ${err.message}`);
      return null;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="spinner h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2">Loading document...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => router.push('/dashboard/student')}
            className="mt-2 text-blue-600 hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!document) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <p>Document not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Document Preview</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/dashboard/student')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
            {document.status === 'draft' && (
              <>
                <button
                  onClick={handleEditDocument}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Edit Document
                </button>
                <button
                  onClick={handleSubmitDocument}
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit to Faculty'}
                </button>
              </>
            )}
            {document.status === 'passed' && (
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Download PDF
              </button>
            )}
          </div>
        </div>

        {/* Document Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">Title:</span>
              <p className="text-black">{document.title}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <div className="mt-1">{getStatusBadge(document.status)}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Club:</span>
              <p className="text-black">{document.clubName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Submitted:</span>
              <p className="text-black">{new Date(document.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          {/* Show feedback if rejected */}
          {document.status === 'rejected' && document.feedback && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-semibold text-red-800 mb-2">Rejection Feedback:</h3>
              <p className="text-red-700">{document.feedback}</p>
            </div>
          )}

          {/* Show approval history if available */}
          {document.approvalHistory && document.approvalHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Approval History:</h3>
              <div className="space-y-2">
                {document.approvalHistory.map((history, index) => (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      history.action === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {history.action === 'approved' ? '✓' : '✗'} {history.role.toUpperCase()}
                    </span>
                    <span className="text-gray-600">
                      {new Date(history.approvedAt).toLocaleDateString()}
                    </span>
                    {history.feedback && (
                      <span className="text-gray-700 italic">- {history.feedback}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PDF Error */}
        {pdfError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{pdfError}</p>
          </div>
        )}

        {/* PDF Preview */}
        <div className="mb-6 border-2 border-gray-200 rounded-lg overflow-hidden bg-white" style={{ height: "70vh" }}>
          <div className="h-full w-full">
            <PDFViewer 
              width="100%" 
              height="100%" 
              style={{ border: "none" }}
            >
              {renderPDF()}
            </PDFViewer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}