// src/pdfFormat/fontLoader.js
import { Font } from '@react-pdf/renderer';

// Function to load custom fonts
export const loadFonts = () => {
  // Hindi / Devanagari
  Font.register({
    family: 'NotoDevanagari',
    src: '/fonts/NotoSansDevanagari-Regular.ttf', // exact file in public/fonts/
  });

  // Gujarati
  Font.register({
    family: 'NotoGujarati',
    src: '/fonts/NotoSansGujarati-Regular.ttf', // exact file in public/fonts/
  });

  console.log('Custom fonts loaded for PDF renderer');
};

// Optionally call it immediately if you want fonts loaded on import
// loadFonts();
