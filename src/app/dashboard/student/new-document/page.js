'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/DashboardLayout';

export default function NewDocument() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
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
    
    // Character limits
    if (formData.briefDescription.length > 500) {
      newErrors.briefDescription = 'Description must be under 500 characters';
    }
    
    if (formData.objectives.length > 500) {
      newErrors.objectives = 'Objectives must be under 500 characters';
    }
    
    // Document number format validation (xx/202x-202x)
    if (formData.documentNumber && !/^\d{2}\/\d{4}-\d{4}$/.test(formData.documentNumber)) {
      newErrors.documentNumber = 'Format should be XX/YYYY-YYYY (e.g., 07/2024-2025)';
    }
    
    // Date format validation (dd/mm/202x)
    if (formData.documentDate && !/^\d{4}-\d{2}-\d{2}$/.test(formData.documentDate)) {
      newErrors.documentDate = 'Please use the date picker to select a valid date';
    }
    
    // Mobile number validation (10 digits)
    const mobileFields = [
      'studentHeadMobile', 'studentSecretaryMobile', 
      'facultyCoChairman1Mobile', 'facultyCoChairman2Mobile', 'facultyChairmanMobile'
    ];
    
    mobileFields.forEach(field => {
      if (formData[field] && !/^\d{10}$/.test(formData[field])) {
        newErrors[field] = 'Mobile number should be 10 digits';
      }
    });
    
    // Financial proposal validation
    if (!formData.financialProposal || formData.financialProposal.length === 0) {
      newErrors.financialProposal = 'At least one financial item is required';
    } else {
      const hasValidItems = formData.financialProposal.some(item => 
        item.item.trim() !== '' && item.amount !== '' && parseFloat(item.amount) > 0
      );
      if (!hasValidItems) {
        newErrors.financialProposal = 'At least one item with valid description and amount is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create document');
      }
      
      const data = await response.json();
      
      // Navigate to document review page
      router.push(`/dashboard/student/document/${data._id}`);
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle "Review Document" button click
  const handleReview = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // For now, just submit the form - later we'll implement the PDF preview
      handleSubmit(e);
    }
  };
  
  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="spinner"></div>
            <p className="mt-2">Loading...</p>
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
          <h1 className="text-2xl font-bold">Create New Document</h1>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Information */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Document Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Document No. (format: XX/YYYY-YYYY)
                  </label>
                  <input
                    type="text"
                    name="documentNumber"
                    id="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    placeholder="07/2024-2025"
                    className={`w-full px-3 py-2 border ${errors.documentNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.documentNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.documentNumber}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="documentDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="documentDate"
                    id="documentDate"
                    value={formData.documentDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.documentDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.documentDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.documentDate}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Permission to Conduct Event with Financial Support"
                  className={`w-full px-3 py-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>
            </div>
            
            {/* Club Information */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Club Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-1">
                    Chapter/Club/Society/Section Name
                  </label>
                  <input
                    type="text"
                    name="clubName"
                    id="clubName"
                    value={formData.clubName}
                    onChange={handleChange}
                    placeholder="Cutting Edge Visionaries"
                    className={`w-full px-3 py-2 border ${errors.clubName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.clubName && (
                    <p className="mt-1 text-sm text-red-600">{errors.clubName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="clubCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Chapter/Club/Society/Section Code No
                  </label>
                  <input
                    type="text"
                    name="clubCode"
                    id="clubCode"
                    value={formData.clubCode}
                    onChange={handleChange}
                    placeholder="6/49"
                    className={`w-full px-3 py-2 border ${errors.clubCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.clubCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.clubCode}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Event Information */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Event Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="eventSchedule" className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule of Event (Date, Day)
                  </label>
                  <input
                    type="text"
                    name="eventSchedule"
                    id="eventSchedule"
                    value={formData.eventSchedule}
                    onChange={handleChange}
                    placeholder="27th July - 5th August (Online)"
                    className={`w-full px-3 py-2 border ${errors.eventSchedule ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.eventSchedule && (
                    <p className="mt-1 text-sm text-red-600">{errors.eventSchedule}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="eventVenue" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Venue
                  </label>
                  <input
                    type="text"
                    name="eventVenue"
                    id="eventVenue"
                    value={formData.eventVenue}
                    onChange={handleChange}
                    placeholder="Online on Unstop"
                    className={`w-full px-3 py-2 border ${errors.eventVenue ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.eventVenue && (
                    <p className="mt-1 text-sm text-red-600">{errors.eventVenue}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Title of the Event
                  </label>
                  <input
                    type="text"
                    name="eventTitle"
                    id="eventTitle"
                    value={formData.eventTitle}
                    onChange={handleChange}
                    placeholder="Strategix 5.0"
                    className={`w-full px-3 py-2 border ${errors.eventTitle ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.eventTitle && (
                    <p className="mt-1 text-sm text-red-600">{errors.eventTitle}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="eventCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Category of the Event
                  </label>
                  <input
                    type="text"
                    name="eventCategory"
                    id="eventCategory"
                    value={formData.eventCategory}
                    onChange={handleChange}
                    placeholder="Competition"
                    className={`w-full px-3 py-2 border ${errors.eventCategory ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.eventCategory && (
                    <p className="mt-1 text-sm text-red-600">{errors.eventCategory}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="briefDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Brief Description (Maximum 100 Words)
                </label>
                <textarea
                  name="briefDescription"
                  id="briefDescription"
                  rows="4"
                  value={formData.briefDescription}
                  onChange={handleChange}
                  placeholder="Describe your event briefly..."
                  className={`w-full px-3 py-2 border ${errors.briefDescription ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.briefDescription.length} / 500 characters
                </p>
                {errors.briefDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.briefDescription}</p>
                )}
              </div>
              
              <div className="mt-4">
                <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-1">
                  Objectives (Maximum 100 Words)
                </label>
                <textarea
                  name="objectives"
                  id="objectives"
                  rows="4"
                  value={formData.objectives}
                  onChange={handleChange}
                  placeholder="List the objectives of your event..."
                  className={`w-full px-3 py-2 border ${errors.objectives ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.objectives.length} / 500 characters
                </p>
                {errors.objectives && (
                  <p className="mt-1 text-sm text-red-600">{errors.objectives}</p>
                )}
              </div>
            </div>
            
            {/* Participation Information */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Participation Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    name="targetAudience"
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    placeholder="Students from all branches of the institute"
                    className={`w-full px-3 py-2 border ${errors.targetAudience ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.targetAudience && (
                    <p className="mt-1 text-sm text-red-600">{errors.targetAudience}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="expectedParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Number of Participants
                  </label>
                  <input
                    type="number"
                    name="expectedParticipants"
                    id="expectedParticipants"
                    value={formData.expectedParticipants}
                    onChange={handleChange}
                    placeholder="3000+"
                    className={`w-full px-3 py-2 border ${errors.expectedParticipants ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.expectedParticipants && (
                    <p className="mt-1 text-sm text-red-600">{errors.expectedParticipants}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="judges" className="block text-sm font-medium text-gray-700 mb-1">
                  Name of Judges/ (In case of Competition)/Expert (Minimum 2) with their designation/institute/company
                </label>
                <textarea
                  name="judges"
                  id="judges"
                  rows="3"
                  value={formData.judges}
                  onChange={handleChange}
                  placeholder="List the judges or experts with their details..."
                  className={`w-full px-3 py-2 border ${errors.judges ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                ></textarea>
                {errors.judges && (
                  <p className="mt-1 text-sm text-red-600">{errors.judges}</p>
                )}
              </div>
            </div>

            {/* Financial Proposal dynamic table */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Financial Proposal</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white rounded-md shadow">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item/Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.financialProposal.map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={row.item}
                            onChange={(e) => {
                              const newFinancialProposal = [...formData.financialProposal];
                              newFinancialProposal[index].item = e.target.value;
                              setFormData({ ...formData, financialProposal: newFinancialProposal });
                            }}
                            placeholder="Enter item/description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={row.amount}
                            onChange={(e) => {
                              const newFinancialProposal = [...formData.financialProposal];
                              newFinancialProposal[index].amount = e.target.value;
                              setFormData({ ...formData, financialProposal: newFinancialProposal });
                            }}
                            placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => {
                              const newFinancialProposal = formData.financialProposal.filter((_, i) => i !== index);
                              setFormData({ ...formData, financialProposal: newFinancialProposal });
                            }}
                            className="text-red-600 hover:text-red-900 font-medium"
                            disabled={formData.financialProposal.length === 1}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-6 py-4 text-right text-black">Total:</td>
                      <td className="px-6 py-4 text-black">
                        ₹{formData.financialProposal.reduce((total, row) => total + (parseFloat(row.amount) || 0), 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    const newFinancialProposal = [...formData.financialProposal, { item: '', amount: '' }];
                    setFormData({ ...formData, financialProposal: newFinancialProposal });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  + Add Row
                </button>
              </div>
              {errors.financialProposal && (
                <p className="mt-2 text-sm text-red-600">{errors.financialProposal}</p>
              )}
            </div>

            {/* Student Head Information */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Student Head Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="studentHeadName" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Head Name
                  </label>
                  <input
                    type="text"
                    name="studentHeadName"
                    id="studentHeadName"
                    value={formData.studentHeadName}
                    onChange={handleChange}
                    placeholder="Purv Kabaria"
                    className={`w-full px-3 py-2 border ${errors.studentHeadName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.studentHeadName && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentHeadName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="studentHeadRollNo" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Head Roll No.
                  </label>
                  <input
                    type="text"
                    name="studentHeadRollNo"
                    id="studentHeadRollNo"
                    value={formData.studentHeadRollNo}
                    onChange={handleChange}
                    placeholder="U23CS064"
                    className={`w-full px-3 py-2 border ${errors.studentHeadRollNo ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.studentHeadRollNo && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentHeadRollNo}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="studentHeadBranch" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Head Branch
                  </label>
                  <input
                    type="text"
                    name="studentHeadBranch"
                    id="studentHeadBranch"
                    value={formData.studentHeadBranch}
                    onChange={handleChange}
                    placeholder="CSE"
                    className={`w-full px-3 py-2 border ${errors.studentHeadBranch ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.studentHeadBranch && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentHeadBranch}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="studentHeadMobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Head Mobile No.
                  </label>
                  <input
                    type="text"
                    name="studentHeadMobile"
                    id="studentHeadMobile"
                    value={formData.studentHeadMobile}
                    onChange={handleChange}
                    placeholder="9724484681"
                    className={`w-full px-3 py-2 border ${errors.studentHeadMobile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.studentHeadMobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentHeadMobile}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Student Secretary Information */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Student Secretary Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="studentSecretaryName" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Secretary Name
                  </label>
                  <input
                    type="text"
                    name="studentSecretaryName"
                    id="studentSecretaryName"
                    value={formData.studentSecretaryName}
                    onChange={handleChange}
                    placeholder="Aviskar Jha"
                    className={`w-full px-3 py-2 border ${errors.studentSecretaryName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.studentSecretaryName && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentSecretaryName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="studentSecretaryRollNo" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Secretary Roll No.
                  </label>
                  <input
                    type="text"
                    name="studentSecretaryRollNo"
                    id="studentSecretaryRollNo"
                    value={formData.studentSecretaryRollNo}
                    onChange={handleChange}
                    placeholder="U23EE041"
                    className={`w-full px-3 py-2 border ${errors.studentSecretaryRollNo ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.studentSecretaryRollNo && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentSecretaryRollNo}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="studentSecretaryBranch" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Secretary Branch
                  </label>
                  <input
                    type="text"
                    name="studentSecretaryBranch"
                    id="studentSecretaryBranch"
                    value={formData.studentSecretaryBranch}
                    onChange={handleChange}
                    placeholder="EE"
                    className={`w-full px-3 py-2 border ${errors.studentSecretaryBranch ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.studentSecretaryBranch && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentSecretaryBranch}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="studentSecretaryMobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Secretary Mobile No.
                  </label>
                  <input
                    type="text"
                    name="studentSecretaryMobile"
                    id="studentSecretaryMobile"
                    value={formData.studentSecretaryMobile}
                    onChange={handleChange}
                    placeholder="9724484681"
                    className={`w-full px-3 py-2 border ${errors.studentSecretaryMobile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.studentSecretaryMobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentSecretaryMobile}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Faculty Co-Chairman 1 */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Faculty Co-Chairman 1</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="facultyCoChairman1Name" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Co-Chairman 1 Name
                  </label>
                  <input
                    type="text"
                    name="facultyCoChairman1Name"
                    id="facultyCoChairman1Name"
                    value={formData.facultyCoChairman1Name}
                    onChange={handleChange}
                    placeholder="Dr. Raju Prasad Mahto"
                    className={`w-full px-3 py-2 border ${errors.facultyCoChairman1Name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.facultyCoChairman1Name && (
                    <p className="mt-1 text-sm text-red-600">{errors.facultyCoChairman1Name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="facultyCoChairman1Designation" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Co-Chairman 1 Designation
                  </label>
                  <input
                    type="text"
                    name="facultyCoChairman1Designation"
                    id="facultyCoChairman1Designation"
                    value={formData.facultyCoChairman1Designation}
                    onChange={handleChange}
                    placeholder="Co-Chairperson CEV"
                    className={`w-full px-3 py-2 border ${errors.facultyCoChairman1Designation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.facultyCoChairman1Designation && (
                    <p className="mt-1 text-sm text-red-600">{errors.facultyCoChairman1Designation}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="facultyCoChairman1Dept" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Co-Chairman 1 Department
                  </label>
                  <input
                    type="text"
                    name="facultyCoChairman1Dept"
                    id="facultyCoChairman1Dept"
                    value={formData.facultyCoChairman1Dept}
                    onChange={handleChange}
                    placeholder="Mechanical Engineering"
                    className={`w-full px-3 py-2 border ${errors.facultyCoChairman1Dept ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.facultyCoChairman1Dept && (
                    <p className="mt-1 text-sm text-red-600">{errors.facultyCoChairman1Dept}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="facultyCoChairman1Mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Co-Chairman 1 Mobile No.
                  </label>
                  <input
                    type="text"
                    name="facultyCoChairman1Mobile"
                    id="facultyCoChairman1Mobile"
                    value={formData.facultyCoChairman1Mobile}
                    onChange={handleChange}
                    placeholder="8328759995"
                    className={`w-full px-3 py-2 border ${errors.facultyCoChairman1Mobile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.facultyCoChairman1Mobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.facultyCoChairman1Mobile}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Faculty Co-Chairman 2 */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Faculty Co-Chairman 2</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="facultyCoChairman2Name" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Co-Chairman 2 Name
                  </label>
                  <input
                    type="text"
                    name="facultyCoChairman2Name"
                    id="facultyCoChairman2Name"
                    value={formData.facultyCoChairman2Name}
                    onChange={handleChange}
                    placeholder="Dr. Nithin Chatterji"
                    className={`w-full px-3 py-2 border ${errors.facultyCoChairman2Name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.facultyCoChairman2Name && (
                    <p className="mt-1 text-sm text-red-600">{errors.facultyCoChairman2Name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="facultyCoChairman2Designation" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Co-Chairman 2 Designation
                  </label>
                  <input
                    type="text"
                    name="facultyCoChairman2Designation"
                    id="facultyCoChairman2Designation"
                    value={formData.facultyCoChairman2Designation}
                    onChange={handleChange}
                    placeholder="Co-Chairperson CEV"
                    className={`w-full px-3 py-2 border ${errors.facultyCoChairman2Designation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.facultyCoChairman2Designation && (
                    <p className="mt-1 text-sm text-red-600">{errors.facultyCoChairman2Designation}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="facultyCoChairman2Dept" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Co-Chairman 2 Department
                  </label>
                  <input
                    type="text"
                    name="facultyCoChairman2Dept"
                    id="facultyCoChairman2Dept"
                    value={formData.facultyCoChairman2Dept}
                    onChange={handleChange}
                    placeholder="Electronics and Communication Engineering"
                    className={`w-full px-3 py-2 border ${errors.facultyCoChairman2Dept ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.facultyCoChairman2Dept && (
                    <p className="mt-1 text-sm text-red-600">{errors.facultyCoChairman2Dept}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="facultyCoChairman2Mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Co-Chairman 2 Mobile No.
                  </label>
                  <input
                    type="text"
                    name="facultyCoChairman2Mobile"
                    id="facultyCoChairman2Mobile"
                    value={formData.facultyCoChairman2Mobile}
                    onChange={handleChange}
                    placeholder="9167473978"
                    className={`w-full px-3 py-2 border ${errors.facultyCoChairman2Mobile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.facultyCoChairman2Mobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.facultyCoChairman2Mobile}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Faculty Chairman */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Faculty Chairman</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="facultyChairmanName" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Chairman Name
                  </label>
                  <input
                    type="text"
                    name="facultyChairmanName"
                    id="facultyChairmanName"
                    value={formData.facultyChairmanName}
                    onChange={handleChange}
                    placeholder="Dr. Piyush N. Patel"
                    className={`w-full px-3 py-2 border ${errors.facultyChairmanName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.facultyChairmanName && (
                    <p className="mt-1 text-sm text-red-600">{errors.facultyChairmanName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="facultyChairmanDesignation" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Chairman Designation
                  </label>
                  <input
                    type="text"
                    name="facultyChairmanDesignation"
                    id="facultyChairmanDesignation"
                    value={formData.facultyChairmanDesignation}
                    onChange={handleChange}
                    placeholder="Chairperson CEV"
                    className={`w-full px-3 py-2 border ${errors.facultyChairmanDesignation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.facultyChairmanDesignation && (
                    <p className="mt-1 text-sm text-red-600">{errors.facultyChairmanDesignation}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="facultyChairmanDept" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Chairman Department
                  </label>
                  <input
                    type="text"
                    name="facultyChairmanDept"
                    id="facultyChairmanDept"
                    value={formData.facultyChairmanDept}
                    onChange={handleChange}
                    placeholder="Electronics and Communication Engineering"
                    className={`w-full px-3 py-2 border ${errors.facultyChairmanDept ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.facultyChairmanDept && (
                    <p className="mt-1 text-sm text-red-600">{errors.facultyChairmanDept}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="facultyChairmanMobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Chairman Mobile No.
                  </label>
                  <input
                    type="text"
                    name="facultyChairmanMobile"
                    id="facultyChairmanMobile"
                    value={formData.facultyChairmanMobile}
                    onChange={handleChange}
                    placeholder="8200301738"
                    className={`w-full px-3 py-2 border ${errors.facultyChairmanMobile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                  />
                  {errors.facultyChairmanMobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.facultyChairmanMobile}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/student')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReview}
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? 'Processing...' : 'Review Document'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}