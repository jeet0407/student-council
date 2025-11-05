'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';

export default function EditDocument({ params }) {
  const documentId = React.use(params).id;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    documentNumber: '',
    documentDate: new Date().toISOString().split('T')[0],
    subject: '',
    clubName: '',
    clubCode: '',
    eventSchedule: '',
    eventVenue: '',
    eventTitle: '',
    eventCategory: '',
    briefDescription: '',
    objectives: '',
    targetAudience: '',
    expectedParticipants: '',
    judges: '',
    
    // Student Head info
    studentHeadName: '',
    studentHeadRollNo: '',
    studentHeadBranch: '',
    studentHeadMobile: '',
    
    // Student Secretary info
    studentSecretaryName: '',
    studentSecretaryRollNo: '',
    studentSecretaryBranch: '',
    studentSecretaryMobile: '',
    
    // Faculty Co-Chairman 1
    facultyCoChairman1Name: '',
    facultyCoChairman1Designation: '',
    facultyCoChairman1Dept: '',
    facultyCoChairman1Mobile: '',
    
    // Faculty Co-Chairman 2
    facultyCoChairman2Name: '',
    facultyCoChairman2Designation: '',
    facultyCoChairman2Dept: '',
    facultyCoChairman2Mobile: '',
    
    // Faculty Chairman
    facultyChairmanName: '',
    facultyChairmanDesignation: '',
    facultyChairmanDept: '',
    facultyChairmanMobile: '',
    
    // Financial Proposal
    financialProposal: [
      { item: '', amount: '' }
    ],
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      
      const data = await response.json();
      
      // Check if document is in draft status
      if (data.status !== 'draft') {
        alert('This document has already been submitted and cannot be edited.');
        router.push('/dashboard/student');
        return;
      }

      // Populate form with existing data
      setFormData({
        documentNumber: data.documentNumber || '',
        documentDate: data.documentDate ? new Date(data.documentDate).toISOString().split('T')[0] : '',
        subject: data.subject || '',
        clubName: data.clubName || '',
        clubCode: data.clubCode || '',
        eventSchedule: data.eventDate || '',
        eventVenue: data.eventVenue || '',
        eventTitle: data.title || '',
        eventCategory: data.eventCategory || '',
        briefDescription: data.description || '',
        objectives: data.objectives || '',
        targetAudience: data.targetAudience || '',
        expectedParticipants: data.expectedParticipants || '',
        judges: data.judges || '',
        
        studentHeadName: data.studentHead?.name || '',
        studentHeadRollNo: data.studentHead?.rollNo || '',
        studentHeadBranch: data.studentHead?.branch || '',
        studentHeadMobile: data.studentHead?.mobile || '',
        
        studentSecretaryName: data.studentSecretary?.name || '',
        studentSecretaryRollNo: data.studentSecretary?.rollNo || '',
        studentSecretaryBranch: data.studentSecretary?.branch || '',
        studentSecretaryMobile: data.studentSecretary?.mobile || '',
        
        facultyCoChairman1Name: data.facultyCoChairman1?.name || '',
        facultyCoChairman1Designation: data.facultyCoChairman1?.designation || '',
        facultyCoChairman1Dept: data.facultyCoChairman1?.department || '',
        facultyCoChairman1Mobile: data.facultyCoChairman1?.mobile || '',
        
        facultyCoChairman2Name: data.facultyCoChairman2?.name || '',
        facultyCoChairman2Designation: data.facultyCoChairman2?.designation || '',
        facultyCoChairman2Dept: data.facultyCoChairman2?.department || '',
        facultyCoChairman2Mobile: data.facultyCoChairman2?.mobile || '',
        
        facultyChairmanName: data.facultyChairman?.name || '',
        facultyChairmanDesignation: data.facultyChairman?.designation || '',
        facultyChairmanDept: data.facultyChairman?.department || '',
        facultyChairmanMobile: data.facultyChairman?.mobile || '',
        
        financialProposal: data.financialProposal && data.financialProposal.length > 0 
          ? data.financialProposal 
          : [{ item: '', amount: '' }],
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching document:', err);
      alert('Failed to load document. Please try again.');
      router.push('/dashboard/student');
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && documentId) {
      fetchDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, documentId]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = [
      'documentNumber', 'documentDate', 'subject', 'clubName', 'clubCode',
      'eventSchedule', 'eventVenue', 'eventTitle', 'eventCategory', 
      'briefDescription', 'objectives', 'targetAudience', 'expectedParticipants',
      'studentHeadName', 'studentHeadRollNo', 'studentHeadBranch', 'studentHeadMobile',
      'facultyChairmanName', 'facultyChairmanDesignation', 'facultyChairmanDept', 'facultyChairmanMobile'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Validate mobile numbers (10 digits)
    const mobileFields = ['studentHeadMobile', 'studentSecretaryMobile', 'facultyCoChairman1Mobile', 'facultyCoChairman2Mobile', 'facultyChairmanMobile'];
    mobileFields.forEach(field => {
      if (formData[field] && !/^\d{10}$/.test(formData[field])) {
        newErrors[field] = 'Mobile number must be 10 digits';
      }
    });
    
    // Validate financial proposal - at least one item with amount
    const hasValidFinancialItem = formData.financialProposal.some(
      item => item.item.trim() && item.amount && parseFloat(item.amount) > 0
    );
    
    if (!hasValidFinancialItem) {
      newErrors.financialProposal = 'Please add at least one valid financial item';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle financial proposal changes
  const handleFinancialProposalChange = (index, field, value) => {
    const updatedProposal = [...formData.financialProposal];
    updatedProposal[index] = {
      ...updatedProposal[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      financialProposal: updatedProposal,
    });
  };
  
  const addFinancialProposalItem = () => {
    setFormData({
      ...formData,
      financialProposal: [...formData.financialProposal, { item: '', amount: '' }],
    });
  };
  
  const removeFinancialProposalItem = (index) => {
    const updatedProposal = formData.financialProposal.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      financialProposal: updatedProposal.length > 0 ? updatedProposal : [{ item: '', amount: '' }],
    });
  };
  
  // Handle form submission (save changes)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format data to match Document model structure
      const updateData = {
        title: formData.eventTitle,
        documentNumber: formData.documentNumber,
        documentDate: formData.documentDate,
        subject: formData.subject,
        clubName: formData.clubName,
        clubCode: formData.clubCode,
        eventDate: formData.eventSchedule,
        eventVenue: formData.eventVenue,
        eventCategory: formData.eventCategory,
        description: formData.briefDescription,
        objectives: formData.objectives,
        targetAudience: formData.targetAudience,
        expectedParticipants: formData.expectedParticipants,
        judges: formData.judges,
        
        // Student Head info (nested object)
        studentHead: {
          name: formData.studentHeadName,
          rollNo: formData.studentHeadRollNo,
          branch: formData.studentHeadBranch,
          mobile: formData.studentHeadMobile,
        },
        
        // Student Secretary info (nested object)
        studentSecretary: {
          name: formData.studentSecretaryName || '',
          rollNo: formData.studentSecretaryRollNo || '',
          branch: formData.studentSecretaryBranch || '',
          mobile: formData.studentSecretaryMobile || '',
        },
        
        // Faculty Co-Chairman 1 (nested object)
        facultyCoChairman1: {
          name: formData.facultyCoChairman1Name || '',
          designation: formData.facultyCoChairman1Designation || '',
          department: formData.facultyCoChairman1Dept || '',
          mobile: formData.facultyCoChairman1Mobile || '',
        },
        
        // Faculty Co-Chairman 2 (nested object)
        facultyCoChairman2: {
          name: formData.facultyCoChairman2Name || '',
          designation: formData.facultyCoChairman2Designation || '',
          department: formData.facultyCoChairman2Dept || '',
          mobile: formData.facultyCoChairman2Mobile || '',
        },
        
        // Faculty Chairman (nested object)
        facultyChairman: {
          name: formData.facultyChairmanName || '',
          designation: formData.facultyChairmanDesignation || '',
          department: formData.facultyChairmanDept || '',
          mobile: formData.facultyChairmanMobile || '',
        },
        
        // Financial proposal
        financialProposal: formData.financialProposal || [{ item: '', amount: 0 }],
      };

      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update document');
      }
      
      alert('Document updated successfully!');
      router.push(`/dashboard/student/document/${documentId}`);
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center text-black justify-center h-64">
          <div className="text-center">
            <div className="spinner h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2">Loading document...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (status === 'unauthenticated' || (session && session.user.role !== 'student_head')) {
    router.push(status === 'unauthenticated' ? '/login' : '/unauthorized');
    return null;
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Edit Document</h1>
          <button
            onClick={() => router.push(`/dashboard/student/document/${documentId}`)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {/* Document Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Document Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.documentNumber && <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="documentDate"
                  value={formData.documentDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.documentDate && <p className="text-red-500 text-xs mt-1">{errors.documentDate}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>
            </div>
          </div>

          {/* Club Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Club Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Club Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.clubName && <p className="text-red-500 text-xs mt-1">{errors.clubName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Club Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="clubCode"
                  value={formData.clubCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.clubCode && <p className="text-red-500 text-xs mt-1">{errors.clubCode}</p>}
              </div>
            </div>
          </div>

          {/* Event Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Event Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="eventTitle"
                  value={formData.eventTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.eventTitle && <p className="text-red-500 text-xs mt-1">{errors.eventTitle}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="eventCategory"
                  value={formData.eventCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="e.g., Technical, Cultural, Sports"
                />
                {errors.eventCategory && <p className="text-red-500 text-xs mt-1">{errors.eventCategory}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Schedule <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="eventSchedule"
                  value={formData.eventSchedule}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="e.g., March 15, 2024"
                />
                {errors.eventSchedule && <p className="text-red-500 text-xs mt-1">{errors.eventSchedule}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Venue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="eventVenue"
                  value={formData.eventVenue}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.eventVenue && <p className="text-red-500 text-xs mt-1">{errors.eventVenue}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brief Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="briefDescription"
                  value={formData.briefDescription}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.briefDescription && <p className="text-red-500 text-xs mt-1">{errors.briefDescription}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objectives <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.objectives && <p className="text-red-500 text-xs mt-1">{errors.objectives}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="e.g., All Students, CSE Department"
                />
                {errors.targetAudience && <p className="text-red-500 text-xs mt-1">{errors.targetAudience}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Participants <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="expectedParticipants"
                  value={formData.expectedParticipants}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="e.g., 100-150 students"
                />
                {errors.expectedParticipants && <p className="text-red-500 text-xs mt-1">{errors.expectedParticipants}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judges (if applicable)
                </label>
                <input
                  type="text"
                  name="judges"
                  value={formData.judges}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Names of judges, if any"
                />
              </div>
            </div>
          </div>

          {/* Student Head Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Student Head Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentHeadName"
                  value={formData.studentHeadName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.studentHeadName && <p className="text-red-500 text-xs mt-1">{errors.studentHeadName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentHeadRollNo"
                  value={formData.studentHeadRollNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.studentHeadRollNo && <p className="text-red-500 text-xs mt-1">{errors.studentHeadRollNo}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentHeadBranch"
                  value={formData.studentHeadBranch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.studentHeadBranch && <p className="text-red-500 text-xs mt-1">{errors.studentHeadBranch}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="studentHeadMobile"
                  value={formData.studentHeadMobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="10 digits"
                />
                {errors.studentHeadMobile && <p className="text-red-500 text-xs mt-1">{errors.studentHeadMobile}</p>}
              </div>
            </div>
          </div>

          {/* Student Secretary Information (Optional) */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Student Secretary Information (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="studentSecretaryName"
                  value={formData.studentSecretaryName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll No</label>
                <input
                  type="text"
                  name="studentSecretaryRollNo"
                  value={formData.studentSecretaryRollNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <input
                  type="text"
                  name="studentSecretaryBranch"
                  value={formData.studentSecretaryBranch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="tel"
                  name="studentSecretaryMobile"
                  value={formData.studentSecretaryMobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="10 digits"
                />
                {errors.studentSecretaryMobile && <p className="text-red-500 text-xs mt-1">{errors.studentSecretaryMobile}</p>}
              </div>
            </div>
          </div>

          {/* Faculty Co-Chairman 1 (Optional) */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Faculty Co-Chairman 1 (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="facultyCoChairman1Name"
                  value={formData.facultyCoChairman1Name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="facultyCoChairman1Designation"
                  value={formData.facultyCoChairman1Designation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="facultyCoChairman1Dept"
                  value={formData.facultyCoChairman1Dept}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="tel"
                  name="facultyCoChairman1Mobile"
                  value={formData.facultyCoChairman1Mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="10 digits"
                />
                {errors.facultyCoChairman1Mobile && <p className="text-red-500 text-xs mt-1">{errors.facultyCoChairman1Mobile}</p>}
              </div>
            </div>
          </div>

          {/* Faculty Co-Chairman 2 (Optional) */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Faculty Co-Chairman 2 (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="facultyCoChairman2Name"
                  value={formData.facultyCoChairman2Name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="facultyCoChairman2Designation"
                  value={formData.facultyCoChairman2Designation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="facultyCoChairman2Dept"
                  value={formData.facultyCoChairman2Dept}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="tel"
                  name="facultyCoChairman2Mobile"
                  value={formData.facultyCoChairman2Mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="10 digits"
                />
                {errors.facultyCoChairman2Mobile && <p className="text-red-500 text-xs mt-1">{errors.facultyCoChairman2Mobile}</p>}
              </div>
            </div>
          </div>

          {/* Faculty Chairman */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">Faculty Chairman <span className="text-red-500">*</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="facultyChairmanName"
                  value={formData.facultyChairmanName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.facultyChairmanName && <p className="text-red-500 text-xs mt-1">{errors.facultyChairmanName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="facultyChairmanDesignation"
                  value={formData.facultyChairmanDesignation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.facultyChairmanDesignation && <p className="text-red-500 text-xs mt-1">{errors.facultyChairmanDesignation}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="facultyChairmanDept"
                  value={formData.facultyChairmanDept}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                {errors.facultyChairmanDept && <p className="text-red-500 text-xs mt-1">{errors.facultyChairmanDept}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="facultyChairmanMobile"
                  value={formData.facultyChairmanMobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="10 digits"
                />
                {errors.facultyChairmanMobile && <p className="text-red-500 text-xs mt-1">{errors.facultyChairmanMobile}</p>}
              </div>
            </div>
          </div>

          {/* Financial Proposal */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-black mb-4">
              Financial Proposal <span className="text-red-500">*</span>
            </h2>
            {errors.financialProposal && (
              <p className="text-red-500 text-sm mb-2">{errors.financialProposal}</p>
            )}
            <div className="space-y-3">
              {formData.financialProposal.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Item description"
                      value={item.item}
                      onChange={(e) => handleFinancialProposalChange(index, 'item', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div className="w-40">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={item.amount}
                      onChange={(e) => handleFinancialProposalChange(index, 'amount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {formData.financialProposal.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFinancialProposalItem(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFinancialProposalItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                + Add Item
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/student/document/${documentId}`)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
