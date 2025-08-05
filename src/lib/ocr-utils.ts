import Tesseract from 'tesseract.js';
import type { ContactFormData, ScanResult } from '@/types/business-card';

export const extractTextFromImage = async (imageFile: File | string): Promise<ScanResult> => {
  try {
    const { data: { text, confidence } } = await Tesseract.recognize(imageFile, 'eng+chi_sim+jpn+kor+ara+rus+spa+fra+deu+ita', {
      logger: m => console.log(m)
    });

    const extractedData = parseBusinessCardText(text);
    
    return {
      text,
      confidence,
      extractedData
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

const parseBusinessCardText = (text: string): Partial<ContactFormData> => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const extractedData: Partial<ContactFormData> = {};

  // Email regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    extractedData.email = emailMatch[0];
  }

  // Phone regex (various formats)
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})|(?:\+?[0-9]{1,3}[-.\s]?)?(?:\([0-9]{1,4}\)[-.\s]?)?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}/g;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    extractedData.phone = phoneMatch[0].replace(/[^\d+]/g, '').replace(/^\d/, '+$&');
  }

  // Website regex
  const websiteRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g;
  const websiteMatch = text.match(websiteRegex);
  if (websiteMatch) {
    extractedData.website = websiteMatch[0].startsWith('http') ? websiteMatch[0] : `https://${websiteMatch[0]}`;
  }

  // Try to extract name (usually first line or line with title indicators)
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    const line = lines[i].trim();
    if (line && !emailMatch?.includes(line) && !phoneMatch?.includes(line)) {
      if (!extractedData.name && isLikelyName(line)) {
        extractedData.name = line;
      } else if (!extractedData.company && isLikelyCompany(line)) {
        extractedData.company = line;
      } else if (!extractedData.title && isLikelyTitle(line)) {
        extractedData.title = line;
      }
    }
  }

  // Extract address (usually contains common address keywords)
  const addressKeywords = ['street', 'road', 'avenue', 'drive', 'lane', 'boulevard', 'suite', 'floor', 'building'];
  for (const line of lines) {
    if (addressKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
      extractedData.address = line;
      break;
    }
  }

  return extractedData;
};

const isLikelyName = (text: string): boolean => {
  // Check if it looks like a person's name
  const words = text.split(' ');
  return words.length >= 2 && words.length <= 4 && 
         words.every(word => /^[A-Za-z]+$/.test(word)) &&
         words.every(word => word.charAt(0) === word.charAt(0).toUpperCase());
};

const isLikelyCompany = (text: string): boolean => {
  // Check for common company indicators
  const companyIndicators = ['inc', 'corp', 'llc', 'ltd', 'company', 'co.', 'corporation', 'group', 'enterprises'];
  return companyIndicators.some(indicator => 
    text.toLowerCase().includes(indicator.toLowerCase())
  );
};

const isLikelyTitle = (text: string): boolean => {
  // Check for common job titles
  const titleKeywords = ['manager', 'director', 'ceo', 'cto', 'president', 'vice', 'senior', 'junior', 'lead', 'head', 'chief', 'officer', 'coordinator', 'specialist', 'analyst', 'consultant', 'engineer', 'developer', 'designer'];
  return titleKeywords.some(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
};
