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
          <h1 className="text-2xl font-bold">Student Head Dashboard</h1>
          <button 
            onClick={() => router.push('/dashboard/student/new-document')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Create New Document
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">My Documents</h2>
            
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
                        <td className="px-6 py-4 whitespace-nowrap">{doc.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{doc.clubName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${doc.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                            ${doc.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                            ${doc.status.includes('pending') ? 'bg-yellow-100 text-yellow-800' : ''}
                          `}>
                            {doc.status.replace('_', ' ').replace('pending', 'awaiting').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => router.push(`/dashboard/student/document/${doc._id}`)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            View
                          </button>
                          {doc.status === 'completed' && (
                            <button 
                              onClick={() => window.open(`/api/documents/${doc._id}/download`, '_blank')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Download
                            </button>
                          )}
                          {doc.status === 'rejected' && (
                            <span className="text-red-600">
                              {doc.feedback && `Feedback: ${doc.feedback}`}
                            </span>
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
      </div>
    </DashboardLayout>
  );
}