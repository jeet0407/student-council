"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

// Static club data
const clubsData = {
    1: {
        name: "CEV NIT Surat",
        logo: "/clubs/cev.png",
        chairperson: "Purv Kabaria",
        coChairperson: "Vanishka",
        email: "cev@nitsurat.ac.in",
        allottedBudget: 60000,
        sponsorshipBudget: 0,
        currentBudget: 50000,
    },

};

const budgetHistory = [
    {
        date: "2024-01-15",
        description: "Initial Allocation",
        amount: 60000,
        balance: 60000,
    },
    {
        date: "2024-02-20",
        description: "StrategiX",
        amount: -10000,
        balance: 50000,
    },
];

const upcomingEvents = [
    { name: "Paradox", date: "2025-11-9" },
    { name: "FinFiesta", date: "2026-2-11" },
    { name: "Data Science Bootcamp", date: "2025-10-5" },
];

const pastEvents = [
    { name: "StrategiX", date: "2025-07-30" },
];

const coreCommittee = [
    {
        name: "Purv Kabaria",
        role: "Chairperson",
        email: "purv.dev@gmail.com",
        avatar: "/avatars/avatar1.png",
    },
    {
        name: "Vanishka",
        role: "Co-Chairperson",
        email: "vanishka@gmail.com",
        avatar: "/avatars/avatar2.png",
    },
    {
        name: "Vasu Sadariya",
        role: "Tresurer",
        email: "sadariyavasu5@gmail.com",
        avatar: "/avatars/avatar3.png",
    },
    {
        name: "Avishkar Jha",
        role: "Secretary",
        email: "avishkar.jha@gmail.com",
        avatar: "/avatars/avatar4.png",
    },
];

export default function ClubDetailsPage() {
    const params = useParams();
    const clubId = params.id;
    const club = clubsData[clubId] || clubsData[1];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <Navbar/>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Club Details
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage club information, budget, and events.
                    </p>
                </div>

                {/* Club Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Club Logo */}
                        <div className="flex-shrink-0">
                            <div className="relative h-32 w-32 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={club.logo}
                                    alt={club.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Club Info */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {club.name}
                            </h2>
                            <div className="space-y-2">
                                <p className="text-gray-700">
                                    <span className="font-semibold">
                                        Chairperson:
                                    </span>{" "}
                                    {club.chairperson}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">
                                        Co-Chairperson:
                                    </span>{" "}
                                    {club.coChairperson}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-semibold">
                                        Contact:
                                    </span>{" "}
                                    <a
                                        href={`mailto:${club.email}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {club.email}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Budget Information */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Budget Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Allotted Budget */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Allotted Budget
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ₹{club.allottedBudget.toLocaleString()}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Sponsorship Budget */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Sponsorship Budget
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        ₹
                                        {club.sponsorshipBudget.toLocaleString()}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg
                                        className="h-6 w-6 text-green-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Current Budget */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Current Budget
                                    </p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        ₹{club.currentBudget.toLocaleString()}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                    <svg
                                        className="h-6 w-6 text-purple-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Budget History Table */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Budget History
                    </h3>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Balance
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {budgetHistory.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(
                                                    item.date
                                                ).toLocaleDateString("en-IN")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.description}
                                            </td>
                                            <td
                                                className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                                                    item.amount >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {item.amount >= 0 ? "+" : ""}₹
                                                {Math.abs(
                                                    item.amount
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                                ₹{item.balance.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Events Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Upcoming Events */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Upcoming Events
                        </h3>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Event Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tentative Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {upcomingEvents.map((event, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {event.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(
                                                    event.date
                                                ).toLocaleDateString("en-IN")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Past Events */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Past Events
                        </h3>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Event Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pastEvents.map((event, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {event.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(
                                                    event.date
                                                ).toLocaleDateString("en-IN")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Core Committee Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                            Core Committee
                        </h3>
                        
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreCommittee.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col items-center text-center">
                                    {/* Avatar */}
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                                        {member.name.charAt(0)}
                                    </div>

                                    {/* Name */}
                                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                        {member.name}
                                    </h4>

                                    {/* Role */}
                                    <p className="text-sm text-blue-600 font-medium mb-2">
                                        {member.role}
                                    </p>

                                    {/* Email */}
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="text-xs text-gray-600 hover:text-blue-600 transition-colors break-all"
                                    >
                                        {member.email}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
