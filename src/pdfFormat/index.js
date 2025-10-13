// PDF Format Index - Central registry for all PDF formats
import { CEVPDFFormat } from './generatePdfCEV';
import { SEVPDFFormat } from './generatePdfSEV';
import CEVPDFDocument from './CEVComponents';

// Central registry of all available PDF formats
export const PDFFormats = {
  CEV: CEVPDFFormat,
  SEV: SEVPDFFormat,
};

// Format type constants
export const PDFFormatTypes = {
  CLUB_EVENT_VOUCHER: 'CEV',
  SPORTS_EVENT_VOUCHER: 'SEV',
  TECHNICAL_EVENT_VOUCHER: 'TEV',
  CULTURAL_EVENT_VOUCHER: 'CULEV',
  WORKSHOP_VOUCHER: 'WV',
  CONFERENCE_VOUCHER: 'CV',
};

// PDF Document Components registry
export const PDFComponents = {
  CEV: CEVPDFDocument,
  // SEV: SEVPDFDocument, // To be imported when created
  // TEV: TEVPDFDocument, // To be imported when created
  // Add more as needed
};

// Factory function to get PDF format configuration
export const getPDFFormat = (formatType) => {
  const format = PDFFormats[formatType];
  if (!format) {
    throw new Error(`PDF format '${formatType}' not found. Available formats: ${Object.keys(PDFFormats).join(', ')}`);
  }
  return format;
};

// Factory function to get PDF component
export const getPDFComponent = (formatType) => {
  const component = PDFComponents[formatType];
  if (!component) {
    throw new Error(`PDF component for '${formatType}' not found. Available components: ${Object.keys(PDFComponents).join(', ')}`);
  }
  return component;
};

// Utility function to detect format type from document
export const detectPDFFormat = (document) => {
  // Logic to auto-detect format based on document structure
  if (document.sportType || document.eventCategory === 'sports') {
    return PDFFormatTypes.SPORTS_EVENT_VOUCHER;
  }
  
  if (document.eventCategory === 'technical' || document.workshopType) {
    return PDFFormatTypes.TECHNICAL_EVENT_VOUCHER;
  }
  
  if (document.eventCategory === 'cultural') {
    return PDFFormatTypes.CULTURAL_EVENT_VOUCHER;
  }
  
  // Default to Club Event Voucher
  return PDFFormatTypes.CLUB_EVENT_VOUCHER;
};

// Validation function for document against format
export const validateDocumentForFormat = (document, formatType) => {
  const format = getPDFFormat(formatType);
  
  if (format.helpers && format.helpers.validateSportsData) {
    return format.helpers.validateSportsData(document);
  }
  
  // Generic validation
  const requiredFields = ['title', 'subject', 'clubName', 'eventDate'];
  const missing = requiredFields.filter(field => !document[field]);
  
  return {
    isValid: missing.length === 0,
    missingFields: missing,
  };
};

// Get available formats list
export const getAvailableFormats = () => {
  return Object.keys(PDFFormats).map(key => ({
    type: key,
    name: PDFFormats[key].name,
    description: PDFFormats[key].description,
  }));
};

// Generate PDF with specified format
export const generatePDF = async (document, formatType, options = {}) => {
  const PDFComponent = getPDFComponent(formatType);
  const format = getPDFFormat(formatType);
  
  // Validate document
  const validation = validateDocumentForFormat(document, formatType);
  if (!validation.isValid) {
    throw new Error(`Document validation failed. Missing fields: ${validation.missingFields.join(', ')}`);
  }
  
  // Return PDF component with merged options
  return {
    component: PDFComponent,
    format: format,
    props: {
      document,
      ...options,
    },
  };
};

// Default export for easy importing
const PDFFormatManager = {
  formats: PDFFormats,
  types: PDFFormatTypes,
  components: PDFComponents,
  getPDFFormat,
  getPDFComponent,
  detectPDFFormat,
  validateDocumentForFormat,
  getAvailableFormats,
  generatePDF,
};

export default PDFFormatManager;