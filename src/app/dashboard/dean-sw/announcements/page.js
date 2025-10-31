'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function AnnouncementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session) {
      setLoading(false);
    }
  }, [session, status, router]);

  // Sample announcements data - this can be fetched from an API
  const announcements = [
    {
      id: 1,
      title: 'New Academic Session Guidelines',
      excerpt: 'Important updates regarding the new academic session. All students are requested to review the updated guidelines...',
      description: 'Important updates regarding the new academic session. All students are requested to review the updated guidelines for attendance, examinations, and course registration procedures. The new guidelines include stricter attendance requirements, revised examination schedules, and updated course registration deadlines. Please ensure you comply with all requirements to avoid any academic issues.',
      date: 'October 25, 2025',
      category: 'Academic',
      author: 'Academic Office',
    },
    {
      id: 2,
      title: 'Scholarship Applications Open',
      excerpt: 'Applications for merit-based and need-based scholarships are now open. Eligible students can apply...',
      description: 'Applications for merit-based and need-based scholarships are now open. Eligible students can apply through the student portal before the deadline. The scholarship program offers financial assistance to deserving students based on academic merit and financial need. Required documents include academic transcripts, income certificates, and recommendation letters. Don\'t miss this opportunity to secure financial support for your education!',
      date: 'October 28, 2025',
      category: 'Financial Aid',
      author: 'Scholarship Committee',
    },
    {
      id: 3,
      title: 'Campus Placement Drive 2025',
      excerpt: 'The placement season kicks off next month with top companies visiting campus...',
      description: 'The placement season kicks off next month with top companies visiting campus. Final year students should update their resumes and register for pre-placement talks through the training and placement cell. Leading companies from IT, core engineering, and consulting sectors will be participating. Prepare well and make the most of this opportunity to launch your career.',
      date: 'October 30, 2025',
      category: 'Placements',
      author: 'Training & Placement Cell',
    },
    {
      id: 4,
      title: 'Library Extended Hours',
      excerpt: 'Due to upcoming examinations, the central library will now remain open until 2:00 AM...',
      description: 'Due to upcoming examinations, the central library will now remain open until 2:00 AM on weekdays. Students can utilize the extended hours for better preparation and research work. The library staff will be available to assist with book borrowing and reference materials. Additional study spaces have also been arranged in various departments.',
      date: 'October 31, 2025',
      category: 'Facilities',
      author: 'Library Administration',
    },
    {
      id: 5,
      title: 'Health & Wellness Camp',
      excerpt: 'Free health checkup camp organized by the medical center next week...',
      description: 'Free health checkup camp organized by the medical center next week. All students and staff are encouraged to participate. The camp will include general health screening, dental checkup, eye examination, and nutritional counseling. Specialists will be available for consultation. This is a great opportunity to ensure your health and well-being.',
      date: 'October 29, 2025',
      category: 'Health',
      author: 'Medical Center',
    },
    {
      id: 6,
      title: 'Internet Maintenance Schedule',
      excerpt: 'Network maintenance scheduled for this weekend. Internet services may be affected...',
      description: 'Network maintenance scheduled for this weekend. Internet services may be affected between 2:00 AM and 6:00 AM on Saturday and Sunday. The IT team will be upgrading network infrastructure to improve connectivity and speed. We apologize for any inconvenience caused. Please plan your work accordingly.',
      date: 'October 27, 2025',
      category: 'IT Services',
      author: 'IT Department',
    },
  ];

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
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Announcements
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Stay informed with the latest updates and notifications
          </p>
        </div>

        {/* Announcements List */}
        <div className="space-y-4 md:space-y-6">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden p-4 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {announcement.category}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{announcement.date}</span>
              </div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                {announcement.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
                {announcement.excerpt}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{announcement.author}</span>
                </div>

                <button
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                >
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {announcements.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 md:p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcements</h3>
            <p className="text-gray-600">
              There are no announcements at the moment. Check back later!
            </p>
          </div>
        )}
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative bg-gradient-to-br from-blue-400 to-indigo-600 p-6">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {selectedAnnouncement.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {selectedAnnouncement.title}
              </h2>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{selectedAnnouncement.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{selectedAnnouncement.author}</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-base mb-6">
                {selectedAnnouncement.description}
              </p>

              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
