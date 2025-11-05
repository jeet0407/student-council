// CEV (Club Event Voucher) PDF Format Configuration
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts and hyphenation
Font.registerHyphenationCallback(word => [word]);

// CEV-specific styles
export const CEVStyles = StyleSheet.create({
  // Page Configuration
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  
  // Header Styles - FIXED VERSION
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
    width: '100%',
  },
  logo: {
    width: 70,
    height: 70,
  },
  headerTextContainer: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
    maxWidth: '70%', // Prevent overflow
  },
  headerTextHindi: {
    fontSize: 9,
    marginBottom: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerTextEnglish: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 1,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  headerTextGujarati: {
    fontSize: 9,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  svnitVertical: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
  },
  svnitGroup: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    letterSpacing: 1,
  },
  
  // Divider and Document Info
  divider: {
    borderBottom: '2px solid black',
    marginVertical: 10,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    fontSize: 10,
  },
  
  // Title and Section Headers
  title: {
    marginBottom: 10,
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  
  // Table Styles
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
    padding: 4,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
  },
  
  // Financial Table Styles
  financialTable: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginVertical: 10,
  },
  financialTableHeader: {
    backgroundColor: '#f0f0f0',
    fontSize: 10,
    fontWeight: 'bold',
    padding: 4,
  },
  financialTableCell: {
    fontSize: 10,
    padding: 4,
  },
  financialTableTotal: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'right',
  },
  
  // Signature Styles
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
  },
  signatureBlock: {
    width: '48%',
  },
  facultySignatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
  },
  facultySignatureBlock: {
    width: '30%',
  },
  signatureText: {
    fontSize: 9,
    marginBottom: 4,
  },
  signatureTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  signatureImage: {
    height: 40,
    marginTop: 5,
  },
  
  // Office Section Styles
  officeSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  approvalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  approvalBlock: {
    width: '30%',
  },
  approvalText: {
    fontSize: 9,
  },
  approvalSignatureSpace: {
    height: 40,
    marginVertical: 10,
  },
});

// CEV Configuration Object
export const CEVConfig = {
  pageSize: 'A4',
  orientation: 'portrait',
  margins: {
    top: 40,
    bottom: 40,
    left: 40,
    right: 40,
  },
  
  // Header Configuration - FIXED VERSION
  header: {
    showLogo: true,
    logoSize: { width: 70, height: 70 }, // Slightly smaller for better fit
    institution: {
      hindi: 'सरदार वल्लभभाई राष्ट्रीय प्रौद्योगिकी संस्थान, सूरत',
      english: 'SARDAR VALLABHBHAI NATIONAL INSTITUTE OF TECHNOLOGY, SURAT',
      gujarati: 'સરદાર વલ્લભભાઈ રાષ્ટ્રીય પ્રૌદ્યોગિકી સંસ્થાન, સુરત',
    },
    showSVNITVertical: true,
  },
  
  // Document Structure
  documentStructure: {
    showDocumentNumber: true,
    showDate: true,
    title: 'Submitted to Dean (Students Welfare):',
  },
  
  // Table Configurations
  tableConfigs: {
    mainInfo: {
      fields: [
        { key: 'subject', label: 'Subject', width: '30%', isHeader: true },
        { key: 'clubName', label: 'Chapter/Club/Society/Section Name', width: '30%' },
        { key: 'clubCode', label: 'Chapter/Club/Society/Section Code No', width: '30%' },
        { key: 'eventDate', label: 'Schedule of Event (Date, Day)', width: '30%' },
        { key: 'eventVenue', label: 'Event Venue', width: '30%' },
      ],
      colonWidth: '5%',
      contentWidth: '65%',
    },
    
    aboutEvent: {
      sectionTitle: 'About the Event',
      fields: [
        { key: 'title', label: 'Title of the Event', width: '30%' },
        { key: 'eventCategory', label: 'Category of the Event', width: '30%' },
        { key: 'description', label: 'Brief Description (Maximum 100 Words)', width: '30%' },
        { key: 'objectives', label: 'Objectives (Maximum 100 Words)', width: '30%' },
        { key: 'targetAudience', label: 'Target Audience', width: '30%' },
        { key: 'expectedParticipants', label: 'Expected Number of Participants', width: '30%' },
        { key: 'judges', label: 'Name of Judges/ (In case of Competition)/Expert (Minimum 2) with their designation/institute/company', width: '30%' },
      ],
      colonWidth: '5%',
      contentWidth: '65%',
    },
    
    financialProposal: {
      sectionTitle: 'Financial Proposal',
      columns: [
        { key: 'item', label: 'Item/Description', width: '70%' },
        { key: 'amount', label: 'Amount', width: '30%', align: 'right' },
      ],
      showTotal: true,
      currency: '',
    },
    
    officeUse: {
      sectionTitle: 'Office Use',
      fields: [
        { key: 'totalAmountSanctioned', label: 'Total amount Sanctioned in Current Academic Year', width: '50%' },
        { key: 'amountUtilized', label: 'Amount Utilized', width: '50%' },
        { key: 'currentProposedAmount', label: 'Current Proposed amount', width: '50%' },
        { key: 'balanceAmount', label: 'Balance amount', width: '50%' },
        { key: 'officeClerkSignature', label: 'Signature (Office Clerk)', width: '50%' },
      ],
      colonWidth: '5%',
      contentWidth: '45%',
    },
  },
  
  // Signature Configurations
  signatureConfig: {
    student: {
      section1: {
        title: 'Signature of Student Head',
        fields: ['name', 'rollNo', 'branch', 'mobile'],
        width: '48%',
      },
      section2: {
        title: 'Signature of Student Secretary',
        fields: ['name', 'rollNo', 'branch', 'mobile'],
        width: '48%',
      },
    },
    
    faculty: {
      section1: {
        title: 'Signature of Faculty Co-Chairman',
        fields: ['name', 'designation', 'department', 'mobile'],
        width: '30%',
        dataKey: 'facultyCoChairman1',
      },
      section2: {
        title: 'Signature of Faculty Co-Chairman',
        fields: ['name', 'designation', 'department', 'mobile'],
        width: '30%',
        dataKey: 'facultyCoChairman2',
      },
      section3: {
        title: 'Signature of Faculty Chairman',
        fields: ['name', 'designation', 'department', 'mobile'],
        width: '30%',
        dataKey: 'facultyChairman',
      },
    },
  },
  
  // Approval Configuration
  approvalConfig: {
    authorities: [
      {
        title: 'Recommended/Not Recommended',
        name: 'Dr. Rakesh Maurya',
        designation: 'Chairman, F & SW',
        width: '30%',
      },
      {
        title: 'Recommended/Not Recommended',
        name: 'Dr. Manish Rathod',
        designation: 'Associate Dean (SW)',
        width: '30%',
      },
      {
        title: 'Approved/Not Approved',
        name: 'Dr. Sanjay R. Patel',
        designation: 'Dean (Students Welfare)',
        width: '30%',
      },
    ],
    signatureSpaceHeight: 40,
  },
  
  // Layout Options
  layoutOptions: {
    allowPageBreaks: true,
    movableSections: ['aboutEvent', 'financialProposal', 'signatures'],
    defaultPage2Sections: [], // Sections that should be on page 2 by default
  },
};

// Helper Functions for CEV
export const CEVHelpers = {
  formatDate: (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  },
  
  computeTotal: (items) => {
    if (!items || !items.length) return '0.00';
    return items.reduce((total, item) => total + (Number(item.amount || 0)), 0).toFixed(2);
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
};

// Export the complete CEV configuration
export const CEVPDFFormat = {
  config: CEVConfig,
  styles: CEVStyles,
  helpers: CEVHelpers,
  type: 'CEV', // Club Event Voucher
  name: 'Club Event Voucher Format',
  description: 'Standard format for club event approval documents at SVNIT',
};