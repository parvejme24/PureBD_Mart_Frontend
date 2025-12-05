// Bangla Font Support for jsPDF
// This file loads and registers a Bangla-supporting font for PDF generation

// We'll use Noto Sans Bengali from Google Fonts
// The font is loaded dynamically and converted to base64 for jsPDF

let fontLoaded = false;
let fontData = null;

// Function to load Bangla font
export const loadBanglaFont = async () => {
  if (fontLoaded && fontData) {
    return fontData;
  }

  try {
    // Load Noto Sans Bengali font from Google Fonts CDN
    const fontUrl = 'https://fonts.gstatic.com/s/notosansbengali/v20/Cn-SJsCGWQxOjaGwMQ6fIiMywrNJIky6nvd8BjzVMvJx2mcSPVFpVEqE-6KmsolLudCk8izI0lc.ttf';
    
    const response = await fetch(fontUrl);
    if (!response.ok) {
      throw new Error('Failed to load Bangla font');
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    // Convert to base64
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    
    fontData = base64;
    fontLoaded = true;
    
    return fontData;
  } catch (error) {
    console.error('Error loading Bangla font:', error);
    return null;
  }
};

// Function to register Bangla font with jsPDF
export const registerBanglaFont = async (doc) => {
  try {
    const base64Font = await loadBanglaFont();
    
    if (base64Font) {
      // Add the font to jsPDF
      doc.addFileToVFS('NotoSansBengali-Regular.ttf', base64Font);
      doc.addFont('NotoSansBengali-Regular.ttf', 'NotoSansBengali', 'normal');
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error registering Bangla font:', error);
    return false;
  }
};

// Check if text contains Bangla characters
export const containsBangla = (text) => {
  if (!text) return false;
  // Bangla Unicode range: \u0980-\u09FF
  const banglaRegex = /[\u0980-\u09FF]/;
  return banglaRegex.test(text);
};

// Set appropriate font based on text content
export const setSmartFont = (doc, text, style = 'normal') => {
  if (containsBangla(text)) {
    doc.setFont('NotoSansBengali', style);
  } else {
    doc.setFont('helvetica', style);
  }
};

export default {
  loadBanglaFont,
  registerBanglaFont,
  containsBangla,
  setSmartFont,
};

