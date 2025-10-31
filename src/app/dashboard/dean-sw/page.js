'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function DeanSWDashboard() {
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
    if (session && session.user.role !== 'dean_sw') {
      router.push('/unauthorized');
      return;
    }

    // Fetch pending documents for Dean SW
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/documents/dean-sw');
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch processed documents (approved or rejected by dean_sw)
    const fetchProcessedDocuments = async () => {
      try {
        const response = await fetch('/api/documents');
        const allDocs = await response.json();
        
        // Filter documents that have been processed by dean_sw
        const processed = allDocs.filter(doc => 
          doc.status !== 'pending_dean_sw' && 
          doc.approvalHistory?.some(approval => approval.role === 'dean_sw')
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
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 text-black">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 md:mb-6">Dean SW Dashboard</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-3 sm:p-4 md:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Pending Documents</h2>
            
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No pending documents requiring your approval.</p>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dean SWO Approved</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents.map((doc) => {
                        const deanSWOApproval = doc.approvalHistory?.find(a => a.role === 'dean_swo');
                        return (
                          <tr key={doc._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{doc.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{doc.clubName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {deanSWOApproval ? new Date(deanSWOApproval.approvedAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button 
                                onClick={() => router.push(`/dashboard/dean-sw/review/${doc._id}`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet View */}
                <div className="md:hidden space-y-4">
                  {documents.map((doc) => {
                    const deanSWOApproval = doc.approvalHistory?.find(a => a.role === 'dean_swo');
                    return (
                      <div key={doc._id} className="border border-gray-200 rounded-lg p-4 space-y-2">
                        <div className="font-semibold text-gray-900">{doc.title}</div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Club:</span> {doc.clubName}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Dean SWO Approved:</span>{' '}
                          {deanSWOApproval ? new Date(deanSWOApproval.approvedAt).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Submitted:</span>{' '}
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </div>
                        <button 
                          onClick={() => router.push(`/dashboard/dean-sw/review/${doc._id}`)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm mt-2"
                        >
                          Review
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 md:mt-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-3 sm:p-4 md:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recently Approved Documents</h2>
            
            {processedDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No approved documents yet.</p>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
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
                    <tbody className="bg-white divide-y divide-gray-200">
                      {processedDocuments.map((doc) => {
                        const deanSWApproval = doc.approvalHistory?.find(a => a.role === 'dean_sw');
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
                                deanSWApproval?.action === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {deanSWApproval?.action === 'approved' ? 'APPROVED' : 'REJECTED'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {deanSWApproval ? new Date(deanSWApproval.approvedAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button 
                                onClick={() => router.push(`/dashboard/dean-sw/review/${doc._id}`)}
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

                {/* Mobile/Tablet View */}
                <div className="lg:hidden space-y-4">
                  {processedDocuments.map((doc) => {
                    const deanSWApproval = doc.approvalHistory?.find(a => a.role === 'dean_sw');
                    return (
                      <div key={doc._id} className="border border-gray-200 rounded-lg p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-gray-900 flex-1">{doc.title}</div>
                          <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                            doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            doc.status === 'passed' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {doc.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Club:</span> {doc.clubName}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Your Action:</span>{' '}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            deanSWApproval?.action === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {deanSWApproval?.action === 'approved' ? 'APPROVED' : 'REJECTED'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Date:</span>{' '}
                          {deanSWApproval ? new Date(deanSWApproval.approvedAt).toLocaleDateString() : 'N/A'}
                        </div>
                        <button 
                          onClick={() => router.push(`/dashboard/dean-sw/review/${doc._id}`)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm mt-2"
                        >
                          View Details
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}