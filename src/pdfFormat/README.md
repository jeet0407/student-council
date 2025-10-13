# PDF Format System

This folder contains modular PDF generation components for different types of documents in the student council system.

## Structure

```
pdfFormat/
├── index.js                    # Central registry and factory functions
├── generatePdfCEV.js          # Club Event Voucher configuration
├── CEVComponents.js           # CEV React PDF components
├── generatePdfSEV.js          # Sports Event Voucher configuration
└── README.md                  # This file
```

## Available Formats

### 1. CEV (Club Event Voucher) - `generatePdfCEV.js`
- **Purpose**: Standard format for club event approval documents
- **Use Case**: General club events, competitions, workshops
- **Features**: 
  - Configurable page layout
  - Financial proposal tables
  - Student and faculty signature sections
  - Office use section
  - Approval workflow

### 2. SEV (Sports Event Voucher) - `generatePdfSEV.js`
- **Purpose**: Sports department specific event approval
- **Use Case**: Sports events, tournaments, athletics
- **Features**:
  - Equipment requirements section
  - Participant registration details
  - Budget proposals
  - Coach signatures
  - Sports officer approval

## How to Use

### 1. Basic Usage

```javascript
import PDFFormatManager from '@/pdfFormat';

// Auto-detect format based on document
const formatType = PDFFormatManager.detectPDFFormat(document);

// Generate PDF
const { component: PDFComponent, props } = await PDFFormatManager.generatePDF(
  document, 
  formatType, 
  { signature, moveFinancialToPage2: false }
);

// Render PDF
<PDFViewer>
  <PDFComponent {...props} />
</PDFViewer>
```

### 2. Manual Format Selection

```javascript
import { getPDFComponent, PDFFormatTypes } from '@/pdfFormat';

// Get specific format component
const CEVComponent = getPDFComponent(PDFFormatTypes.CLUB_EVENT_VOUCHER);

// Use with custom props
<PDFViewer>
  <CEVComponent 
    document={document}
    signature={signature}
    moveFinancialToPage2={true}
    moveAboutEventToPage2={false}
  />
</PDFViewer>
```

### 3. Format Configuration Access

```javascript
import { getPDFFormat, PDFFormatTypes } from '@/pdfFormat';

// Get format configuration
const cevConfig = getPDFFormat(PDFFormatTypes.CLUB_EVENT_VOUCHER);

// Access styles, helpers, config
const { styles, helpers, config } = cevConfig;

// Use helper functions
const formattedDate = helpers.formatDate(document.eventDate);
const total = helpers.computeTotal(document.financialProposal);
```

## Adding New Formats

### Step 1: Create Configuration File

Create `generatePdf[FORMAT].js`:

```javascript
// Format configuration
export const [FORMAT]Config = {
  pageSize: 'A4',
  orientation: 'portrait',
  // ... configuration
};

// Format styles
export const [FORMAT]Styles = StyleSheet.create({
  // ... styles
});

// Format helpers
export const [FORMAT]Helpers = {
  // ... helper functions
};

// Export complete format
export const [FORMAT]PDFFormat = {
  config: [FORMAT]Config,
  styles: [FORMAT]Styles,
  helpers: [FORMAT]Helpers,
  type: 'FORMAT_CODE',
  name: 'Format Name',
  description: 'Format description',
};
```

### Step 2: Create Components File

Create `[FORMAT]Components.js`:

```javascript
import { [FORMAT]Styles, [FORMAT]Config } from './generatePdf[FORMAT].js';

// Component exports
export const [FORMAT]PDFDocument = ({ document, ...options }) => (
  <Document>
    {/* PDF structure */}
  </Document>
);

export default [FORMAT]PDFDocument;
```

### Step 3: Register in Index

Update `index.js`:

```javascript
import { [FORMAT]PDFFormat } from './generatePdf[FORMAT].js';
import { [FORMAT]PDFDocument } from './[FORMAT]Components.js';

export const PDFFormats = {
  CEV: CEVPDFFormat,
  SEV: SEVPDFFormat,
  [FORMAT]: [FORMAT]PDFFormat,  // Add new format
};

export const PDFComponents = {
  CEV: CEVPDFDocument,
  SEV: SEVPDFDocument,
  [FORMAT]: [FORMAT]PDFDocument,  // Add new component
};
```

## Configuration Options

### Layout Options
- `moveFinancialToPage2`: Move financial proposal to page 2
- `moveAboutEventToPage2`: Move event details to page 2
- `moveSignaturesToPage2`: Move signature sections to page 2

### Styling Options
Each format can define custom:
- Page dimensions and margins
- Font families and sizes
- Table structures and borders
- Color schemes
- Header/footer configurations

### Validation Rules
Each format can include validation:
- Required fields
- Data format validation
- Business rules
- Error messages

## Format-Specific Features

### CEV Features
- **Tables**: Main info, about event, financial proposal, office use
- **Signatures**: Student head/secretary, faculty co-chairmen/chairman
- **Approvals**: Multi-level approval workflow
- **Layout**: Flexible page breaks and section movement

### SEV Features
- **Sports-specific**: Equipment requirements, participant details
- **Enhanced styling**: Sports department colors and branding
- **Specialized signatures**: Coaches, sports officers
- **Participant management**: Registration details with medical clearance

## Best Practices

1. **Modular Design**: Keep configurations separate from components
2. **Consistent Naming**: Use clear, descriptive names for formats
3. **Validation**: Always validate document structure before generation
4. **Error Handling**: Provide meaningful error messages
5. **Performance**: Optimize for large participant lists or complex layouts
6. **Accessibility**: Ensure PDF accessibility standards
7. **Testing**: Test with various document structures and layouts

## Future Enhancements

- **TEV (Technical Event Voucher)**: For technical symposiums and hackathons
- **CULEV (Cultural Event Voucher)**: For cultural events and festivals
- **WV (Workshop Voucher)**: For workshops and training sessions
- **CV (Conference Voucher)**: For academic conferences
- **Dynamic Templates**: User-configurable templates
- **Multi-language Support**: Regional language support
- **Digital Signatures**: Integration with digital signature services
- **Batch Processing**: Generate multiple documents at once
- **Template Inheritance**: Base templates with format-specific extensions

## Migration Guide

To migrate existing PDF generation to use this system:

1. **Identify Current Format**: Determine which format matches your document
2. **Update Imports**: Replace direct PDF components with format manager
3. **Test Layout**: Verify layout options work as expected
4. **Validate Data**: Ensure document structure meets format requirements
5. **Update Props**: Map existing props to new format system

This modular approach allows for easy maintenance, consistent formatting across different document types, and simple addition of new formats for other clubs and departments.