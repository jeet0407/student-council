"use client";

import React from "react";

export default function ComplaintDetailModal({ complaint, isOpen, onClose }) {
    if (!isOpen || !complaint) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "In Progress":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "Resolved":
                return "bg-green-100 text-green-800 border-green-300";
            case "Rejected":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const getTagColor = (tag) => {
        switch (tag) {
            case "Hostel":
                return "bg-purple-100 text-purple-800 border-purple-300";
            case "Campus":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "Academics":
                return "bg-green-100 text-green-800 border-green-300";
            case "Miscellaneous":
                return "bg-gray-100 text-gray-800 border-gray-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Complaint Details
                        </h2>
                        <div className="flex items-center gap-2">
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full border ${getTagColor(
                                    complaint.tag
                                )}`}
                            >
                                {complaint.tag}
                            </span>
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                    complaint.status
                                )}`}
                            >
                                {complaint.status}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Student Information */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            Student Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-blue-700 font-medium mb-1">
                                    Name
                                </p>
                                <p className="text-sm text-gray-900 font-semibold">
                                    {complaint.studentName}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-700 font-medium mb-1">
                                    Email
                                </p>
                                <a
                                    href={`mailto:${complaint.studentEmail}`}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                >
                                    {complaint.studentEmail}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <svg
                                className="h-5 w-5 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                />
                            </svg>
                            Subject
                        </h3>
                        <p className="text-lg text-gray-900 font-medium bg-gray-50 p-3 rounded-lg border border-gray-200">
                            {complaint.subject}
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <svg
                                className="h-5 w-5 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Detailed Description
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                                {complaint.description}
                            </p>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <svg
                                className="h-5 w-5 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Additional Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-gray-600 mb-1">
                                    Complaint ID
                                </p>
                                <p className="text-sm text-gray-900 font-mono">
                                    {complaint._id}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 mb-1">
                                    Submitted Date
                                </p>
                                <p className="text-sm text-gray-900">
                                    {new Date(
                                        complaint.createdAt
                                    ).toLocaleString("en-IN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
                    >
                        Close
                    </button>
                    <a
                        href={`mailto:${complaint.studentEmail}?subject=Re: ${complaint.subject}`}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
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
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        Reply via Email
                    </a>
                </div>
            </div>
        </div>
    );
}
