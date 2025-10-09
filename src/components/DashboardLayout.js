'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const userRole = session?.user?.role || '';
  
  // Define dashboard path based on role
  const dashboardPath = {
    student_head: '/dashboard/student',
    faculty: '/dashboard/faculty',
    dean_swo: '/dashboard/dean-swo',
    dean_sw: '/dashboard/dean-sw',
  }[userRole] || '/dashboard';

  // Define navigation links based on role
  const getNavigationLinks = () => {
    switch(userRole) {
      case 'student_head':
        return [
          { name: 'Dashboard', href: dashboardPath },
          { name: 'New Document', href: '/dashboard/student/new-document' },
          { name: 'My Documents', href: '/dashboard/student/documents' },
        ];
      case 'faculty':
        return [
          { name: 'Dashboard', href: dashboardPath },
          { name: 'Pending Documents', href: '/dashboard/faculty/pending' },
          { name: 'Processed History', href: '/dashboard/faculty/history' },
        ];
      case 'dean_swo':
        return [
          { name: 'Dashboard', href: dashboardPath },
          { name: 'Pending Documents', href: '/dashboard/dean-swo/pending' },
          { name: 'Processed History', href: '/dashboard/dean-swo/history' },
        ];
      case 'dean_sw':
        return [
          { name: 'Dashboard', href: dashboardPath },
          { name: 'Pending Documents', href: '/dashboard/dean-sw/pending' },
          { name: 'Processed History', href: '/dashboard/dean-sw/history' },
        ];
      default:
        return [{ name: 'Dashboard', href: '/dashboard' }];
    }
  };

  const navigationLinks = getNavigationLinks();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className="md:hidden mr-3 text-gray-600 hover:text-gray-800"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center">
                <Image 
                  src="/logo-svnit.png" 
                  alt="SVNIT Logo" 
                  width={40} 
                  height={40} 
                  className="h-8 w-auto"
                />
                <h1 className="ml-2 text-lg font-medium text-gray-900">SVNIT Clubs Portal</h1>
              </div>
            </div>
            {session?.user && (
              <div className="flex items-center">
                <span className="mr-4 text-sm text-gray-700 hidden md:block">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar and Content */}
      <div className="flex">
        {/* Sidebar - Mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button 
                  onClick={toggleSidebar} 
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="px-4 mb-5 flex items-center">
                  <Image 
                    src="/logo-svnit.png" 
                    alt="SVNIT Logo" 
                    width={40} 
                    height={40} 
                    className="h-8 w-auto"
                  />
                  <h2 className="ml-2 text-lg font-medium text-gray-900">SVNIT Clubs Portal</h2>
                </div>
                <nav className="px-2 space-y-1">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar - Desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="px-4 mb-5 flex items-center">
                  <Image 
                    src="/logo-svnit.png" 
                    alt="SVNIT Logo" 
                    width={40} 
                    height={40} 
                    className="h-8 w-auto"
                  />
                  <h2 className="ml-2 text-lg font-medium text-gray-900">Navigation</h2>
                </div>
                <nav className="flex-1 px-2 bg-white space-y-1">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                {session?.user && (
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {session.user.name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                        {session.user.role.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}