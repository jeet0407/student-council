"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ClubDetailsPage() {
    const params = useParams();
    const clubId = params.id;

    // State for club data
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for editable budgets
    const [sponsorshipBudget, setSponsorshipBudget] = useState(0);
    const [currentBudget, setCurrentBudget] = useState(0);
    const [isEditingSponsorshipBudget, setIsEditingSponsorshipBudget] = useState(false);
    const [isEditingCurrentBudget, setIsEditingCurrentBudget] = useState(false);
    const [tempSponsorshipBudget, setTempSponsorshipBudget] = useState(0);
    const [tempCurrentBudget, setTempCurrentBudget] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // State for Core Committee editing
    const [isEditingCoreCommittee, setIsEditingCoreCommittee] = useState(false);
    const [tempCoreCommittee, setTempCoreCommittee] = useState([]);

    // Fetch club data on mount
    useEffect(() => {
        const fetchClubData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/clubs/${clubId}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch club data");
                }

                const data = await response.json();
                setClub(data);
                setSponsorshipBudget(data.sponsorshipBudget);
                setCurrentBudget(data.currentBudget);
                setTempSponsorshipBudget(data.sponsorshipBudget);
                setTempCurrentBudget(data.currentBudget);
                setTempCoreCommittee(data.coreCommittee || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClubData();
    }, [clubId]);

    const handleSaveSponsorshipBudget = async () => {
        try {
            setIsSaving(true);
            setSaveError(null);

            const response = await fetch(`/api/clubs/${clubId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-role": "dean-sw",
                },
                body: JSON.stringify({
                    sponsorshipBudget: tempSponsorshipBudget,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update budget");
            }

            const updatedClub = await response.json();
            setSponsorshipBudget(tempSponsorshipBudget);
            setIsEditingSponsorshipBudget(false);
            setClub(updatedClub.club);
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelSponsorshipBudget = () => {
        setTempSponsorshipBudget(sponsorshipBudget);
        setIsEditingSponsorshipBudget(false);
        setSaveError(null);
    };

    const handleSaveCurrentBudget = async () => {
        try {
            setIsSaving(true);
            setSaveError(null);

            const response = await fetch(`/api/clubs/${clubId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-role": "dean-sw",
                },
                body: JSON.stringify({
                    currentBudget: tempCurrentBudget,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update budget");
            }

            const updatedClub = await response.json();
            setCurrentBudget(tempCurrentBudget);
            setIsEditingCurrentBudget(false);
            setClub(updatedClub.club);
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelCurrentBudget = () => {
        setTempCurrentBudget(currentBudget);
        setIsEditingCurrentBudget(false);
        setSaveError(null);
    };

    const handleEditCoreCommittee = () => {
        setIsEditingCoreCommittee(true);
        setSaveError(null);
    };

    const handleSaveCoreCommittee = async () => {
        try {
            setIsSaving(true);
            setSaveError(null);

            const response = await fetch(`/api/clubs/${clubId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-role": "dean-sw",
                },
                body: JSON.stringify({
                    coreCommittee: tempCoreCommittee,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update core committee");
            }

            const data = await response.json();
            setClub(data.club);
            setIsEditingCoreCommittee(false);
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelCoreCommittee = () => {
        setTempCoreCommittee(club.coreCommittee || []);
        setIsEditingCoreCommittee(false);
        setSaveError(null);
    };

    const handleCoreCommitteeChange = (index, field, value) => {
        const updated = [...tempCoreCommittee];
        updated[index] = { ...updated[index], [field]: value };
        setTempCoreCommittee(updated);
    };

    const handleAddMember = () => {
        setTempCoreCommittee([
            ...tempCoreCommittee,
            { name: "", role: "", email: "" },
        ]);
    };

    const handleRemoveMember = (index) => {
        const updated = tempCoreCommittee.filter((_, i) => i !== index);
        setTempCoreCommittee(updated);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Loading club data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h3 className="text-red-800 font-semibold mb-2">Error Loading Club Data</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!club) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <p className="text-yellow-800">Club not found</p>
                    </div>
                </div>
            </div>
        );
    }

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
                        <div className="bg-white rounded-lg shadow-md p-6 text-black">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600">
                                    Sponsorship Budget
                                </p>
                                {!isEditingSponsorshipBudget && (
                                    <button
                                        onClick={() => setIsEditingSponsorshipBudget(true)}
                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                        title="Edit Sponsorship Budget"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    {isEditingSponsorshipBudget ? (
                                        <div className="space-y-2">
                                            <input
                                                type="number"
                                                value={tempSponsorshipBudget}
                                                onChange={(e) => setTempSponsorshipBudget(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter amount"
                                                disabled={isSaving}
                                            />
                                            {saveError && (
                                                <p className="text-xs text-red-600">{saveError}</p>
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSaveSponsorshipBudget}
                                                    disabled={isSaving}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSaving ? "Saving..." : "Save"}
                                                </button>
                                                <button
                                                    onClick={handleCancelSponsorshipBudget}
                                                    disabled={isSaving}
                                                    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-2xl font-bold text-green-600">
                                            ₹{sponsorshipBudget.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center ml-4">
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
                        <div className="bg-white rounded-lg shadow-md p-6 text-black">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600">
                                    Current Budget
                                </p>
                                {!isEditingCurrentBudget && (
                                    <button
                                        onClick={() => setIsEditingCurrentBudget(true)}
                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                        title="Edit Current Budget"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    {isEditingCurrentBudget ? (
                                        <div className="space-y-2">
                                            <input
                                                type="number"
                                                value={tempCurrentBudget}
                                                onChange={(e) => setTempCurrentBudget(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter amount"
                                                disabled={isSaving}
                                            />
                                            {saveError && (
                                                <p className="text-xs text-red-600">{saveError}</p>
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSaveCurrentBudget}
                                                    disabled={isSaving}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSaving ? "Saving..." : "Save"}
                                                </button>
                                                <button
                                                    onClick={handleCancelCurrentBudget}
                                                    disabled={isSaving}
                                                    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-2xl font-bold text-purple-600">
                                            ₹{currentBudget.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center ml-4">
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
                                    {club.budgetHistory && club.budgetHistory.map((item, index) => (
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
                                    {club.upcomingEvents && club.upcomingEvents.map((event, index) => (
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
                                    {club.pastEvents && club.pastEvents.map((event, index) => (
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
                        {!isEditingCoreCommittee && (
                            <button
                                onClick={handleEditCoreCommittee}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Edit Committee
                            </button>
                        )}
                    </div>

                    {isEditingCoreCommittee ? (
                        <div className="bg-white rounded-lg shadow-md p-6 text-black">
                            {saveError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">{saveError}</p>
                                </div>
                            )}
                            
                            <div className="space-y-4 mb-6">
                                {tempCoreCommittee.map((member, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <div className="flex items-start justify-between mb-3">
                                            <h4 className="text-sm font-semibold text-gray-700">Member {index + 1}</h4>
                                            <button
                                                onClick={() => handleRemoveMember(index)}
                                                disabled={isSaving}
                                                className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                                                title="Remove Member"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    value={member.name}
                                                    onChange={(e) => handleCoreCommitteeChange(index, "name", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                    placeholder="Enter name"
                                                    disabled={isSaving}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                                                <input
                                                    type="text"
                                                    value={member.role}
                                                    onChange={(e) => handleCoreCommitteeChange(index, "role", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                    placeholder="Enter role"
                                                    disabled={isSaving}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    value={member.email}
                                                    onChange={(e) => handleCoreCommitteeChange(index, "email", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                    placeholder="Enter email"
                                                    disabled={isSaving}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddMember}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Member
                                </button>
                                <button
                                    onClick={handleSaveCoreCommittee}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    onClick={handleCancelCoreCommittee}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {club.coreCommittee && club.coreCommittee.map((member, index) => (
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
                    )}
                </div>
            </div>
        </div>
    );
}
