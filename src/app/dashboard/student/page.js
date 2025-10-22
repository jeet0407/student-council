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
        <div className="flex items-center justify-center h-64">
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
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Student Head Dashboard</h1>
          <button 
            onClick={() => router.push('/dashboard/student/new-document')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Create New Document
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">My Documents</h2>
            
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No documents found. Create a new document to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
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
            )}
          </div>
        </div>

        {/* Feedback Modal */}
        {feedbackModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-red-800">Rejection Feedback</h3>
                  <button 
                    onClick={() => setFeedbackModal({ show: false, feedback: '' })}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{feedbackModal.feedback}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setFeedbackModal({ show: false, feedback: '' })}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
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