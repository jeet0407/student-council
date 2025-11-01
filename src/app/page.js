"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Show navbar when scrolling up or at the top
            if (currentScrollY < lastScrollY || currentScrollY < 100) {
                setShowNavbar(true);
            } else {
                // Hide navbar when scrolling down
                setShowNavbar(false);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    function handleGetStarted(e) {
        e.preventDefault();
        const eventsSection = document.getElementById("upcoming-events");
        if (eventsSection) {
            eventsSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }

    return (
        <div className="bg-white min-h-screen">
            <main>
                <section className="h-screen flex items-center justify-center relative overflow-hidden">
                    {/* Background Video */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        webkit-playsinline="true"
                        x5-playsinline="true"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        poster="/hero.png"
                        onLoadedMetadata={(e) => {
                            e.target.play().catch(error => {
                                console.log("Video autoplay failed:", error);
                            });
                        }}
                    >
                        <source src="/s-c.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    
                    {/* Fallback image for when video fails */}
                    <Image
                        src="/hero.png"
                        alt="Hero background"
                        fill
                        className="object-cover object-center -z-10"
                        priority
                    />

                    {/* Navbar - Fixed with scroll detection */}
                    <div 
                        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md transition-transform duration-300 ${
                            showNavbar ? 'translate-y-0' : '-translate-y-full'
                        }`}
                    >
                        <Navbar />
                    </div>

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/50 z-[1]" />

                    {/* Content */}
                    <div className="relative text-center z-[2] px-4 sm:px-6 flex flex-col items-center justify-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6 font-bold text-white drop-shadow-2xl">
                            Welcome to SVNIT SAMPARK
                        </h1>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            <button
                                onClick={handleGetStarted}
                                className="w-full sm:w-auto py-3 px-8 bg-blue-600 text-white border-none rounded-md cursor-pointer hover:bg-blue-700 transition-colors text-base sm:text-lg font-medium shadow-lg hover:shadow-xl"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>

                    {/* Scroll Down Indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[2] animate-bounce">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </div>
                </section>

                {/* Upcoming Events Section */}
                <section
                    id="upcoming-events"
                    className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12"
                >
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12">
                            Upcoming Events
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {/* Event Card 1 */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="relative h-48 sm:h-52 md:h-56 bg-gradient-to-br from-blue-400 to-blue-600">
                                    <Image
                                        src="/Kashish-Logo.png"
                                        alt="Tech Fest 2025"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4 sm:p-5">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                        Kashish 2025
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        THE OFFICIAL FRESHER’S PARTY
                                    </p>
                                </div>
                            </div>

                            {/* Event Card 2 */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="relative h-48 sm:h-52 md:h-56 bg-gradient-to-br from-green-400 to-green-600">
                                    <Image
                                        src="/thanganat.png"
                                        alt="Cultural Night"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4 sm:p-5">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                        Thanganat 2025
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        Official Garba Nights of SVNIT 🎉
                                        Embrace the beats of tradition and the
                                        spirit of celebration with us! 🥁
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Announcements Section */}
                <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12">
                            Announcements
                        </h2>

                        <div className="space-y-8 md:space-y-12">
                            {/* Announcement 1 - Image on Right */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="flex flex-col md:flex-row">
                                    <div className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 md:mb-4">
                                            New Academic Session Guidelines
                                        </h3>
                                        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                                            Important updates regarding the new
                                            academic session. All students are
                                            requested to review the updated
                                            guidelines for attendance,
                                            examinations, and course
                                            registration procedures.
                                        </p>
                                        <div className="mt-4 text-sm text-gray-500">
                                            Posted on: October 25, 2025
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Announcement 2 - Image on Left (reversed on desktop) */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="flex flex-col md:flex-row-reverse">
                                    <div className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 md:mb-4">
                                            Fee Remission Applications Open
                                        </h3>
                                        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                                            Applications for merit-based and
                                            need-based scholarships are now
                                            open. Eligible students can apply
                                            through the student portal before
                                            the deadline. Don&apos;t miss this
                                            opportunity!
                                        </p>
                                        <div className="mt-4 text-sm text-gray-500">
                                            Posted on: October 28, 2025
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Announcement 3 - Image on Right */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="flex flex-col md:flex-row">
                                    <div className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 md:mb-4">
                                            Campus Placement Drive 2025
                                        </h3>
                                        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                                            The placement season kicks off next
                                            month with top companies visiting
                                            campus. Final year students should
                                            update their resumes and register
                                            for pre-placement talks through the
                                            training and placement cell.
                                        </p>
                                        <div className="mt-4 text-sm text-gray-500">
                                            Posted on: October 30, 2025
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Announcement 4 - Image on Left (reversed on desktop) */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="flex flex-col md:flex-row-reverse">
                                    <div className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 md:mb-4">
                                            Library Extended Hours
                                        </h3>
                                        <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                                            Due to upcoming examinations, the
                                            central library will now remain open
                                            until 2:00 AM on weekdays. Students
                                            can utilize the extended hours for
                                            better preparation and research
                                            work.
                                        </p>
                                        <div className="mt-4 text-sm text-gray-500">
                                            Posted on: October 31, 2025
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
