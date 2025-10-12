'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';
import DashboardLayout from '@/components/DashboardLayout';
import SignaturePad from '@/components/SignaturePad';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

// Helper functions moved outside components
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const computeTotal = (items) => {
  if (!items || !items.length) return '0.00';
  return items.reduce((total, item) => total + (Number(item.amount || 0)), 0).toFixed(2);
};

// Register only web-safe fonts
Font.registerHyphenationCallback(word => [word]);

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
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
  svnitRotated: {
    position: 'absolute',
    right: 0,
    transform: 'rotate(90deg)',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
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
  title: {
    marginBottom: 10,
    textDecoration: 'underline',
    fontWeight: 'bold',
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
    padding: 4,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
  },
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
  sectionHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
});

// Financial Proposal Table Component
const FinancialProposalTable = ({ data = [] }) => (
  <View wrap={false}>
    <View style={styles.financialTable}>

      <View style={styles.tableRow}>
        <View style={[styles.tableCol, { width: '100%' }]}>
          <Text style={styles.sectionTitle}>Financial Proposal</Text>
        </View>
      </View>
      
      <View style={styles.tableRow}>
        <View style={[styles.tableCol, { width: '70%' }]}>
          <Text style={styles.financialTableHeader}>Item/Description</Text>
        </View>
        <View style={[styles.tableCol, { width: '30%' }]}>
          <Text style={styles.financialTableHeader}>Amount (₹)</Text>
        </View>
      </View>
      
      {/* Table Rows */}
      {data.map((item, index) => (
        <View key={index.toString()} style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '70%' }]}>
            <Text style={styles.financialTableCell}>{item.item || item.description || ""}</Text>
          </View>
          <View style={[styles.tableCol, { width: '30%' }]}>
            <Text style={[styles.financialTableCell, { textAlign: 'right' }]}>₹{Number(item.amount || 0).toFixed(2)}</Text>
          </View>
        </View>
      ))}
      
      {/* Total Row */}
      <View style={styles.tableRow}>
        <View style={[styles.tableCol, { width: '70%' }]}>
          <Text style={styles.financialTableTotal}>Total:</Text>
        </View>
        <View style={[styles.tableCol, { width: '30%' }]}>
          <Text style={[styles.financialTableTotal, { textAlign: 'right' }]}>₹{computeTotal(data)}</Text>
        </View>
      </View>
    </View>
  </View>
);

// PDF Document component
const PDFDocument = ({ document, signature, moveFinancialToPage2, moveAboutEventToPage2, moveSignaturesToPage2 }) => {
  // Ensure financialProposal exists and is an array
  const financialProposal = document.financialProposal && Array.isArray(document.financialProposal) 
    ? document.financialProposal 
    : [];

  return (
    <Document>
      {/* PAGE 1 */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* Logo placeholder instead of image to avoid loading issues */}
          <View style={{ width: 60, height: 60, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 8 }}>SVNIT Logo</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTextHindi}>सरदार वल्लभभाई राष्ट्रीय प्रौद्योगिकी संस्थान, सूरत</Text>
            <Text style={styles.headerTextEnglish}>SARDAR VALLABHBHAI NATIONAL INSTITUTE OF TECHNOLOGY, SURAT</Text>
            <Text style={styles.headerTextGujarati}>સરદાર વલ્લભભાઈ રાષ્ટ્રીય પ્રૌદ્યોગિકી સંસ્થાન, સુરત</Text>
          </View>
          <Text style={styles.svnitRotated}>SVNIT</Text>
        </View>
        
        <View style={styles.divider} />
        
        {/* Document Number and Date */}
        <View style={styles.documentInfo}>
          <Text>No : {document.documentNumber || ""}</Text>
          <Text style={{ marginHorizontal: 20 }}></Text>
          <Text>Date : {formatDate(document.documentDate)}</Text>
        </View>
        
        {/* Title */}
        <View style={styles.title}>
          <Text>Submitted to Dean (Students Welfare):</Text>
        </View>
        
        {/* Main Information Table */}
        <View style={styles.table} wrap={false}>
          {/* Subject Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}>
              <Text style={styles.tableCellHeader}>Subject</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '65%' }]}>
              <Text style={styles.tableCellHeader}>{document.subject || ""}</Text>
            </View>
          </View>
          
          {/* Club Name Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}>
              <Text style={styles.tableCellHeader}>Chapter/Club/Society/Section Name</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '65%' }]}>
              <Text style={styles.tableCell}>{document.clubName || ""}</Text>
            </View>
          </View>
          
          {/* Club Code Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}>
              <Text style={styles.tableCellHeader}>Chapter/Club/Society/Section Code No</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '65%' }]}>
              <Text style={styles.tableCell}>{document.clubCode || ""}</Text>
            </View>
          </View>
          
          {/* Event Schedule Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}>
              <Text style={styles.tableCellHeader}>Schedule of Event (Date, Day)</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '65%' }]}>
              <Text style={styles.tableCell}>{document.eventDate || ""}</Text>
            </View>
          </View>
          
          {/* Event Venue Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}>
              <Text style={styles.tableCellHeader}>Event Venue</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '65%' }]}>
              <Text style={styles.tableCell}>{document.eventVenue || ""}</Text>
            </View>
          </View>
        </View>
        
        {/* About the Event Table - Only show on page 1 if not moved to page 2 */}
        {!moveAboutEventToPage2 && (
          <View style={styles.table} wrap={false}>
            {/* Title Row */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '100%' }]}>
                <Text style={styles.sectionTitle}>About the Event</Text>
              </View>
            </View>
          
          {/* Event Title Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}>
              <Text style={styles.tableCellHeader}>Title of the Event</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '65%' }]}>
              <Text style={styles.tableCell}>{document.title || ""}</Text>
            </View>
          </View>
          
          {/* Category Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}>
              <Text style={styles.tableCellHeader}>Category of the Event</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '65%' }]}>
              <Text style={styles.tableCell}>{document.eventCategory || ""}</Text>
            </View>
          </View>
          
          {/* Description Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}>
              <Text style={styles.tableCellHeader}>Brief Description (Maximum 100 Words)</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '65%' }]}>
              <Text style={styles.tableCell}>{document.description || ""}</Text>
            </View>
          </View>
          
          {/* Objectives Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}>
              <Text style={styles.tableCellHeader}>Objectives (Maximum 100 Words)</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '65%' }]}>
              <Text style={styles.tableCell}>{document.objectives || ""}</Text>
            </View>
          </View>
          
          {/* Target Audience Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}>
              <Text style={styles.tableCellHeader}>Target Audience</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '65%' }]}>
              <Text style={styles.tableCell}>{document.targetAudience || ""}</Text>
            </View>
          </View>
          
          {/* Expected Participants Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}>
              <Text style={styles.tableCellHeader}>Expected Number of Participants</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '65%' }]}>
              <Text style={styles.tableCell}>{document.expectedParticipants || ""}</Text>
            </View>
          </View>
          
          {/* Judges Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '30%' }]}>
              <Text style={styles.tableCellHeader}>Name of Judges/ (In case of Competition)/Expert (Minimum 2) with their designation/institute/company</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '65%' }]}>
              <Text style={styles.tableCell}>{document.judges || ""}</Text>
            </View>
          </View>
        </View>
        )}
        
        {/* Financial Proposal Table - Only show on page 1 if not moved to page 2 */}
        {!moveFinancialToPage2 && financialProposal.length > 0 && (
          <FinancialProposalTable data={financialProposal} />
        )}
        
        {/* Signature Sections - Only show on page 1 if not moved to page 2 */}
        {!moveSignaturesToPage2 && (
          <View wrap={false}>
            {/* Student Signature Section */}
            <View style={styles.signatureSection} wrap={false}>
              {/* Student Head Signature */}
              <View style={styles.signatureBlock}>
                <Text style={styles.signatureTitle}>Signature of Student Head</Text>
                <Text style={styles.signatureText}>Name: {document.studentHead?.name || ""}</Text>
                <Text style={styles.signatureText}>Roll No.: {document.studentHead?.rollNo || ""}</Text>
                <Text style={styles.signatureText}>Branch: {document.studentHead?.branch || ""}</Text>
                <Text style={styles.signatureText}>Mobile No.: {document.studentHead?.mobile || ""}</Text>
                {signature && (
                  <View style={{ height: 40, marginTop: 5, border: '1px dashed #000000' }}>
                    <Text style={{ fontSize: 8, textAlign: 'center' }}>Signature Added</Text>
                  </View>
                )}
              </View>
              
              {/* Student Secretary Signature */}
              <View style={styles.signatureBlock}>
                <Text style={styles.signatureTitle}>Signature of Student Secretary</Text>
                <Text style={styles.signatureText}>Name: {document.studentSecretary?.name || ""}</Text>
                <Text style={styles.signatureText}>Roll No.: {document.studentSecretary?.rollNo || ""}</Text>
                <Text style={styles.signatureText}>Branch: {document.studentSecretary?.branch || ""}</Text>
                <Text style={styles.signatureText}>Mobile No.: {document.studentSecretary?.mobile || ""}</Text>
              </View>
            </View>
            
            {/* Faculty Signature Section */}
            <View style={styles.facultySignatureSection} wrap={false}>
              {/* Faculty Co-Chairman 1 */}
              <View style={styles.facultySignatureBlock}>
                <Text style={styles.signatureTitle}>Signature of Faculty Co-Chairman</Text>
                <Text style={styles.signatureText}>Name: {document.facultyCoChairman1?.name || ""}</Text>
                <Text style={styles.signatureText}>Designation: {document.facultyCoChairman1?.designation || ""}</Text>
                <Text style={styles.signatureText}>Dept.: {document.facultyCoChairman1?.department || ""}</Text>
                <Text style={styles.signatureText}>Mobile No.: {document.facultyCoChairman1?.mobile || ""}</Text>
              </View>
              
              {/* Faculty Co-Chairman 2 */}
              <View style={styles.facultySignatureBlock}>
                <Text style={styles.signatureTitle}>Signature of Faculty Co-Chairman</Text>
                <Text style={styles.signatureText}>Name: {document.facultyCoChairman2?.name || ""}</Text>
                <Text style={styles.signatureText}>Designation: {document.facultyCoChairman2?.designation || ""}</Text>
                <Text style={styles.signatureText}>Dept.: {document.facultyCoChairman2?.department || ""}</Text>
                <Text style={styles.signatureText}>Mobile No.: {document.facultyCoChairman2?.mobile || ""}</Text>
              </View>
              
              {/* Faculty Chairman */}
              <View style={styles.facultySignatureBlock}>
                <Text style={styles.signatureTitle}>Signature of Faculty Chairman</Text>
                <Text style={styles.signatureText}>Name: {document.facultyChairman?.name || ""}</Text>
                <Text style={styles.signatureText}>Designation: {document.facultyChairman?.designation || ""}</Text>
                <Text style={styles.signatureText}>Dept.: {document.facultyChairman?.department || ""}</Text>
                <Text style={styles.signatureText}>Mobile No.: {document.facultyChairman?.mobile || ""}</Text>
              </View>
            </View>
          </View>
        )}
      </Page>
      
      {/* PAGE 2 */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* Logo placeholder */}
          <View style={{ width: 60, height: 60, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 8 }}>SVNIT Logo</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTextHindi}>SVNIT - Hindi</Text>
            <Text style={styles.headerTextEnglish}>SARDAR VALLABHBHAI NATIONAL INSTITUTE OF TECHNOLOGY, SURAT</Text>
            <Text style={styles.headerTextGujarati}>SVNIT - Gujarati</Text>
          </View>
          <Text style={styles.svnitRotated}>SVNIT</Text>
        </View>
        
        <View style={styles.divider} />
        
        {/* About the Event Table - Show on page 2 if moved from page 1 */}
        {moveAboutEventToPage2 && (
          <View style={styles.table} wrap={false}>
            {/* Title Row */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '100%' }]}>
                <Text style={styles.sectionTitle}>About the Event</Text>
              </View>
            </View>
          
            {/* Event Title Row */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '30%' }]}>
                <Text style={styles.tableCellHeader}>Title of the Event</Text>
              </View>
              <View style={[styles.tableCol, { width: '5%' }]}>
                <Text style={styles.tableCell}>:</Text>
              </View>
              <View style={[styles.tableCol, { width: '65%' }]}>
                <Text style={styles.tableCell}>{document.title || ""}</Text>
              </View>
            </View>
            
            {/* Category Row */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '30%' }]}>
                <Text style={styles.tableCellHeader}>Category of the Event</Text>
              </View>
              <View style={[styles.tableCol, { width: '5%' }]}>
                <Text style={styles.tableCell}>:</Text>
              </View>
              <View style={[styles.tableCol, { width: '65%' }]}>
                <Text style={styles.tableCell}>{document.eventCategory || ""}</Text>
              </View>
            </View>
            
            {/* Description Row */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '30%' }]}>
                <Text style={styles.tableCellHeader}>Brief Description (Maximum 100 Words)</Text>
              </View>
              <View style={[styles.tableCol, { width: '5%' }]}>
                <Text style={styles.tableCell}>:</Text>
              </View>
              <View style={[styles.tableCol, { width: '65%' }]}>
                <Text style={styles.tableCell}>{document.description || ""}</Text>
              </View>
            </View>
            
            {/* Objectives Row */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '30%' }]}>
                <Text style={styles.tableCellHeader}>Objectives (Maximum 100 Words)</Text>
              </View>
              <View style={[styles.tableCol, { width: '5%' }]}>
                <Text style={styles.tableCell}>:</Text>
              </View>
              <View style={[styles.tableCol, { width: '65%' }]}>
                <Text style={styles.tableCell}>{document.objectives || ""}</Text>
              </View>
            </View>
            
            {/* Target Audience Row */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '30%' }]}>
                <Text style={styles.tableCellHeader}>Target Audience</Text>
              </View>
              <View style={[styles.tableCol, { width: '5%' }]}>
                <Text style={styles.tableCell}>:</Text>
              </View>
              <View style={[styles.tableCol, { width: '65%' }]}>
                <Text style={styles.tableCell}>{document.targetAudience || ""}</Text>
              </View>
            </View>
            
            {/* Expected Participants Row */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '30%' }]}>
                <Text style={styles.tableCellHeader}>Expected Number of Participants</Text>
              </View>
              <View style={[styles.tableCol, { width: '5%' }]}>
                <Text style={styles.tableCell}>:</Text>
              </View>
              <View style={[styles.tableCol, { width: '65%' }]}>
                <Text style={styles.tableCell}>{document.expectedParticipants || ""}</Text>
              </View>
            </View>
            
            {/* Judges Row */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: '30%' }]}>
                <Text style={styles.tableCellHeader}>Name of Judges/ (In case of Competition)/Expert (Minimum 2) with their designation/institute/company</Text>
              </View>
              <View style={[styles.tableCol, { width: '5%' }]}>
                <Text style={styles.tableCell}>:</Text>
              </View>
              <View style={[styles.tableCol, { width: '65%' }]}>
                <Text style={styles.tableCell}>{document.judges || ""}</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Financial Proposal Table - Show on page 2 if moved from page 1 */}
        {moveFinancialToPage2 && financialProposal.length > 0 && (
          <FinancialProposalTable data={financialProposal} />
        )}
        
        {/* Signature Sections - Show on page 2 if moved from page 1 */}
        {moveSignaturesToPage2 && (
          <View wrap={false}>
            {/* Student Signature Section */}
            <View style={styles.signatureSection} wrap={false}>
              {/* Student Head Signature */}
              <View style={styles.signatureBlock}>
                <Text style={styles.signatureTitle}>Signature of Student Head</Text>
                <Text style={styles.signatureText}>Name: {document.studentHead?.name || ""}</Text>
                <Text style={styles.signatureText}>Roll No.: {document.studentHead?.rollNo || ""}</Text>
                <Text style={styles.signatureText}>Branch: {document.studentHead?.branch || ""}</Text>
                <Text style={styles.signatureText}>Mobile No.: {document.studentHead?.mobile || ""}</Text>
                {signature && (
                  <View style={{ height: 40, marginTop: 5, border: '1px dashed #000000' }}>
                    <Text style={{ fontSize: 8, textAlign: 'center' }}>Signature Added</Text>
                  </View>
                )}
              </View>
              
              {/* Student Secretary Signature */}
              <View style={styles.signatureBlock}>
                <Text style={styles.signatureTitle}>Signature of Student Secretary</Text>
                <Text style={styles.signatureText}>Name: {document.studentSecretary?.name || ""}</Text>
                <Text style={styles.signatureText}>Roll No.: {document.studentSecretary?.rollNo || ""}</Text>
                <Text style={styles.signatureText}>Branch: {document.studentSecretary?.branch || ""}</Text>
                <Text style={styles.signatureText}>Mobile No.: {document.studentSecretary?.mobile || ""}</Text>
              </View>
            </View>
            
            {/* Faculty Signature Section */}
            <View style={styles.facultySignatureSection} wrap={false}>
              {/* Faculty Co-Chairman 1 */}
              <View style={styles.facultySignatureBlock}>
                <Text style={styles.signatureTitle}>Signature of Faculty Co-Chairman</Text>
                <Text style={styles.signatureText}>Name: {document.facultyCoChairman1?.name || ""}</Text>
                <Text style={styles.signatureText}>Designation: {document.facultyCoChairman1?.designation || ""}</Text>
                <Text style={styles.signatureText}>Dept.: {document.facultyCoChairman1?.department || ""}</Text>
                <Text style={styles.signatureText}>Mobile No.: {document.facultyCoChairman1?.mobile || ""}</Text>
              </View>
              
              {/* Faculty Co-Chairman 2 */}
              <View style={styles.facultySignatureBlock}>
                <Text style={styles.signatureTitle}>Signature of Faculty Co-Chairman</Text>
                <Text style={styles.signatureText}>Name: {document.facultyCoChairman2?.name || ""}</Text>
                <Text style={styles.signatureText}>Designation: {document.facultyCoChairman2?.designation || ""}</Text>
                <Text style={styles.signatureText}>Dept.: {document.facultyCoChairman2?.department || ""}</Text>
                <Text style={styles.signatureText}>Mobile No.: {document.facultyCoChairman2?.mobile || ""}</Text>
              </View>
              
              {/* Faculty Chairman */}
              <View style={styles.facultySignatureBlock}>
                <Text style={styles.signatureTitle}>Signature of Faculty Chairman</Text>
                <Text style={styles.signatureText}>Name: {document.facultyChairman?.name || ""}</Text>
                <Text style={styles.signatureText}>Designation: {document.facultyChairman?.designation || ""}</Text>
                <Text style={styles.signatureText}>Dept.: {document.facultyChairman?.department || ""}</Text>
                <Text style={styles.signatureText}>Mobile No.: {document.facultyChairman?.mobile || ""}</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Office Use Table */}
        <View style={styles.table} wrap={false}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '100%' }]}>
              <Text style={styles.sectionTitle}>Office Use</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '50%' }]}>
              <Text style={styles.tableCellHeader}>Total amount Sanctioned in Current Academic Year</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '45%' }]}>
              <Text style={styles.tableCell}></Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '50%' }]}>
              <Text style={styles.tableCellHeader}>Amount Utilized</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '45%' }]}>
              <Text style={styles.tableCell}></Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '50%' }]}>
              <Text style={styles.tableCellHeader}>Current Proposed amount</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '45%' }]}>
              <Text style={styles.tableCell}></Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '50%' }]}>
              <Text style={styles.tableCellHeader}>Balance amount</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '45%' }]}>
              <Text style={styles.tableCell}></Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '50%' }]}>
              <Text style={styles.tableCellHeader}>Signature (Office Clerk)</Text>
            </View>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>:</Text>
            </View>
            <View style={[styles.tableCol, { width: '45%' }]}>
              <Text style={styles.tableCell}></Text>
            </View>
          </View>
        </View>
        
        {/* Approval Section */}
        <View style={styles.approvalSection}>
          <View style={styles.approvalBlock}>
            <Text style={styles.approvalText}>Recommended/Not Recommended</Text>
            <View style={styles.approvalSignatureSpace}></View>
            <Text style={[styles.approvalText, { fontWeight: 'bold' }]}>Dr. Rakesh Maurya</Text>
            <Text style={styles.approvalText}>Chairman, F & SW</Text>
          </View>
          
          <View style={styles.approvalBlock}>
            <Text style={styles.approvalText}>Recommended/Not Recommended</Text>
            <View style={styles.approvalSignatureSpace}></View>
            <Text style={[styles.approvalText, { fontWeight: 'bold' }]}>Dr. Shweta N. Shah</Text>
            <Text style={styles.approvalText}>Associate Dean (SW)</Text>
          </View>
          
          <View style={styles.approvalBlock}>
            <Text style={styles.approvalText}>Approved/Not Approved</Text>
            <View style={styles.approvalSignatureSpace}></View>
            <Text style={[styles.approvalText, { fontWeight: 'bold' }]}>Dr. Sanjay R. Patel</Text>
            <Text style={styles.approvalText}>Dean (Students Welfare)</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

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
  const [moveFinancialToPage2, setMoveFinancialToPage2] = useState(false);
  const [moveAboutEventToPage2, setMoveAboutEventToPage2] = useState(false);
  const [moveSignaturesToPage2, setMoveSignaturesToPage2] = useState(false);
  
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

  const handleToggleFinancialPosition = () => {
    setMoveFinancialToPage2(!moveFinancialToPage2);
  };
  
  const handleToggleAboutEventPosition = () => {
    setMoveAboutEventToPage2(!moveAboutEventToPage2);
  };
  
  const handleToggleSignaturesPosition = () => {
    setMoveSignaturesToPage2(!moveSignaturesToPage2);
  };

  const handleDownloadPDF = async () => {
    try {
      setPdfError(null);
      const doc = <PDFDocument 
        document={document} 
        signature={signature} 
        moveFinancialToPage2={moveFinancialToPage2} 
        moveAboutEventToPage2={moveAboutEventToPage2}
        moveSignaturesToPage2={moveSignaturesToPage2}
      />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      saveAs(blob, `document-${documentId}.pdf`);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setPdfError('Failed to download PDF. Please try again.');
    }
  };

  const handleSubmitDocument = async () => {
    if (!signature) {
      setSignatureError("Please add your signature before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
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
      
      // Generate PDF document
      const doc = <PDFDocument 
        document={document} 
        signature={signature} 
        moveFinancialToPage2={moveFinancialToPage2}
        moveAboutEventToPage2={moveAboutEventToPage2}
        moveSignaturesToPage2={moveSignaturesToPage2}
      />;
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      
      // Create form data for PDF upload
      const pdfFormData = new FormData();
      pdfFormData.append('pdf', blob, 'document.pdf');
      pdfFormData.append('documentId', documentId);
      pdfFormData.append('version', 'studentSigned');
      
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
      setError('Failed to submit document. Please try again.');
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

        {/* PDF Error */}
        {pdfError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{pdfError}</p>
          </div>
        )}

        {/* Layout options */}
        <div className="mb-3 flex gap-3 flex-wrap">
          <button
            onClick={handleToggleFinancialPosition}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
          >
            {moveFinancialToPage2 ? "Move Financial to Page 1" : "Move Financial to Page 2"}
          </button>
          <button
            onClick={handleToggleAboutEventPosition}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
          >
            {moveAboutEventToPage2 ? "Move About Event to Page 1" : "Move About Event to Page 2"}
          </button>
          <button
            onClick={handleToggleSignaturesPosition}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
          >
            {moveSignaturesToPage2 ? "Move Signatures to Page 1" : "Move Signatures to Page 2"}
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
              <PDFDocument 
                document={document} 
                signature={signature}
                moveFinancialToPage2={moveFinancialToPage2}
              />
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