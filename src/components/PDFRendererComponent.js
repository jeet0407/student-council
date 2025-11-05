'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, pdf } from '@react-pdf/renderer';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

// Register Times New Roman font
Font.register({
  family: 'Times-Roman',
  src: 'https://fonts.gstatic.com/s/crimsontext/v19/wlp2gwHKFkZgtmSR-QAFmFoXkK4.woff2'
});

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Times-Roman',
    fontSize: 12,
  },
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
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableRowHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCol: {
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 5,
  },
  tableCell: {
    fontSize: 10,
  },
  signatureSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: 150,
    alignItems: 'center',
  },
  signature: {
    width: 120,
    height: 60,
    marginBottom: 5,
    border: '1px solid #000',
  },
  signatureLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
  },
});

// Create PDF document component
const MyDocument = ({ data, formatDate }) => {
  // Header component - only for first and last page
  const Header = () => (
    <View style={styles.header}>
      <Image
        src="/logo-svnit.png"
        style={styles.logo}
        alt="SVNIT Logo"
      />
      <View style={styles.headerCenter}>
        <Text style={styles.headerLine1}>सरदार वल्लभभाई राष्ट्रीय प्रौद्योगिकी संस्थान, सूरत</Text>
        <Text style={styles.headerLine2}>SARDAR VALLABHBHAI NATIONAL INSTITUTE OF TECHNOLOGY, SURAT</Text>
        <Text style={styles.headerLine3}>सरदार वल्लभभाई राષ्ટ्રीय પ્રૌદ્યોગિકી સંસ્થાન, સુરત</Text>
      </View>
      <View>
        <Text style={styles.rotatedSVNIT}>SVNIT</Text>
      </View>
    </View>
  );

  // Financial proposal table component
  const FinancialTable = ({ financialData }) => (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableRowHeader]}>
        <View style={[styles.tableCol, { width: '10%' }]}>
          <Text style={styles.tableCell}>Sr No.</Text>
        </View>
        <View style={[styles.tableCol, { width: '50%' }]}>
          <Text style={styles.tableCell}>Item Description</Text>
        </View>
        <View style={[styles.tableCol, { width: '20%' }]}>
          <Text style={styles.tableCell}>Quantity</Text>
        </View>
        <View style={[styles.tableCol, { width: '20%', borderRightWidth: 0 }]}>
          <Text style={styles.tableCell}>Amount</Text>
        </View>
      </View>
      {(financialData || []).map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '10%' }]}>
            <Text style={styles.tableCell}>{index + 1}</Text>
          </View>
          <View style={[styles.tableCol, { width: '50%' }]}>
            <Text style={styles.tableCell}>{item.description}</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text style={styles.tableCell}>{item.quantity}</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%', borderRightWidth: 0 }]}>
            <Text style={styles.tableCell}>{item.amount}</Text>
          </View>
        </View>
      ))}
      <View style={styles.tableRow}>
        <View style={[styles.tableCol, { width: '10%' }]}>
          <Text style={styles.tableCell}></Text>
        </View>
        <View style={[styles.tableCol, { width: '50%' }]}>
          <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Total</Text>
        </View>
        <View style={[styles.tableCol, { width: '20%' }]}>
          <Text style={styles.tableCell}></Text>
        </View>
        <View style={[styles.tableCol, { width: '20%', borderRightWidth: 0 }]}>
          <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>
            {data.financialProposal?.reduce((total, item) => total + (parseFloat(item.amount) || 0), 0).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
  
  // Generate main content pages based on document data
  return (
    <Document>
      {/* First page with header */}
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.headerBorder} />
        
        <View style={styles.section}>
          <Text style={styles.title}>{data.documentType || 'DOCUMENT'}</Text>
        </View>
        
        <View style={styles.section}>
          <Text>Date: {formatDate(data.submissionDate)}</Text>
          <Text>Reference Number: {data.referenceNumber || 'N/A'}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Subject: {data.subject || 'N/A'}</Text>
          <Text>{data.description || 'No description provided.'}</Text>
        </View>
        
        {/* Only include financial proposal if it exists and has items */}
        {data.financialProposal && data.financialProposal.length > 0 && (
          <View style={styles.section} break>
            <Text style={styles.title}>Financial Proposal</Text>
            <FinancialTable financialData={data.financialProposal} />
          </View>
        )}
        
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            {data.studentSignature ? (
              <Image src={data.studentSignature} style={styles.signature} alt="Student's signature" />
            ) : (
              <View style={styles.signature} />
            )}
            <Text style={styles.signatureLabel}>Student&apos;s Signature</Text>
          </View>
          
          <View style={styles.signatureBox}>
            {data.facultySignature ? (
              <Image src={data.facultySignature} style={styles.signature} alt="Faculty advisor's signature" />
            ) : (
              <View style={styles.signature} />
            )}
            <Text style={styles.signatureLabel}>Faculty Advisor&apos;s Signature</Text>
          </View>
        </View>
      </Page>
      
      {/* Last page with approvals and header */}
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.headerBorder} />
        
        <View style={styles.section}>
          <Text style={styles.title}>Approvals</Text>
        </View>
        
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            {data.deanSwSignature ? (
              <Image src={data.deanSwSignature} style={styles.signature} alt="Dean SW's signature" />
            ) : (
              <View style={styles.signature} />
            )}
            <Text style={styles.signatureLabel}>Dean SW&apos;s Signature</Text>
          </View>
          
          <View style={styles.signatureBox}>
            {data.deanSwoSignature ? (
              <Image src={data.deanSwoSignature} style={styles.signature} alt="Dean SWO's signature" />
            ) : (
              <View style={styles.signature} />
            )}
            <Text style={styles.signatureLabel}>Dean SWO&apos;s Signature</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text>Generated on: {new Date().toLocaleDateString()}</Text>
          <Text>SVNIT Student Council Portal</Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Viewer Component
export const DocumentPDFViewer = ({ data, formatDate }) => {
  return (
    <div className="h-[80vh] w-full">
      <PDFViewer
        width="100%"
        height="100%"
        style={{ border: "1px solid #cccccc" }}
      >
        <MyDocument data={data} formatDate={formatDate} />
      </PDFViewer>
    </div>
  );
};

// PDF Download Link Component
export const DocumentPDFDownloadLink = ({ data, formatDate, fileName }) => {
  return (
    <PDFDownloadLink 
      document={<MyDocument data={data} formatDate={formatDate} />} 
      fileName={fileName}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      {({ blob, url, loading, error }) => 
        loading ? 'Generating PDF...' : 'Download PDF'
      }
    </PDFDownloadLink>
  );
};

// Generate PDF blob function
export const generatePDFBlob = async (data, formatDate) => {
  return await pdf(<MyDocument data={data} formatDate={formatDate} />).toBlob();
};