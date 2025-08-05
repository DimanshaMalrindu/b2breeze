export interface BusinessCardData {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  notes?: string;
  customerPhoto?: string;
  inquiryNote?: string;
  inquiryPhoto?: string;
  originalCardImage: string;
  createdAt: Date;
  updatedAt: Date;
  reminderDate?: Date;
}

export interface ContactFormData {
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  notes: string;
}

export interface ScanResult {
  text: string;
  confidence: number;
  extractedData: Partial<ContactFormData>;
}

export interface DigitalBusinessCard {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  logo?: string;
  qrCode: string;
  backgroundColor: string;
  textColor: string;
  template: 'modern' | 'classic' | 'minimal';
}
