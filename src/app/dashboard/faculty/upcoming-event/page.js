'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function UpcomingEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session) {
      setLoading(false);
    }
  }, [session, status, router]);

  // Sample events data - this can be fetched from an API
  const events = [
    {
      id: 1,
      title: 'StrategiX',
      description: 'Flagship CEV event with Nationwide case study competition,Stock market related session and competition, Resource allocation and Strategy and Game theory Event on efficiently mapping your city with respect to resources and environment and optimizing it to the fullest from the scratch. ',
      date: 'November 15-16, 2025',
      time: '9:00 AM - 6:00 PM',
      venue: 'Classroom, SVNIT',
    },
    {
      id: 2,
      title: 'FinFiesta',
      description: 'Flagship CEV event with Nationwide case study competition,Stock market related session and competition, Resource allocation and Strategy and Game theory Event on efficiently mapping your city with respect to resources and environment and optimizing it to the fullest from the scratch. ',
      date: 'November 20, 2025',
      time: '9:00 AM - 6:00 PM',
      venue: 'Classroom, SVNIT',
      
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
            Upcoming Events
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Stay updated with the latest events happening on campus
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Event Details */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                 
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                  {event.description}
                </p>

                {/* Event Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{event.venue}</span>
                  </div>
                </div>

                
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no events) */}
        {events.length === 0 && (
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Events</h3>
            <p className="text-gray-600">
              There are no events scheduled at the moment. Check back later!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
