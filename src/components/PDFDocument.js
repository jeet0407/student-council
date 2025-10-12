'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer';

// Register Times New Roman font (fallback to default serif)
Font.register({
  family: 'Times-Roman',
  src: 'https://fonts.gstatic.com/s/crimsontext/v19/wlp2gwHKFkZgtmSR-QAFmFoXkK4.woff2'
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Times-Roman',
    fontSize: 12,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  
  logo: {
    width: 60,
    height: 60,
  },
  
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  
  headerLine1: {
    fontSize: 14,
    marginBottom: 2,
  },
  
  headerLine2: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  
  headerLine3: {
    fontSize: 14,
  },
  
  rotatedSVNIT: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    transform: 'rotate(90deg)',
    transformOrigin: 'center',
    width: 80,
    textAlign: 'center',
  },
  
  headerBorder: {
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    marginBottom: 15,
  },
  
  // Document info styles
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    fontSize: 12,
  },
  
  submittedTo: {
    fontSize: 12,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 15,
  },
  
  // Table styles
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 15,
  },
  
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  
  tableColHeader: {
    width: '30%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
    backgroundColor: '#f0f0f0',
  },
  
  tableCol: {
    width: '30%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
  },
  
  tableColWide: {
    width: '65%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
  },
  
  tableColColon: {
    width: '5%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
    textAlign: 'center',
  },
  
  tableCellText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  tableCellValue: {
    fontSize: 10,
  },
  
  // Financial table styles
  financialTable: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  
  financialHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  
  financialColItem: {
    width: '70%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
  },
  
  financialColAmount: {
    width: '30%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
    textAlign: 'right',
  },
  
  // Signature styles
  signatureSection: {
    marginTop: 30,
  },
  
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  
  signatureBlock: {
    width: '48%',
  },
  
  signatureTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
  signatureDetails: {
    fontSize: 9,
    marginBottom: 2,
  },
  
  signatureBox: {
    height: 60,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#999999',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  signatureImage: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  
  signaturePlaceholder: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
  },
  
  facultySignatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  facultySignatureBlock: {
    width: '30%',
  },
  
  // Office use styles
  officeUseTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  
  adminSignatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  
  adminSignatureBlock: {
    width: '30%',
    alignItems: 'center',
  },
  
  adminSignatureTitle: {
    fontSize: 10,
    marginBottom: 20,
  },
  
  adminSignatureBox: {
    height: 60,
    marginBottom: 10,
  },
  
  adminName: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  adminDesignation: {
    fontSize: 9,
    textAlign: 'center',
  },
});

// Header component
const PDFHeader = () => (
  <View>
    <View style={styles.header}>
      <View style={styles.logo}>
        <Image 
          src="/logo-svnit.png" 
          style={styles.logo}
          alt="SVNIT Logo"
        />
      </View>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerLine1}>सरदार वल्लभभाई राष्ट्रिय प्रौद्योगिकी संस्थान, सूरत</Text>
        <Text style={styles.headerLine2}>SARDAR VALLABHBHAI NATIONAL INSTITUTE OF TECHNOLOGY, SURAT</Text>
        <Text style={styles.headerLine3}>સરદાર વલ્લભભાઈ રાષ્ટ્રીય પ્રૌદ્યોગિકી સંસ્થાન, સુરત</Text>
      </View>
      
      <View>
        <Text style={styles.rotatedSVNIT}>SVNIT</Text>
      </View>
    </View>
    <View style={styles.headerBorder} />
  </View>
);

// Table component for event details
const EventDetailsTable = ({ document }) => (
  <View style={styles.table}>
    <View style={styles.tableRow}>
      <View style={styles.tableColHeader}>
        <Text style={styles.tableCellText}>Subject</Text>
      </View>
      <View style={styles.tableColColon}>
        <Text style={styles.tableCellValue}>:</Text>
      </View>
      <View style={styles.tableColWide}>
        <Text style={styles.tableCellText}>{document.subject || ""}</Text>
      </View>
    </View>
    
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellText}>Chapter/Club/Society/Section Name</Text>
      </View>
      <View style={styles.tableColColon}>
        <Text style={styles.tableCellValue}>:</Text>
      </View>
      <View style={styles.tableColWide}>
        <Text style={styles.tableCellValue}>{document.clubName || ""}</Text>
      </View>
    </View>
    
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellText}>Chapter/Club/Society/Section Code No</Text>
      </View>
      <View style={styles.tableColColon}>
        <Text style={styles.tableCellValue}>:</Text>
      </View>
      <View style={styles.tableColWide}>
        <Text style={styles.tableCellValue}>{document.clubCode || ""}</Text>
      </View>
    </View>
    
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellText}>Schedule of Event (Date, Day)</Text>
      </View>
      <View style={styles.tableColColon}>
        <Text style={styles.tableCellValue}>:</Text>
      </View>
      <View style={styles.tableColWide}>
        <Text style={styles.tableCellValue}>{document.eventDate || ""}</Text>
      </View>
    </View>
    
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellText}>Event Venue</Text>
      </View>
      <View style={styles.tableColColon}>
        <Text style={styles.tableCellValue}>:</Text>
      </View>
      <View style={styles.tableColWide}>
        <Text style={styles.tableCellValue}>{document.eventVenue || ""}</Text>
      </View>
    </View>
  </View>
);

// About Event Table
const AboutEventTable = ({ document }) => (
  <View style={styles.table}>
    <View style={styles.tableRow}>
      <View style={[styles.tableColWide, { width: '100%' }]}>
        <Text style={styles.tableCellText}>About the Event</Text>
      </View>
    </View>
    
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellText}>Title of the Event</Text>
      </View>
      <View style={styles.tableColColon}>
        <Text style={styles.tableCellValue}>:</Text>
      </View>
      <View style={styles.tableColWide}>
        <Text style={styles.tableCellValue}>{document.title || ""}</Text>
      </View>
    </View>
    
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellText}>Category of the Event</Text>
      </View>
      <View style={styles.tableColColon}>
        <Text style={styles.tableCellValue}>:</Text>
      </View>
      <View style={styles.tableColWide}>
        <Text style={styles.tableCellValue}>{document.eventCategory || ""}</Text>
      </View>
    </View>
    
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellText}>Brief Description{'\n'}(Maximum 100 Words)</Text>
      </View>
      <View style={styles.tableColColon}>
        <Text style={styles.tableCellValue}>:</Text>
      </View>
      <View style={styles.tableColWide}>
        <Text style={styles.tableCellValue}>{document.description || ""}</Text>
      </View>
    </View>
    
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellText}>Objectives{'\n'}(Maximum 100 Words)</Text>
      </View>
      <View style={styles.tableColColon}>
        <Text style={styles.tableCellValue}>:</Text>
      </View>
      <View style={styles.tableColWide}>
        <Text style={styles.tableCellValue}>{document.objectives || ""}</Text>
      </View>
    </View>
    
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellText}>Target Audience</Text>
      </View>
      <View style={styles.tableColColon}>
        <Text style={styles.tableCellValue}>:</Text>
      </View>
      <View style={styles.tableColWide}>
        <Text style={styles.tableCellValue}>{document.targetAudience || ""}</Text>
      </View>
    </View>
    
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellText}>Expected Number of Participants</Text>
      </View>
      <View style={styles.tableColColon}>
        <Text style={styles.tableCellValue}>:</Text>
      </View>
      <View style={styles.tableColWide}>
        <Text style={styles.tableCellValue}>{document.expectedParticipants || ""}</Text>
      </View>
    </View>
    
    <View style={styles.tableRow}>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellText}>Name of Judges/ (In case of Competition)/Expert (Minimum 2 ) with their designation/institute/company</Text>
      </View>
      <View style={styles.tableColColon}>
        <Text style={styles.tableCellValue}>:</Text>
      </View>
      <View style={styles.tableColWide}>
        <Text style={styles.tableCellValue}>{document.judges || ""}</Text>
      </View>
    </View>
  </View>
);

// Financial Proposal Table
const FinancialProposalTable = ({ document }) => {
  const computeTotal = () => {
    if (!document.financialProposal) return 0;
    return document.financialProposal.reduce((total, item) => total + (Number(item.amount) || 0), 0).toFixed(2);
  };

  if (!document.financialProposal || document.financialProposal.length === 0) {
    return (
      <View>
        <Text style={styles.financialHeader}>Financial Proposal</Text>
        <View style={styles.financialTable}>
          <View style={styles.tableRow}>
            <View style={[styles.financialColItem, { backgroundColor: '#f0f0f0' }]}>
              <Text style={styles.tableCellText}>Item / Description</Text>
            </View>
            <View style={[styles.financialColAmount, { backgroundColor: '#f0f0f0' }]}>
              <Text style={styles.tableCellText}>Amount (₹)</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.financialColItem}>
              <Text style={styles.tableCellValue}>No financial details provided</Text>
            </View>
            <View style={styles.financialColAmount}>
              <Text style={styles.tableCellValue}>0.00</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.financialHeader}>Financial Proposal</Text>
      <View style={styles.financialTable}>
        <View style={styles.tableRow}>
          <View style={[styles.financialColItem, { backgroundColor: '#f0f0f0' }]}>
            <Text style={styles.tableCellText}>Item / Description</Text>
          </View>
          <View style={[styles.financialColAmount, { backgroundColor: '#f0f0f0' }]}>
            <Text style={styles.tableCellText}>Amount (₹)</Text>
          </View>
        </View>
        
        {document.financialProposal.map((row, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.financialColItem}>
              <Text style={styles.tableCellValue}>{row.item}</Text>
            </View>
            <View style={styles.financialColAmount}>
              <Text style={styles.tableCellValue}>₹{Number(row.amount).toFixed(2)}</Text>
            </View>
          </View>
        ))}
        
        <View style={styles.tableRow}>
          <View style={styles.financialColItem}>
            <Text style={styles.tableCellText}>Total:</Text>
          </View>
          <View style={styles.financialColAmount}>
            <Text style={styles.tableCellText}>₹{computeTotal()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Student Signatures
const StudentSignatures = ({ document, signature }) => (
  <View style={styles.signatureSection}>
    <View style={styles.signatureRow}>
      <View style={styles.signatureBlock}>
        <Text style={styles.signatureTitle}>Signature of Student Head</Text>
        <Text style={styles.signatureDetails}>Name: {document.studentHead?.name || ""}</Text>
        <Text style={styles.signatureDetails}>Roll No.: {document.studentHead?.rollNo || ""}</Text>
        <Text style={styles.signatureDetails}>Branch: {document.studentHead?.branch || ""}</Text>
        <Text style={styles.signatureDetails}>Mobile No.: {document.studentHead?.mobile || ""}</Text>
        
        <View style={styles.signatureBox}>
          {signature ? (
            <Image src={signature} style={styles.signatureImage} alt="Student Signature" />
          ) : (
            <Text style={styles.signaturePlaceholder}>Signature required before submission</Text>
          )}
        </View>
      </View>
      
      <View style={styles.signatureBlock}>
        <Text style={styles.signatureTitle}>Signature of Student Secretary</Text>
        <Text style={styles.signatureDetails}>Name: {document.studentSecretary?.name || ""}</Text>
        <Text style={styles.signatureDetails}>Roll No.: {document.studentSecretary?.rollNo || ""}</Text>
        <Text style={styles.signatureDetails}>Branch: {document.studentSecretary?.branch || ""}</Text>
        <Text style={styles.signatureDetails}>Mobile No.: {document.studentSecretary?.mobile || ""}</Text>
      </View>
    </View>
    
    <View style={styles.facultySignatureRow}>
      <View style={styles.facultySignatureBlock}>
        <Text style={styles.signatureTitle}>Signature of Faculty Co-Chairman</Text>
        <Text style={styles.signatureDetails}>Name: {document.facultyCoChairman1?.name || ""}</Text>
        <Text style={styles.signatureDetails}>Designation: {document.facultyCoChairman1?.designation || ""}</Text>
        <Text style={styles.signatureDetails}>Dept.: {document.facultyCoChairman1?.department || ""}</Text>
        <Text style={styles.signatureDetails}>Mobile No.: {document.facultyCoChairman1?.mobile || ""}</Text>
      </View>
      
      <View style={styles.facultySignatureBlock}>
        <Text style={styles.signatureTitle}>Signature of Faculty Co-Chairman</Text>
        <Text style={styles.signatureDetails}>Name: {document.facultyCoChairman2?.name || ""}</Text>
        <Text style={styles.signatureDetails}>Designation: {document.facultyCoChairman2?.designation || ""}</Text>
        <Text style={styles.signatureDetails}>Dept.: {document.facultyCoChairman2?.department || ""}</Text>
        <Text style={styles.signatureDetails}>Mobile No.: {document.facultyCoChairman2?.mobile || ""}</Text>
      </View>
      
      <View style={styles.facultySignatureBlock}>
        <Text style={styles.signatureTitle}>Signature of Faculty Chairman</Text>
        <Text style={styles.signatureDetails}>Name: {document.facultyChairman?.name || ""}</Text>
        <Text style={styles.signatureDetails}>Designation: {document.facultyChairman?.designation || ""}</Text>
        <Text style={styles.signatureDetails}>Dept.: {document.facultyChairman?.department || ""}</Text>
        <Text style={styles.signatureDetails}>Mobile No.: {document.facultyChairman?.mobile || ""}</Text>
      </View>
    </View>
  </View>
);

// Office Use Table
const OfficeUseTable = () => (
  <View>
    <Text style={styles.officeUseTitle}>Office Use</Text>
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.tableCellText}>Total amount Sanctioned in Current Academic Year</Text>
        </View>
        <View style={styles.tableColColon}>
          <Text style={styles.tableCellValue}>:</Text>
        </View>
        <View style={styles.tableColWide}>
          <Text style={styles.tableCellValue}></Text>
        </View>
      </View>
      
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.tableCellText}>Amount Utilized</Text>
        </View>
        <View style={styles.tableColColon}>
          <Text style={styles.tableCellValue}>:</Text>
        </View>
        <View style={styles.tableColWide}>
          <Text style={styles.tableCellValue}></Text>
        </View>
      </View>
      
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.tableCellText}>Current Proposed amount</Text>
        </View>
        <View style={styles.tableColColon}>
          <Text style={styles.tableCellValue}>:</Text>
        </View>
        <View style={styles.tableColWide}>
          <Text style={styles.tableCellValue}></Text>
        </View>
      </View>
      
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.tableCellText}>Balance amount</Text>
        </View>
        <View style={styles.tableColColon}>
          <Text style={styles.tableCellValue}>:</Text>
        </View>
        <View style={styles.tableColWide}>
          <Text style={styles.tableCellValue}></Text>
        </View>
      </View>
      
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.tableCellText}>Signature (Office Clerk)</Text>
        </View>
        <View style={styles.tableColColon}>
          <Text style={styles.tableCellValue}>:</Text>
        </View>
        <View style={styles.tableColWide}>
          <Text style={styles.tableCellValue}></Text>
        </View>
      </View>
    </View>
  </View>
);

// Administrative Signatures
const AdministrativeSignatures = () => (
  <View style={styles.adminSignatureRow}>
    <View style={styles.adminSignatureBlock}>
      <Text style={styles.adminSignatureTitle}>Recommended/Not Recommended</Text>
      <View style={styles.adminSignatureBox}></View>
      <Text style={styles.adminName}>Dr. Rakesh Maurya</Text>
      <Text style={styles.adminDesignation}>Chairman, F & SW</Text>
    </View>
    
    <View style={styles.adminSignatureBlock}>
      <Text style={styles.adminSignatureTitle}>Recommended/Not Recommended</Text>
      <View style={styles.adminSignatureBox}></View>
      <Text style={styles.adminName}>Dr. Shweta N. Shah</Text>
      <Text style={styles.adminDesignation}>Associate Dean (SW)</Text>
    </View>
    
    <View style={styles.adminSignatureBlock}>
      <Text style={styles.adminSignatureTitle}>Approved/Not Approved</Text>
      <View style={styles.adminSignatureBox}></View>
      <Text style={styles.adminName}>Dr. Sanjay R. Patel</Text>
      <Text style={styles.adminDesignation}>Dean (Students Welfare)</Text>
    </View>
  </View>
);

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Main PDF Document Component
const PDFDocument = ({ document, signature }) => {
  return (
    <Document>
      {/* First Page */}
      <Page size="A4" style={styles.page}>
        <PDFHeader />
        
        <View style={styles.documentInfo}>
          <Text>No : {document.documentNumber || ""}</Text>
          <Text style={{ marginHorizontal: 40 }}></Text>
          <Text>Date : {formatDate(document.documentDate) || ""}</Text>
        </View>
        
        <Text style={styles.submittedTo}>Submitted to Dean (Students Welfare):</Text>
        
        <EventDetailsTable document={document} />
        <AboutEventTable document={document} />
        <FinancialProposalTable document={document} />
        <StudentSignatures document={document} signature={signature} />
      </Page>
      
      {/* Last Page - Administrative Approvals */}
      <Page size="A4" style={styles.page}>
        <PDFHeader />
        <OfficeUseTable />
        <AdministrativeSignatures />
      </Page>
    </Document>
  );
};

export default PDFDocument;