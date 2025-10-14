// PDF Component Generator for CEV (Club Event Voucher)
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { CEVStyles, CEVConfig, CEVHelpers } from './generatePdfCEV';
import { HEADER_BASE64 } from './constants';

export const CEVHeader = () => (
  <View style={styles.headerContainer}>
    <Image
      src={HEADER_BASE64} // must be valid Base64 string
      style={styles.headerImage}
    />
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: 100, // adjust to your header height
    objectFit: 'cover',
  },
});
// Document Info Component
export const CEVDocumentInfo = ({ document }) => (
  <View style={CEVStyles.documentInfo}>
    <Text>No : {CEVHelpers.getFieldValue(document, 'documentNumber')}</Text>
    <Text style={{ marginHorizontal: 20 }}></Text>
    <Text>Date : {CEVHelpers.formatDate(document.documentDate)}</Text>
  </View>
);

// Generic Table Row Component
export const CEVTableRow = ({ field, document, colonWidth = '5%', contentWidth = '65%' }) => (
  <View style={CEVStyles.tableRow}>
    <View style={[CEVStyles.tableCol, { width: field.width }]}>
      <Text style={field.isHeader ? CEVStyles.tableCellHeader : CEVStyles.tableCellHeader}>
        {field.label}
      </Text>
    </View>
    <View style={[CEVStyles.tableCol, { width: colonWidth }]}>
      <Text style={CEVStyles.tableCell}>:</Text>
    </View>
    <View style={[CEVStyles.tableCol, { width: contentWidth }]}>
      <Text style={field.isHeader ? CEVStyles.tableCellHeader : CEVStyles.tableCell}>
        {CEVHelpers.getFieldValue(document, field.key)}
      </Text>
    </View>
  </View>
);

// Main Information Table Component
export const CEVMainInfoTable = ({ document }) => (
  <View style={CEVStyles.table} wrap={false}>
    {CEVConfig.tableConfigs.mainInfo.fields.map((field, index) => (
      <CEVTableRow 
        key={index}
        field={field}
        document={document}
        colonWidth={CEVConfig.tableConfigs.mainInfo.colonWidth}
        contentWidth={CEVConfig.tableConfigs.mainInfo.contentWidth}
      />
    ))}
  </View>
);

// About Event Table Component
export const CEVAboutEventTable = ({ document }) => (
  <View style={CEVStyles.table} wrap={false}>
    {/* Section Title */}
    <View style={CEVStyles.tableRow}>
      <View style={[CEVStyles.tableCol, { width: '100%' }]}>
        <Text style={CEVStyles.sectionTitle}>
          {CEVConfig.tableConfigs.aboutEvent.sectionTitle}
        </Text>
      </View>
    </View>
    
    {/* Table Rows */}
    {CEVConfig.tableConfigs.aboutEvent.fields.map((field, index) => (
      <CEVTableRow 
        key={index}
        field={field}
        document={document}
        colonWidth={CEVConfig.tableConfigs.aboutEvent.colonWidth}
        contentWidth={CEVConfig.tableConfigs.aboutEvent.contentWidth}
      />
    ))}
  </View>
);

// Financial Proposal Table Component
export const CEVFinancialProposalTable = ({ data = [] }) => {
  const config = CEVConfig.tableConfigs.financialProposal;
  
  return (
    <View wrap={false}>
      <View style={CEVStyles.financialTable}>
        {/* Section Title */}
        <View style={CEVStyles.tableRow}>
          <View style={[CEVStyles.tableCol, { width: '100%' }]}>
            <Text style={CEVStyles.sectionTitle}>{config.sectionTitle}</Text>
          </View>
        </View>
        
        {/* Header Row */}
        <View style={CEVStyles.tableRow}>
          {config.columns.map((column, index) => (
            <View key={index} style={[CEVStyles.tableCol, { width: column.width }]}>
              <Text style={CEVStyles.financialTableHeader}>{column.label}</Text>
            </View>
          ))}
        </View>
        
        {/* Data Rows */}
        {data.map((item, index) => (
          <View key={index.toString()} style={CEVStyles.tableRow}>
            {config.columns.map((column, colIndex) => (
              <View key={colIndex} style={[CEVStyles.tableCol, { width: column.width }]}>
                <Text style={[
                  CEVStyles.financialTableCell, 
                  column.align === 'right' ? { textAlign: 'right' } : {}
                ]}>
                  {column.key === 'amount' 
                    ? CEVHelpers.formatCurrency(item[column.key] || item.amount, config.currency)
                    : (item[column.key] || item.item || item.description || "")
                  }
                </Text>
              </View>
            ))}
          </View>
        ))}
        
        {/* Total Row */}
        {config.showTotal && (
          <View style={CEVStyles.tableRow}>
            <View style={[CEVStyles.tableCol, { width: config.columns[0].width }]}>
              <Text style={CEVStyles.financialTableTotal}>Total:</Text>
            </View>
            <View style={[CEVStyles.tableCol, { width: config.columns[1].width }]}>
              <Text style={[CEVStyles.financialTableTotal, { textAlign: 'right' }]}>
                {CEVHelpers.formatCurrency(CEVHelpers.computeTotal(data), config.currency)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

// Student Signature Section Component
export const CEVStudentSignatureSection = ({ document, signature }) => {
  const studentConfig = CEVConfig.signatureConfig.student;
  
  return (
    <View style={CEVStyles.signatureSection} wrap={false}>
      {/* Student Head Signature */}
      <View style={[CEVStyles.signatureBlock, { width: studentConfig.section1.width }]}>
        <Text style={CEVStyles.signatureTitle}>{studentConfig.section1.title}</Text>
        {studentConfig.section1.fields.map((field, index) => (
          <Text key={index} style={CEVStyles.signatureText}>
            {field.charAt(0).toUpperCase() + field.slice(1)}: {
              CEVHelpers.getNestedFieldValue(document, 'studentHead', field)
            }
          </Text>
        ))}
        {signature && (
          <View style={{ height: 40, marginTop: 5, border: '1px dashed #000000' }}>
            <Text style={{ fontSize: 8, textAlign: 'center' }}>Signature Added</Text>
          </View>
        )}
      </View>
      
      {/* Student Secretary Signature */}
      <View style={[CEVStyles.signatureBlock, { width: studentConfig.section2.width }]}>
        <Text style={CEVStyles.signatureTitle}>{studentConfig.section2.title}</Text>
        {studentConfig.section2.fields.map((field, index) => (
          <Text key={index} style={CEVStyles.signatureText}>
            {field.charAt(0).toUpperCase() + field.slice(1)}: {
              CEVHelpers.getNestedFieldValue(document, 'studentSecretary', field)
            }
          </Text>
        ))}
      </View>
    </View>
  );
};

// Faculty Signature Section Component
export const CEVFacultySignatureSection = ({ document }) => {
  const facultyConfig = CEVConfig.signatureConfig.faculty;
  
  return (
    <View style={CEVStyles.facultySignatureSection} wrap={false}>
      {Object.values(facultyConfig).map((section, index) => (
        <View key={index} style={[CEVStyles.facultySignatureBlock, { width: section.width }]}>
          <Text style={CEVStyles.signatureTitle}>{section.title}</Text>
          {section.fields.map((field, fieldIndex) => (
            <Text key={fieldIndex} style={CEVStyles.signatureText}>
              {field.charAt(0).toUpperCase() + field.slice(1)}: {
                CEVHelpers.getNestedFieldValue(document, section.dataKey, field)
              }
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

// Office Use Table Component
export const CEVOfficeUseTable = ({ document }) => (
  <View style={CEVStyles.table} wrap={false}>
    {/* Section Title */}
    <View style={CEVStyles.tableRow}>
      <View style={[CEVStyles.tableCol, { width: '100%' }]}>
        <Text style={CEVStyles.sectionTitle}>
          {CEVConfig.tableConfigs.officeUse.sectionTitle}
        </Text>
      </View>
    </View>
    
    {/* Office Use Fields */}
    {CEVConfig.tableConfigs.officeUse.fields.map((field, index) => (
      <View key={index} style={CEVStyles.tableRow}>
        <View style={[CEVStyles.tableCol, { width: field.width }]}>
          <Text style={CEVStyles.tableCellHeader}>{field.label}</Text>
        </View>
        <View style={[CEVStyles.tableCol, { width: CEVConfig.tableConfigs.officeUse.colonWidth }]}>
          <Text style={CEVStyles.tableCell}>:</Text>
        </View>
        <View style={[CEVStyles.tableCol, { width: CEVConfig.tableConfigs.officeUse.contentWidth }]}>
          <Text style={CEVStyles.tableCell}>
            {CEVHelpers.getFieldValue(document, field.key)}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

// Approval Section Component
export const CEVApprovalSection = ({ document }) => (
  <View style={CEVStyles.approvalSection}>
    {CEVConfig.approvalConfig.authorities.map((authority, index) => (
      <View key={index} style={[CEVStyles.approvalBlock, { width: authority.width }]}>
        <Text style={CEVStyles.approvalText}>{authority.title}</Text>
        <View style={[
          CEVStyles.approvalSignatureSpace, 
          { height: CEVConfig.approvalConfig.signatureSpaceHeight }
        ]}></View>
        <Text style={[CEVStyles.approvalText, { fontWeight: 'bold' }]}>
          {authority.name}
        </Text>
        <Text style={CEVStyles.approvalText}>{authority.designation}</Text>
      </View>
    ))}
  </View>
);

// Complete CEV PDF Document Component
export const CEVPDFDocument = ({ 
  document, 
  signature, 
  moveFinancialToPage2 = false, 
  moveAboutEventToPage2 = false, 
  moveSignaturesToPage2 = false 
}) => {
  // Ensure financialProposal exists and is an array
  const financialProposal = document.financialProposal && Array.isArray(document.financialProposal) 
    ? document.financialProposal 
    : [];

  return (
    <Document>
      {/* PAGE 1 */}
      <Page size={CEVConfig.pageSize} style={CEVStyles.page}>
        {/* Header */}
        <CEVHeader document={document} />
        <View style={CEVStyles.divider} />
        
        {/* Document Info */}
        <CEVDocumentInfo document={document} />
        
        {/* Title */}
        <View style={CEVStyles.title}>
          <Text>{CEVConfig.documentStructure.title}</Text>
        </View>
        
        {/* Main Information Table */}
        <CEVMainInfoTable document={document} />
        
        {/* About Event Table - Page 1 or 2 */}
        {!moveAboutEventToPage2 && (
          <CEVAboutEventTable document={document} />
        )}
        
        {/* Financial Proposal - Page 1 or 2 */}
        {!moveFinancialToPage2 && financialProposal.length > 0 && (
          <CEVFinancialProposalTable data={financialProposal} />
        )}
        
        {/* Signature Sections - Page 1 or 2 */}
        {!moveSignaturesToPage2 && (
          <View wrap={false}>
            <CEVStudentSignatureSection document={document} signature={signature} />
            <CEVFacultySignatureSection document={document} />
          </View>
        )}
      </Page>
      
      {/* PAGE 2 */}
      <Page size={CEVConfig.pageSize} style={CEVStyles.page}>
        {/* Header */}
        <CEVHeader document={document} />
        <View style={CEVStyles.divider} />
        
        {/* About Event Table - Show on page 2 if moved */}
        {moveAboutEventToPage2 && (
          <CEVAboutEventTable document={document} />
        )}
        
        {/* Financial Proposal - Show on page 2 if moved */}
        {moveFinancialToPage2 && financialProposal.length > 0 && (
          <CEVFinancialProposalTable data={financialProposal} />
        )}
        
        {/* Signature Sections - Show on page 2 if moved */}
        {moveSignaturesToPage2 && (
          <View wrap={false}>
            <CEVStudentSignatureSection document={document} signature={signature} />
            <CEVFacultySignatureSection document={document} />
          </View>
        )}
        
        {/* Office Use Table - Always on page 2 */}
        <CEVOfficeUseTable document={document} />
        
        {/* Approval Section - Always on page 2 */}
        <CEVApprovalSection document={document} />
      </Page>
    </Document>
  );
};

// Export default CEVPDFDocument
export default CEVPDFDocument;