import type { CustomerContact, CustomerFolder } from '@/types/customer';

const CUSTOMERS_STORAGE_KEY = 'b2breeze_customers';
const FOLDERS_STORAGE_KEY = 'b2breeze_customer_folders';

// Sample customer data
export const SAMPLE_CUSTOMERS: CustomerContact[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    company: 'Mumbai Tea Exports',
    phone: '+91 98765 43210',
    email: 'rajesh@mumbaitea.com',
    country: 'India',
    inquiryDescription: 'Interested in premium tea blends for export to Europe',
    customerPhoto: '',
    businessCardImage: '',
    documents: [],
    folderId: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['tea', 'export', 'premium'],
    notes: 'Met at India Tea Expo 2024. Very interested in organic varieties.'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'European Food Distributors',
    phone: '+49 123 456 7890',
    email: 'sarah@europeandist.com',
    country: 'Germany',
    inquiryDescription: 'Looking for organic tea suppliers for German market',
    customerPhoto: '',
    businessCardImage: '',
    documents: [],
    folderId: '2',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    tags: ['organic', 'distributor', 'germany'],
    notes: 'Requires organic certification. High volume potential.'
  },
  {
    id: '3',
    name: 'Chen Wei',
    company: 'Dragon Import Co.',
    phone: '+86 138 0013 8000',
    email: 'chen@dragonimport.cn',
    country: 'China',
    inquiryDescription: 'Bulk tea import for Chinese market',
    customerPhoto: '',
    businessCardImage: '',
    documents: [],
    folderId: '1',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
    tags: ['bulk', 'import', 'china'],
    notes: 'Looking for competitive pricing on bulk orders.'
  },
  {
    id: '4',
    name: 'Maria Rodriguez',
    company: 'Latin America Foods',
    phone: '+52 55 1234 5678',
    email: 'maria@latamfoods.mx',
    country: 'Mexico',
    inquiryDescription: 'Premium coffee and tea for retail chains',
    customerPhoto: '',
    businessCardImage: '',
    documents: [],
    folderId: '3',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
    tags: ['retail', 'premium', 'coffee'],
    notes: 'Manages 50+ retail locations across Latin America.'
  }
];

export const SAMPLE_FOLDERS: CustomerFolder[] = [
  {
    id: '1',
    name: 'India Tea Expo',
    description: 'Contacts from India Tea Expo 2024',
    color: '#10B981',
    createdAt: new Date('2024-01-10'),
    contactCount: 2
  },
  {
    id: '2',
    name: 'Germany Leads',
    description: 'European market leads',
    color: '#3B82F6',
    createdAt: new Date('2024-02-05'),
    contactCount: 1
  },
  {
    id: '3',
    name: 'Latin America',
    description: 'Latin American market contacts',
    color: '#F59E0B',
    createdAt: new Date('2024-03-15'),
    contactCount: 1
  }
];

// Storage functions
export const getCustomers = (): CustomerContact[] => {
  try {
    const stored = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    return stored ? JSON.parse(stored).map((customer: any) => ({
      ...customer,
      createdAt: new Date(customer.createdAt),
      updatedAt: new Date(customer.updatedAt)
    })) : [];
  } catch (error) {
    console.error('Error loading customers:', error);
    return [];
  }
};

export const saveCustomers = (customers: CustomerContact[]): void => {
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error('Error saving customers:', error);
  }
};

export const getFolders = (): CustomerFolder[] => {
  try {
    const stored = localStorage.getItem(FOLDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored).map((folder: any) => ({
      ...folder,
      createdAt: new Date(folder.createdAt)
    })) : [];
  } catch (error) {
    console.error('Error loading folders:', error);
    return [];
  }
};

export const saveFolders = (folders: CustomerFolder[]): void => {
  try {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  } catch (error) {
    console.error('Error saving folders:', error);
  }
};

// Initialize sample data
export const initializeSampleCustomers = (): void => {
  const existingCustomers = getCustomers();
  const existingFolders = getFolders();
  
  if (existingCustomers.length === 0) {
    saveCustomers(SAMPLE_CUSTOMERS);
  }
  
  if (existingFolders.length === 0) {
    saveFolders(SAMPLE_FOLDERS);
  }
};

// Search and filter functions
export const searchCustomers = (customers: CustomerContact[], query: string): CustomerContact[] => {
  if (!query.trim()) return customers;
  
  const lowercaseQuery = query.toLowerCase();
  return customers.filter(customer =>
    customer.name.toLowerCase().includes(lowercaseQuery) ||
    customer.company.toLowerCase().includes(lowercaseQuery) ||
    customer.email.toLowerCase().includes(lowercaseQuery) ||
    customer.phone.includes(query) ||
    customer.country.toLowerCase().includes(lowercaseQuery) ||
    customer.inquiryDescription.toLowerCase().includes(lowercaseQuery) ||
    customer.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterCustomersByFolder = (customers: CustomerContact[], folderId?: string): CustomerContact[] => {
  if (!folderId) return customers;
  return customers.filter(customer => customer.folderId === folderId);
};

// Export functions
export const exportToCSV = (customers: CustomerContact[]): void => {
  const headers = ['Name', 'Company', 'Phone', 'Email', 'Country', 'Inquiry Description', 'Tags', 'Notes'];
  const csvContent = [
    headers.join(','),
    ...customers.map(customer => [
      `"${customer.name}"`,
      `"${customer.company}"`,
      `"${customer.phone}"`,
      `"${customer.email}"`,
      `"${customer.country}"`,
      `"${customer.inquiryDescription}"`,
      `"${customer.tags.join('; ')}"`,
      `"${customer.notes}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

// Share functions
export const shareViaWhatsApp = (customer: CustomerContact): void => {
  const message = `Contact: ${customer.name}\nCompany: ${customer.company}\nPhone: ${customer.phone}\nEmail: ${customer.email}`;
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
};

export const shareViaViber = (customer: CustomerContact): void => {
  const message = `Contact: ${customer.name}\nCompany: ${customer.company}\nPhone: ${customer.phone}\nEmail: ${customer.email}`;
  const encodedMessage = encodeURIComponent(message);
  window.open(`viber://forward?text=${encodedMessage}`, '_blank');
};

export const shareViaEmail = (customer: CustomerContact): void => {
  const subject = `Contact: ${customer.name} - ${customer.company}`;
  const body = `
Contact Information:
Name: ${customer.name}
Company: ${customer.company}
Phone: ${customer.phone}
Email: ${customer.email}
Country: ${customer.country}

Inquiry: ${customer.inquiryDescription}

Notes: ${customer.notes}
  `.trim();
  
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  window.open(`mailto:?subject=${encodedSubject}&body=${encodedBody}`, '_blank');
};
