// Updated Document Preview Page using PDF Format System
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import DashboardLayout from '@/components/DashboardLayout';
import SignaturePad from '@/components/SignaturePad';
import { saveAs } from 'file-saver';

// Import the new PDF format system
import PDFFormatManager, { 
  PDFFormatTypes, 
  getPDFComponent, 
  detectPDFFormat 
} from '@/pdfFormat';

export default function DocumentPreview({ params }) {
  // Use React.use to properly unwrap the params
  const documentId = React.use(params).id;
  
  const router = useRouter();
  const { data: session, status } = useSession();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [signature, setSignature] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureError, setSignatureError] = useState("");
  const [pdfError, setPdfError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  
  // New PDF format system state
  const [selectedFormat, setSelectedFormat] = useState(PDFFormatTypes.CLUB_EVENT_VOUCHER);
  const [availableFormats, setAvailableFormats] = useState([]);
  const [layoutOptions, setLayoutOptions] = useState({
    moveFinancialToPage2: false,
    moveAboutEventToPage2: false,
    moveSignaturesToPage2: false,
  });
  
  // Initialize available formats
  useEffect(() => {
    const formats = PDFFormatManager.getAvailableFormats();
    setAvailableFormats(formats);
  }, []);
  
  // Auto-detect format when document loads
  useEffect(() => {
    if (document) {
      try {
        const detectedFormat = detectPDFFormat(document);
        setSelectedFormat(detectedFormat);
      } catch (err) {
        console.warn('Could not auto-detect format, using default:', err);
        setSelectedFormat(PDFFormatTypes.CLUB_EVENT_VOUCHER);
      }
    }
  }, [document]);
  
  // Fetch document data
  useEffect(() => {
    if (status === 'authenticated' && documentId) {
      fetchDocument(documentId);
    }
  }, [status, documentId]);

  const fetchDocument = async (id) => {
    try {
      const response = await fetch(`/api/documents/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      
      const data = await response.json();
      
      // Add default financialProposal if it doesn't exist
      if (!data.financialProposal) {
        data.financialProposal = [];
      }
      
      setDocument(data);
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to load document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDocument = () => {
    router.push(`/dashboard/student/edit-document/${documentId}`);
  };

  const handleShowSignatureModal = () => {
    setShowSignatureModal(true);
  };

  const handleSignatureCapture = (signatureData) => {
    setSignature(signatureData);
    setShowSignatureModal(false);
  };

  const handleClearSignature = () => {
    setSignature(null);
  };

  // Handle layout option changes
  const handleLayoutOptionChange = (option) => {
    setLayoutOptions(prev => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  // Handle format change
  const handleFormatChange = (formatType) => {
    setSelectedFormat(formatType);
    
    // Reset layout options when changing formats
    setLayoutOptions({
      moveFinancialToPage2: false,
      moveAboutEventToPage2: false,
      moveSignaturesToPage2: false,
    });
  };

  const handleDownloadPDF = async () => {
    try {
      setPdfError(null);
      
      // Validate document for selected format
      const validation = PDFFormatManager.validateDocumentForFormat(document, selectedFormat);
      if (!validation.isValid) {
        setPdfError(`Document validation failed. Missing fields: ${validation.missingFields.join(', ')}`);
        return;
      }
      
      // Generate PDF using the format system
      const { component: PDFComponent } = await PDFFormatManager.generatePDF(
        document, 
        selectedFormat, 
        {
          signature,
          ...layoutOptions,
        }
      );
      
      const asPdf = pdf(
        <PDFComponent 
          document={document} 
          signature={signature} 
          {...layoutOptions}
        />
      );
      const blob = await asPdf.toBlob();
      saveAs(blob, `document-${documentId}-${selectedFormat}.pdf`);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setPdfError(`Failed to download PDF: ${err.message}`);
    }
  };

  const handleSubmitDocument = async () => {
    if (!signature) {
      setSignatureError("Please add your signature before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Validate document for selected format
      const validation = PDFFormatManager.validateDocumentForFormat(document, selectedFormat);
      if (!validation.isValid) {
        throw new Error(`Document validation failed. Missing fields: ${validation.missingFields.join(', ')}`);
      }
      
      // First, upload the signature image
      const signatureFormData = new FormData();
      signatureFormData.append('signature', dataURLtoFile(signature, 'student-signature.png'));
      signatureFormData.append('documentId', documentId);
      signatureFormData.append('role', 'student');

      const signatureResponse = await fetch('/api/documents/signature', {
        method: 'POST',
        body: signatureFormData,
      });

      if (!signatureResponse.ok) {
        throw new Error('Failed to upload signature');
      }

      const signatureResult = await signatureResponse.json();
      
      // Generate PDF document using format system
      const { component: PDFComponent } = await PDFFormatManager.generatePDF(
        document, 
        selectedFormat, 
        {
          signature,
          ...layoutOptions,
        }
      );
      
      const asPdf = pdf(
        <PDFComponent 
          document={document} 
          signature={signature} 
          {...layoutOptions}
        />
      );
      const blob = await asPdf.toBlob();
      
      // Create form data for PDF upload
      const pdfFormData = new FormData();
      pdfFormData.append('pdf', blob, `document-${selectedFormat}.pdf`);
      pdfFormData.append('documentId', documentId);
      pdfFormData.append('version', 'studentSigned');
      pdfFormData.append('format', selectedFormat);
      
      // Upload PDF
      const pdfResponse = await fetch('/api/documents/pdf', {
        method: 'POST',
        body: pdfFormData,
      });
      
      if (!pdfResponse.ok) {
        throw new Error('Failed to upload PDF');
      }
      
      const pdfResult = await pdfResponse.json();
      
      // Then update the document status
      const updateResponse = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signatures: {
            student: signatureResult.signaturePath
          },
          pdfVersions: {
            studentSigned: pdfResult.pdfPath
          },
          pdfFormat: selectedFormat, // Store the format used
          layoutOptions: layoutOptions, // Store layout preferences
          status: 'pending_faculty',
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update document');
      }

      // Redirect to student dashboard
      router.push('/dashboard/student');
      
    } catch (err) {
      console.error('Error submitting document:', err);
      setError(`Failed to submit document: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to convert data URL to file object
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type: mime});
  };

  // Render PDF using current format
  const renderPDF = () => {
    try {
      const PDFComponent = getPDFComponent(selectedFormat);
      return (
        <PDFComponent 
          document={document} 
          signature={signature}
          {...layoutOptions}
        />
      );
    } catch (err) {
      console.error('Error rendering PDF:', err);
      setPdfError(`Error rendering PDF: ${err.message}`);
      return null;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="spinner h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2">Loading document...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => router.push('/dashboard/student')}
            className="mt-2 text-blue-600 hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!document) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <p>Document not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Document Preview</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/dashboard/student')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleEditDocument}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit Document
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Format Selection */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">PDF Format Selection</h3>
          <div className="flex flex-wrap gap-2">
            {availableFormats.map((format) => (
              <button
                key={format.type}
                onClick={() => handleFormatChange(format.type)}
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  selectedFormat === format.type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                title={format.description}
              >
                {format.name}
              </button>
            ))}
          </div>
          {selectedFormat && (
            <p className="mt-2 text-xs text-gray-600">
              Current: {availableFormats.find(f => f.type === selectedFormat)?.description}
            </p>
          )}
        </div>

        {/* PDF Error */}
        {pdfError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{pdfError}</p>
          </div>
        )}

        {/* Layout options */}
        <div className="mb-3 flex gap-3 flex-wrap">
          <button
            onClick={() => handleLayoutOptionChange('moveFinancialToPage2')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white text-black hover:bg-gray-50"
          >
            {layoutOptions.moveFinancialToPage2 ? "Move Financial to Page 1" : "Move Financial to Page 2"}
          </button>
          <button
            onClick={() => handleLayoutOptionChange('moveAboutEventToPage2')}
            className="px-4 py-2 border text-black border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
          >
            {layoutOptions.moveAboutEventToPage2 ? "Move About Event to Page 1" : "Move About Event to Page 2"}
          </button>
          <button
            onClick={() => handleLayoutOptionChange('moveSignaturesToPage2')}
            className="px-4 py-2 border text-black border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
          >
            {layoutOptions.moveSignaturesToPage2 ? "Move Signatures to Page 1" : "Move Signatures to Page 2"}
          </button>
        </div>

        {/* PDF Preview */}
        <div className="mb-6 border-2 border-gray-200 rounded-lg overflow-hidden" style={{ height: "70vh" }}>
          <div className="h-full w-full">
            <PDFViewer 
              width="100%" 
              height="100%" 
              style={{ border: "none" }}
              onLoadSuccess={() => setPdfLoading(false)}
            >
              {renderPDF()}
            </PDFViewer>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-8">
          {!signature && (
            <button
              onClick={handleShowSignatureModal}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Signature
            </button>
          )}

          {signature && (
            <button
              onClick={handleClearSignature}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Signature
            </button>
          )}

          <button
            onClick={handleSubmitDocument}
            disabled={isSubmitting || !signature}
            className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isSubmitting || !signature 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Document'}
          </button>
        </div>

        {signatureError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{signatureError}</p>
          </div>
        )}

        {/* Signature Modal */}
        {showSignatureModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl">
              <h2 className="text-xl font-bold mb-4">Add Your Signature</h2>
              <SignaturePad onSave={handleSignatureCapture} onCancel={() => setShowSignatureModal(false)} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}