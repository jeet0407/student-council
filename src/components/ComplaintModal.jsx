"use client";

import React, { useState } from "react";

export default function ComplaintModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        studentName: "",
        studentEmail: "",
        tag: "",
        subject: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const tags = ["Hostel", "Campus", "Academics", "Miscellaneous"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate student name
        if (!formData.studentName.trim()) {
            newErrors.studentName = "Student name is required";
        }

        // Validate email
        if (!formData.studentEmail.trim()) {
            newErrors.studentEmail = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.studentEmail)) {
            newErrors.studentEmail = "Please enter a valid email address";
        }

        // Validate tag
        if (!formData.tag) {
            newErrors.tag = "Please select a complaint tag";
        }

        // Validate subject
        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        } else if (formData.subject.trim().length < 5) {
            newErrors.subject = "Subject must be at least 5 characters";
        } else if (formData.subject.trim().length > 100) {
            newErrors.subject = "Subject must not exceed 100 characters";
        }

        // Validate description
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.trim().length < 10) {
            newErrors.description =
                "Description must be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/complaints", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit complaint");
            }

            // Reset form
            setFormData({
                studentName: "",
                studentEmail: "",
                tag: "",
                subject: "",
                description: "",
            });
            setErrors({});

            // Call success callback
            onSuccess();
        } catch (error) {
            setSubmitError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                studentName: "",
                studentEmail: "",
                tag: "",
                subject: "",
                description: "",
            });
            setErrors({});
            setSubmitError("");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Register a Complaint
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {submitError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">
                                {submitError}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4 text-black">
                        {/* Student Name */}
                        <div>
                            <label
                                htmlFor="studentName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Student Name <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="studentName"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 ${
                                    errors.studentName
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter your full name"
                            />
                            {errors.studentName && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.studentName}
                                </p>
                            )}
                        </div>

                        {/* Student Email */}
                        <div>
                            <label
                                htmlFor="studentEmail"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Student Email <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="email"
                                id="studentEmail"
                                name="studentEmail"
                                value={formData.studentEmail}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 ${
                                    errors.studentEmail
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="your.email@example.com"
                            />
                            {errors.studentEmail && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.studentEmail}
                                </p>
                            )}
                        </div>

                        {/* Complaint Tag */}
                        <div>
                            <label
                                htmlFor="tag"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Complaint Tag <span className="text-red-600">*</span>
                            </label>
                            <select
                                id="tag"
                                name="tag"
                                value={formData.tag}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 ${
                                    errors.tag
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            >
                                <option value="">Select a category</option>
                                {tags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                            {errors.tag && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.tag}
                                </p>
                            )}
                        </div>

                        {/* Subject */}
                        <div>
                            <label
                                htmlFor="subject"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Subject <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                maxLength={100}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 ${
                                    errors.subject
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Brief summary of your complaint"
                            />
                            <div className="flex items-center justify-between mt-1">
                                {errors.subject ? (
                                    <p className="text-xs text-red-600">
                                        {errors.subject}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-500">
                                        5-100 characters
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    {formData.subject.length}/100
                                </p>
                            </div>
                        </div>

                        {/* Complaint Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Complaint Description <span className="text-red-600">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                rows={5}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 ${
                                    errors.description
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Please describe your complaint in detail (minimum 10 characters)"
                            />
                            <div className="flex items-center justify-between mt-1">
                                {errors.description ? (
                                    <p className="text-xs text-red-600">
                                        {errors.description}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-500">
                                        Minimum 10 characters
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    {formData.description.length} characters
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Complaint"}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
