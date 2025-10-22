'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function FacultyDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [processedDocuments, setProcessedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Check correct role
    if (session && session.user.role !== 'faculty') {
      router.push('/unauthorized');
      return;
    }

    // Fetch pending documents for faculty
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/documents/faculty');
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch processed documents (approved or rejected by faculty)
    const fetchProcessedDocuments = async () => {
      try {
        const response = await fetch('/api/documents');
        const allDocs = await response.json();
        
        // Filter documents that have been processed by faculty
        const processed = allDocs.filter(doc => 
          doc.status !== 'pending_faculty' && 
          doc.approvalHistory?.some(approval => approval.role === 'faculty')
        );
        
        setProcessedDocuments(processed.slice(0, 10)); // Show last 10
      } catch (error) {
        console.error('Error fetching processed documents:', error);
      }
    };

    if (session) {
      fetchDocuments();
      fetchProcessedDocuments();
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
        <h1 className="text-2xl font-bold text-black mb-6">Faculty Chairperson Dashboard</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl text-black font-semibold mb-4">Pending Documents</h2>
            
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No pending documents requiring your approval.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-black">
                    {documents.map((doc) => (
                      <tr key={doc._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{doc.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{doc.clubName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{doc.createdBy.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => router.push(`/dashboard/faculty/review/${doc._id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl text-black font-semibold mb-4">Recently Processed Documents</h2>
            
            {processedDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No processed documents yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-black">
                    {processedDocuments.map((doc) => {
                      const facultyApproval = doc.approvalHistory?.find(a => a.role === 'faculty');
                      return (
                        <tr key={doc._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{doc.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{doc.clubName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs ${
                              doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              doc.status === 'passed' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {doc.status.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              facultyApproval?.action === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {facultyApproval?.action === 'approved' ? 'APPROVED' : 'REJECTED'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {facultyApproval ? new Date(facultyApproval.approvedAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => router.push(`/dashboard/faculty/review/${doc._id}`)}
                              className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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