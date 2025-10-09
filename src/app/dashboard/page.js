'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Redirect to role-specific dashboard
    if (session?.user?.role) {
      switch (session.user.role) {
        case 'student_head':
          router.push('/dashboard/student');
          break;
        case 'faculty':
          router.push('/dashboard/faculty');
          break;
        case 'dean_swo':
          router.push('/dashboard/dean-swo');
          break;
        case 'dean_sw':
          router.push('/dashboard/dean-sw');
          break;
        default:
          router.push('/login');
      }
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // This component shouldn't render anything as it redirects
  return null;
}