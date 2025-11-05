'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState({ show: false, feedback: '' });

  useEffect(() => {
    // Check authentication
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Check correct role
    if (session && session.user.role !== 'student_head') {
      router.push('/unauthorized');
      return;
    }

    // Fetch student's documents
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/documents/student');
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDocuments();
    }
  }, [session, status, router]);

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

  return (
    <DashboardLayout>
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 md:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-black">Student Head Dashboard - CEV</h1>
          <button 
            onClick={() => router.push('/dashboard/student/new-document')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer text-sm sm:text-base"
          >
            Create New Document
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-3 sm:p-4 md:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">My Documents</h2>
            
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
                <p>No documents found. Create a new document to get started.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents.map((doc) => (
                        <tr key={doc._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-black">{doc.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-black">{doc.clubName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-black">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${doc.status === 'passed' ? 'bg-green-100 text-green-800' : ''}
                              ${doc.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                              ${doc.status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
                              ${doc.status.includes('pending') ? 'bg-yellow-100 text-yellow-800' : ''}
                            `}>
                              {doc.status === 'draft' ? 'DRAFT' : doc.status.replace('_', ' ').replace('pending', 'awaiting').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-black">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => router.push(`/dashboard/student/document/${doc._id}`)}
                              className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                            >
                              View
                            </button>
                            {doc.status === 'draft' && (
                              <button 
                                onClick={() => router.push(`/dashboard/student/edit-document/${doc._id}`)}
                                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                              >
                                Edit
                              </button>
                            )}
                            {doc.status === 'passed' && (
                              <button 
                                onClick={() => window.open(`/api/documents/${doc._id}/download`, '_blank')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Download
                              </button>
                            )}
                            {doc.status === 'rejected' && doc.feedback && (
                              <button 
                                onClick={() => setFeedbackModal({ show: true, feedback: doc.feedback })}
                                className="text-red-600 hover:text-red-900 text-sm underline cursor-pointer"
                              >
                                View Feedback
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {documents.map((doc) => (
                    <div key={doc._id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-black text-base">{doc.title}</h3>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ml-2
                          ${doc.status === 'passed' ? 'bg-green-100 text-green-800' : ''}
                          ${doc.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                          ${doc.status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
                          ${doc.status.includes('pending') ? 'bg-yellow-100 text-yellow-800' : ''}
                        `}>
                          {doc.status === 'draft' ? 'DRAFT' : doc.status.replace('_', ' ').replace('pending', 'awaiting').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Club:</span>
                          <span className="text-black font-medium">{doc.clubName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Created:</span>
                          <span className="text-black">{new Date(doc.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button 
                          onClick={() => router.push(`/dashboard/student/document/${doc._id}`)}
                          className="flex-1 min-w-[100px] text-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm cursor-pointer"
                        >
                          View
                        </button>
                        {doc.status === 'draft' && (
                          <button 
                            onClick={() => router.push(`/dashboard/student/edit-document/${doc._id}`)}
                            className="flex-1 min-w-[100px] text-center bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm cursor-pointer"
                          >
                            Edit
                          </button>
                        )}
                        {doc.status === 'passed' && (
                          <button 
                            onClick={() => window.open(`/api/documents/${doc._id}/download`, '_blank')}
                            className="flex-1 min-w-[100px] text-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm cursor-pointer"
                          >
                            Download
                          </button>
                        )}
                        {doc.status === 'rejected' && doc.feedback && (
                          <button 
                            onClick={() => setFeedbackModal({ show: true, feedback: doc.feedback })}
                            className="flex-1 min-w-[100px] text-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm cursor-pointer"
                          >
                            View Feedback
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Feedback Modal */}
        {feedbackModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-red-800">Rejection Feedback</h3>
                  <button 
                    onClick={() => setFeedbackModal({ show: false, feedback: '' })}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-2"
                  >
                    ×
                  </button>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <p className="text-gray-800 whitespace-pre-wrap text-sm sm:text-base">{feedbackModal.feedback}</p>
                </div>
                <div className="mt-4 sm:mt-6 flex justify-end">
                  <button
                    onClick={() => setFeedbackModal({ show: false, feedback: '' })}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}