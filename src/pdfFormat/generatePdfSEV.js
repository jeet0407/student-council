// Sports Event Voucher (SEV) PDF Format Configuration
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts and hyphenation
Font.registerHyphenationCallback(word => [word]);

// SEV-specific styles (extends CEV with sports-specific modifications)
export const SEVStyles = StyleSheet.create({
  // Inherit base page configuration
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  
  // Sports-specific header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerText: {
    textAlign: 'center',
  },
  headerTextHindi: {
    fontSize: 10,
  },
  headerTextEnglish: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerTextGujarati: {
    fontSize: 10,
  },
  sportsRotated: {
    position: 'absolute',
    right: 0,
    transform: 'rotate(90deg)',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#d4342c', // Sports department color
  },
  
  // Enhanced sports table styles
  sportsTable: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#d4342c',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  
  sportsTableRow: {
    flexDirection: 'row',
  },
  
  sportsTableCol: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#d4342c',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  
  sportsHeaderCell: {
    padding: 6,
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: '#f8f4f4',
    color: '#d4342c',
  },
  
  sportsCell: {
    padding: 6,
    fontSize: 10,
  },
  
  // Equipment and venue specific styles
  equipmentSection: {
    backgroundColor: '#fff8f8',
    padding: 10,
    marginVertical: 10,
    border: '1px solid #d4342c',
  },
  
  equipmentTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#d4342c',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  // Participant registration styles
  participantTable: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  
  // Sports-specific signature styles
  coachSignatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 80,
    backgroundColor: '#fff8f8',
    padding: 10,
    border: '1px solid #d4342c',
  },
  
  coachSignatureBlock: {
    width: '48%',
  },
  
  coachSignatureTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#d4342c',
    marginBottom: 8,
  },
  
  // Rest of the styles inherit from CEV
  divider: {
    borderBottom: '2px solid #d4342c',
    marginVertical: 10,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    fontSize: 10,
  },
  title: {
    marginBottom: 10,
    textDecoration: 'underline',
    fontWeight: 'bold',
    color: '#d4342c',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    padding: 4,
    fontSize: 10,
  },
  tableCellHeader: {
    padding: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    padding: 6,
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: '#f8f4f4',
    textAlign: 'center',
    color: '#d4342c',
  },
});

// SEV Configuration Object
export const SEVConfig = {
  pageSize: 'A4',
  orientation: 'portrait',
  margins: {
    top: 40,
    bottom: 40,
    left: 40,
    right: 40,
  },
  
  // Sports Department Header Configuration
  header: {
    showLogo: true,
    logoSize: { width: 60, height: 60 },
    institution: {
      hindi: 'सरदार वल्लभभाई राष्ट्रीय प्रौद्योगिकी संस्थान, सूरत',
      english: 'SARDAR VALLABHBHAI NATIONAL INSTITUTE OF TECHNOLOGY, SURAT',
      gujarati: 'સરદાર વલ્લભભાઈ રાષ્ટ્રીય પ્રૌદ્યોગિકી સંસ્થાન, સુરત',
    },
    departmentText: 'SPORTS',
    showDepartmentRotated: true,
  },
  
  // Document Structure
  documentStructure: {
    showDocumentNumber: true,
    showDate: true,
    title: 'Submitted to Sports Officer:',
    subtitle: 'Sports Event Approval Request',
  },
  
  // Sports-specific Table Configurations
  tableConfigs: {
    eventInfo: {
      fields: [
        { key: 'eventName', label: 'Name of Sports Event', width: '30%', isHeader: true },
        { key: 'sportType', label: 'Type of Sport', width: '30%' },
        { key: 'eventCategory', label: 'Event Category (Intra/Inter/National)', width: '30%' },
        { key: 'eventDate', label: 'Event Date & Time', width: '30%' },
        { key: 'venue', label: 'Venue/Ground Required', width: '30%' },
        { key: 'duration', label: 'Duration of Event', width: '30%' },
        { key: 'expectedParticipants', label: 'Expected Number of Participants', width: '30%' },
      ],
      colonWidth: '5%',
      contentWidth: '65%',
    },
    
    equipmentRequirements: {
      sectionTitle: 'Equipment & Infrastructure Requirements',
      fields: [
        { key: 'equipmentList', label: 'Equipment Required', width: '30%' },
        { key: 'facilityRequirements', label: 'Facility Requirements', width: '30%' },
        { key: 'additionalSupport', label: 'Additional Support Required', width: '30%' },
        { key: 'safetyMeasures', label: 'Safety Measures', width: '30%' },
      ],
      colonWidth: '5%',
      contentWidth: '65%',
    },
    
    participantDetails: {
      sectionTitle: 'Participant Registration Details',
      columns: [
        { key: 'name', label: 'Participant Name', width: '25%' },
        { key: 'rollNo', label: 'Roll Number', width: '20%' },
        { key: 'branch', label: 'Branch', width: '15%' },
        { key: 'year', label: 'Year', width: '10%' },
        { key: 'contact', label: 'Contact', width: '20%' },
        { key: 'medicalClearance', label: 'Medical Clearance', width: '10%' },
      ],
    },
    
    budgetProposal: {
      sectionTitle: 'Budget Proposal',
      columns: [
        { key: 'item', label: 'Item/Service', width: '50%' },
        { key: 'quantity', label: 'Quantity', width: '15%' },
        { key: 'unitCost', label: 'Unit Cost ()', width: '15%', align: 'right' },
        { key: 'totalCost', label: 'Total Cost ()', width: '20%', align: 'right' },
      ],
      showTotal: true,
      currency: '',
    },
    
    officeUse: {
      sectionTitle: 'Sports Office Use',
      fields: [
        { key: 'groundAllocation', label: 'Ground/Facility Allocated', width: '50%' },
        { key: 'equipmentApproved', label: 'Equipment Approved', width: '50%' },
        { key: 'budgetApproved', label: 'Budget Approved ()', width: '50%' },
        { key: 'conditions', label: 'Special Conditions/Instructions', width: '50%' },
        { key: 'sportsOfficerRemarks', label: 'Sports Officer Remarks', width: '50%' },
      ],
      colonWidth: '5%',
      contentWidth: '45%',
    },
  },
  
  // Sports-specific Signature Configurations
  signatureConfig: {
    organizers: {
      section1: {
        title: 'Event Organizer Signature',
        fields: ['name', 'rollNo', 'branch', 'mobile', 'email'],
        width: '48%',
      },
      section2: {
        title: 'Co-Organizer Signature',
        fields: ['name', 'rollNo', 'branch', 'mobile', 'email'],
        width: '48%',
      },
    },
    
    coaches: {
      section1: {
        title: 'Sports Coach/Instructor Signature',
        fields: ['name', 'designation', 'department', 'mobile', 'specialization'],
        width: '48%',
        dataKey: 'sportsCoach',
      },
      section2: {
        title: 'Sports Committee Representative',
        fields: ['name', 'designation', 'committee', 'mobile'],
        width: '48%',
        dataKey: 'sportsRepresentative',
      },
    },
  },
  
  // Approval Configuration for Sports Department
  approvalConfig: {
    authorities: [
      {
        title: 'Recommended/Not Recommended',
        name: 'Sports Officer',
        designation: 'In-charge Sports Activities',
        width: '48%',
      },
      {
        title: 'Approved/Not Approved',
        name: 'Dr. [Name]',
        designation: 'Associate Dean (Sports)',
        width: '48%',
      },
    ],
    signatureSpaceHeight: 50,
  },
  
  // Layout Options
  layoutOptions: {
    allowPageBreaks: true,
    movableSections: ['equipmentRequirements', 'participantDetails', 'budgetProposal', 'signatures'],
    defaultPage2Sections: ['participantDetails'], // Participant details typically go to page 2
    maxParticipantsPerPage: 15,
  },
};

// Helper Functions for SEV
export const SEVHelpers = {
  formatDate: (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  },
  
  formatDateTime: (dateString, timeString) => {
    const formattedDate = SEVHelpers.formatDate(dateString);
    const formattedTime = timeString || '';
    return `${formattedDate} ${formattedTime}`.trim();
  },
  
  computeTotal: (items) => {
    if (!items || !items.length) return '0.00';
    return items.reduce((total, item) => {
      const totalCost = item.totalCost || (Number(item.quantity || 0) * Number(item.unitCost || 0));
      return total + totalCost;
    }, 0).toFixed(2);
  },
  
  formatCurrency: (amount, currency = '') => {
    return `${currency}${Number(amount || 0).toFixed(2)}`;
  },
  
  getFieldValue: (document, fieldKey) => {
    return document[fieldKey] || '';
  },
  
  getNestedFieldValue: (document, parentKey, fieldKey) => {
    return document[parentKey] && document[parentKey][fieldKey] ? document[parentKey][fieldKey] : '';
  },
  
  formatParticipantsList: (participants) => {
    if (!participants || !participants.length) return [];
    return participants.map(participant => ({
      name: participant.name || '',
      rollNo: participant.rollNo || '',
      branch: participant.branch || '',
      year: participant.year || '',
      contact: participant.contact || participant.mobile || '',
      medicalClearance: participant.medicalClearance ? 'Yes' : 'No',
    }));
  },
  
  validateSportsData: (document) => {
    const required = ['eventName', 'sportType', 'eventDate', 'venue', 'expectedParticipants'];
    const missing = required.filter(field => !document[field]);
    return {
      isValid: missing.length === 0,
      missingFields: missing,
    };
  },
};

// Export the complete SEV configuration
export const SEVPDFFormat = {
  config: SEVConfig,
  styles: SEVStyles,
  helpers: SEVHelpers,
  type: 'SEV', // Sports Event Voucher
  name: 'Sports Event Voucher Format',
  description: 'Standard format for sports event approval documents at SVNIT Sports Department',
};