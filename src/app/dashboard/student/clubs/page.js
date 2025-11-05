"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

const clubs = [
    {
        id: "690a4eef70ec9e94a3bf5f10", // MongoDB ObjectId from seeded data
        name: "CEV",
        image: "/clubs/cev.png",
    },
    
];

function ClubCard({ club }) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link href={`/dashboard/student/clubs/${club.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 cursor-pointer">
            {/* Club Image */}
            <div className="relative h-48 w-full bg-gray-100">
                {!imageError ? (
                    <Image
                        src={club.image}
                        alt={club.name}
                        fill
                        className="object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-white text-4xl font-bold">
                            {club.name.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Club Info */}
            <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {club.name}
                </h3>
            </div>
        </div>
        </Link>
    );
}

export default function ClubsPage() {
    return (
        <DashboardLayout>
            <div className="py-6 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        CEV Club
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Overview of your student club
                    </p>
                </div>

                {/* Clubs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {clubs.map((club) => (
                        <ClubCard key={club.id} club={club} />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
