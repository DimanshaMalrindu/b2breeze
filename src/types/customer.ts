export interface CustomerContact {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  country: string;
  inquiryDescription: string;
  customerPhoto?: string;
  businessCardImage?: string;
  documents: CustomerDocument[];
  folderId?: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  notes: string;
}

export interface CustomerDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  url: string;
  size: number;
  uploadedAt: Date;
}

export interface CustomerFolder {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  contactCount: number;
}

export interface CustomerDirectoryState {
  contacts: CustomerContact[];
  folders: CustomerFolder[];
  searchQuery: string;
  selectedFolder?: string;
  sortBy: 'name' | 'company' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
}

export interface ShareOptions {
  whatsapp: boolean;
  viber: boolean;
  email: boolean;
}

export type ExportFormat = 'csv' | 'pdf';
