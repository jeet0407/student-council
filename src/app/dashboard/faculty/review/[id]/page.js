'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { getPDFComponent, PDFFormatTypes } from '@/pdfFormat';
import { saveAs } from 'file-saver';

export default function FacultyReviewPage({ params }) {
  const documentId = React.use(params).id;
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && documentId) {
      fetchDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, documentId]);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      const data = await response.json();
      setDocument(data);
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!confirm('Are you sure you want to accept this document?')) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to approve document');
      }

      alert('Document approved successfully! It has been sent to Dean SWO.');
      router.push('/dashboard/faculty');
    } catch (err) {
      console.error('Error approving document:', err);
      alert('Failed to approve document. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      alert('Please provide feedback for rejection');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/documents/${documentId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject document');
      }

      alert('Document rejected successfully!');
      router.push('/dashboard/faculty');
    } catch (err) {
      console.error('Error rejecting document:', err);
      alert('Failed to reject document. Please try again.');
    } finally {
      setSubmitting(false);
      setShowRejectModal(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const PDFComponent = getPDFComponent(PDFFormatTypes.CLUB_EVENT_VOUCHER);
      const blob = await pdf(<PDFComponent document={document} />).toBlob();
      saveAs(blob, `${document.title}_${document.documentNumber}.pdf`);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF. Please try again.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-black">
          <div className="text-center">
            <div className="spinner"></div>
            <p className="mt-2">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !document) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Document not found'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const PDFComponent = getPDFComponent(PDFFormatTypes.CLUB_EVENT_VOUCHER);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-black font-bold">Review Document</h1>
          <button
            onClick={() => router.push('/dashboard/faculty')}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Document Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 text-black">
          <h2 className="text-xl font-semibold mb-4">{document.title}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Club:</span> {document.clubName}
            </div>
            <div>
              <span className="font-medium">Status:</span>{' '}
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                {document.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-medium">Submitted by:</span> {document.studentHead?.name || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Date:</span>{' '}
              {new Date(document.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-black">Document Preview</h3>
          {isMobile ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">PDF preview is not available on mobile devices</p>
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download PDF Document
              </button>
              <div className="mt-6 text-left bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Document Summary</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Event:</span> {document.title}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {document.eventDate}
                  </div>
                  <div>
                    <span className="font-medium">Total Budget:</span> ₹
                    {document.financialProposal?.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded" style={{ height: '600px' }}>
              <PDFViewer width="100%" height="100%">
                <PDFComponent document={document} />
              </PDFViewer>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {document.status === 'pending_faculty' ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={submitting}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={handleAccept}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
              >
                Accept
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <p className="text-gray-700 text-sm">
                This document has already been processed. You can view it but cannot make changes.
              </p>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4 text-black">Reject Document</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide feedback for the rejection:
              </p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mb-4 text-black"
                rows="4"
                placeholder="Enter your feedback here..."
              />
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setFeedback('');
                  }}
                  disabled={submitting}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={submitting || !feedback.trim()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
                >
                  Submit Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
