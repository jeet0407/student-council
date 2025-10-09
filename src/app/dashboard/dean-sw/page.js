'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function DeanSWDashboard() {
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
        <h1 className="text-2xl font-bold mb-6">Dean SW Dashboard</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Documents</h2>
            
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dean SWO Approved</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{doc.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{doc.clubName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doc.signedAt.deanSWO ? new Date(doc.signedAt.deanSWO).toLocaleDateString() : 'Pending'}
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recently Approved Documents</h2>
            {/* Similar table for recently approved documents */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}