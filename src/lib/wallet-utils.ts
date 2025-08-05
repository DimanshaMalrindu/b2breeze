import type { BusinessCardData } from '@/types/business-card';

export interface BusinessCardFilters {
  search: string;
  company: string;
  tags: string[];
  dateRange: 'all' | 'week' | 'month' | 'year';
  sortBy: 'name' | 'company' | 'date' | 'recent';
  sortOrder: 'asc' | 'desc';
}

export const getBusinessCards = (): BusinessCardData[] => {
  try {
    const cards = localStorage.getItem('businessCards');
    return cards ? JSON.parse(cards) : [];
  } catch (error) {
    console.error('Error loading business cards:', error);
    return [];
  }
};

export const saveBusinessCards = (cards: BusinessCardData[]): void => {
  try {
    localStorage.setItem('businessCards', JSON.stringify(cards));
  } catch (error) {
    console.error('Error saving business cards:', error);
  }
};

export const deleteBusinessCard = (id: string): void => {
  const cards = getBusinessCards();
  const filteredCards = cards.filter(card => card.id !== id);
  saveBusinessCards(filteredCards);
};

export const updateBusinessCard = (updatedCard: BusinessCardData): void => {
  const cards = getBusinessCards();
  const cardIndex = cards.findIndex(card => card.id === updatedCard.id);
  if (cardIndex !== -1) {
    cards[cardIndex] = { ...updatedCard, updatedAt: new Date() };
    saveBusinessCards(cards);
  }
};

export const filterBusinessCards = (cards: BusinessCardData[], filters: BusinessCardFilters): BusinessCardData[] => {
  let filteredCards = [...cards];

  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredCards = filteredCards.filter(card =>
      card.name.toLowerCase().includes(searchTerm) ||
      card.company.toLowerCase().includes(searchTerm) ||
      card.email.toLowerCase().includes(searchTerm) ||
      card.phone.includes(searchTerm) ||
      (card.notes && card.notes.toLowerCase().includes(searchTerm))
    );
  }

  // Company filter
  if (filters.company) {
    filteredCards = filteredCards.filter(card =>
      card.company.toLowerCase().includes(filters.company.toLowerCase())
    );
  }

  // Date range filter
  if (filters.dateRange !== 'all') {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (filters.dateRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    filteredCards = filteredCards.filter(card =>
      new Date(card.createdAt) >= cutoffDate
    );
  }

  // Sort
  filteredCards.sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (filters.sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'company':
        aValue = a.company.toLowerCase();
        bValue = b.company.toLowerCase();
        break;
      case 'date':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'recent':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return filteredCards;
};

export const getUniqueCompanies = (cards: BusinessCardData[]): string[] => {
  const companies = cards
    .map(card => card.company)
    .filter(company => company.trim() !== '');
  return [...new Set(companies)].sort();
};

export const exportToVCard = (card: BusinessCardData): string => {
  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${card.name}`,
    `ORG:${card.company}`,
    `TITLE:${card.title}`,
    `EMAIL:${card.email}`,
    `TEL:${card.phone}`,
    card.website ? `URL:${card.website}` : '',
    card.address ? `ADR:;;${card.address};;;;` : '',
    card.notes ? `NOTE:${card.notes}` : '',
    'END:VCARD'
  ].filter(line => line !== '').join('\n');
  
  return vCard;
};

export const downloadVCard = (card: BusinessCardData): void => {
  const vCardData = exportToVCard(card);
  const blob = new Blob([vCardData], { type: 'text/vcard' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${card.name.replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const exportAllToCSV = (cards: BusinessCardData[]): void => {
  const headers = ['Name', 'Company', 'Title', 'Email', 'Phone', 'Website', 'Address', 'Notes', 'Created Date'];
  const csvContent = [
    headers.join(','),
    ...cards.map(card => [
      `"${card.name}"`,
      `"${card.company}"`,
      `"${card.title}"`,
      `"${card.email}"`,
      `"${card.phone}"`,
      `"${card.website || ''}"`,
      `"${card.address || ''}"`,
      `"${card.notes || ''}"`,
      `"${new Date(card.createdAt).toLocaleDateString()}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'business_cards.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Sample business cards data
const SAMPLE_BUSINESS_CARDS: BusinessCardData[] = [
  {
    id: 'sample-1',
    name: 'John Smith',
    company: 'TechCorp Solutions',
    title: 'Senior Software Engineer',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    website: 'https://techcorp.com',
    address: '123 Innovation Drive, Silicon Valley, CA 94043',
    notes: 'Specializes in React and Node.js development. Met at Tech Conference 2024.',
    originalCardImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzJkM2E4YyIvPjx0ZXh0IHg9IjIwIiB5PSI0MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCI+Sm9obiBTbWl0aDwvdGV4dD48dGV4dCB4PSIyMCIgeT0iNjUiIGZpbGw9IiNhY2I2ZjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCI+U2VuaW9yIFNvZnR3YXJlIEVuZ2luZWVyPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI5MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCI+VGVjaENvcnAgU29sdXRpb25zPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSIxMjAiIGZpbGw9IiNhY2I2ZjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+am9obi5zbWl0aEB0ZWNoY29ycC5jb208L3RleHQ+PHRleHQgeD0iMjAiIHk9IjE0MCIgZmlsbD0iI2FjYjZmMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj4rMSAoNTU1KSAxMjMtNDU2NzwvdGV4dD48L3N2Zz4=',
    createdAt: new Date('2024-07-15'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: 'sample-2',
    name: 'Sarah Johnson',
    company: 'Digital Marketing Pro',
    title: 'Marketing Director',
    email: 'sarah@digitalmarketingpro.com',
    phone: '+1 (555) 987-6543',
    website: 'https://digitalmarketingpro.com',
    address: '456 Business Blvd, New York, NY 10001',
    notes: 'Expert in social media campaigns and content strategy. Great contact for marketing collaboration.',
    originalCardImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VjNDg5OSIvPjx0ZXh0IHg9IjIwIiB5PSI0MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCI+U2FyYWggSm9obnNvbjwvdGV4dD48dGV4dCB4PSIyMCIgeT0iNjUiIGZpbGw9IiNmY2U3ZjMiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCI+TWFya2V0aW5nIERpcmVjdG9yPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI5MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCI+RGlnaXRhbCBNYXJrZXRpbmcgUHJvPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSIxMjAiIGZpbGw9IiNmY2U3ZjMiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+c2FyYWhAZGlnaXRhbG1hcmtldGluZ3Byby5jb208L3RleHQ+PHRleHQgeD0iMjAiIHk9IjE0MCIgZmlsbD0iI2ZjZTdmMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj4rMSAoNTU1KSA5ODctNjU0MzwvdGV4dD48L3N2Zz4=',
    createdAt: new Date('2024-07-20'),
    updatedAt: new Date('2024-07-20'),
  },
  {
    id: 'sample-3',
    name: 'Michael Chen',
    company: 'InnovateLab',
    title: 'CEO & Founder',
    email: 'michael@innovatelab.io',
    phone: '+1 (555) 456-7890',
    website: 'https://innovatelab.io',
    address: '789 Startup Avenue, Austin, TX 78701',
    notes: 'Entrepreneur focused on AI and machine learning startups. Potential investor for tech ventures.',
    originalCardImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzA5OWVhMCIvPjx0ZXh0IHg9IjIwIiB5PSI0MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCI+TWljaGFlbCBDaGVuPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI2NSIgZmlsbD0iI2FjZjJmNCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5DRU8gJiBGb3VuZGVyPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI5MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCI+SW5ub3ZhdGVMYWI8L3RleHQ+PHRleHQgeD0iMjAiIHk9IjEyMCIgZmlsbD0iI2FjZjJmNCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj5taWNoYWVsQGlubm92YXRlbGFiLmlvPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSIxNDAiIGZpbGw9IiNhY2YyZjQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+KzEgKDU1NSkgNDU2LTc4OTA8L3RleHQ+PC9zdmc+',
    createdAt: new Date('2024-07-25'),
    updatedAt: new Date('2024-07-25'),
  },
  {
    id: 'sample-4',
    name: 'Emily Rodriguez',
    company: 'Creative Designs Studio',
    title: 'Senior UX Designer',
    email: 'emily.rodriguez@creativedesigns.com',
    phone: '+1 (555) 321-0987',
    website: 'https://creativedesigns.com',
    address: '321 Design District, Los Angeles, CA 90028',
    notes: 'Talented UX/UI designer with experience in mobile and web applications. Portfolio: emilydesigns.com',
    originalCardImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1OWU0OCIvPjx0ZXh0IHg9IjIwIiB5PSI0MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCI+RW1pbHkgUm9kcmlndWV6PC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI2NSIgZmlsbD0iI2ZlZDdhMyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5TZW5pb3IgVVggRGVzaWduZXI8L3RleHQ+PHRleHQgeD0iMjAiIHk9IjkwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4Ij5DcmVhdGl2ZSBEZXNpZ25zIFN0dWRpbzwvdGV4dD48dGV4dCB4PSIyMCIgeT0iMTIwIiBmaWxsPSIjZmVkN2EzIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPmVtaWx5LnJvZHJpZ3VlekBjcmVhdGl2ZWRlc2lnbnMuY29tPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSIxNDAiIGZpbGw9IiNmZWQ3YTMiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+KzEgKDU1NSkgMzIxLTA5ODc8L3RleHQ+PC9zdmc+',
    createdAt: new Date('2024-07-30'),
    updatedAt: new Date('2024-07-30'),
  },
  {
    id: 'sample-5',
    name: 'David Kumar',
    company: 'Financial Advisory Group',
    title: 'Senior Financial Advisor',
    email: 'david.kumar@financialadvisory.com',
    phone: '+1 (555) 654-3210',
    website: 'https://financialadvisory.com',
    address: '987 Finance Street, Chicago, IL 60601',
    notes: 'Certified Financial Planner with 15+ years experience. Specializes in retirement and investment planning.',
    originalCardImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM3NDE1ZCIvPjx0ZXh0IHg9IjIwIiB5PSI0MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCI+RGF2aWQgS3VtYXI8L3RleHQ+PHRleHQgeD0iMjAiIHk9IjY1IiBmaWxsPSIjY2JkNWUxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPlNlbmlvciBGaW5hbmNpYWwgQWR2aXNvcjwvdGV4dD48dGV4dCB4PSIyMCIgeT0iOTAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiPkZpbmFuY2lhbCBBZHZpc29yeSBHcm91cDwvdGV4dD48dGV4dCB4PSIyMCIgeT0iMTIwIiBmaWxsPSIjY2JkNWUxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPmRhdmlkLmt1bWFyQGZpbmFuY2lhbGFkdmlzb3J5LmNvbTwvdGV4dD48dGV4dCB4PSIyMCIgeT0iMTQwIiBmaWxsPSIjY2JkNWUxIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPisxICg1NTUpIDY1NC0zMjEwPC90ZXh0Pjwvc3ZnPg==',
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-08-01'),
  },
  {
    id: 'sample-6',
    name: 'Lisa Park',
    company: 'Green Energy Solutions',
    title: 'Environmental Engineer',
    email: 'lisa.park@greenenergy.com',
    phone: '+1 (555) 789-0123',
    website: 'https://greenenergy.com',
    address: '147 Sustainable Way, Portland, OR 97201',
    notes: 'Expert in renewable energy systems and sustainability consulting. Working on solar panel innovations.',
    originalCardImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzIyYzU1ZSIvPjx0ZXh0IHg9IjIwIiB5PSI0MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCI+TGlzYSBQYXJrPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI2NSIgZmlsbD0iI2FkZjJiZiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5FbnZpcm9ubWVudGFsIEVuZ2luZWVyPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI5MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCI+R3JlZW4gRW5lcmd5IFNvbHV0aW9uczwvdGV4dD48dGV4dCB4PSIyMCIgeT0iMTIwIiBmaWxsPSIjYWRmMmJmIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPmxpc2EucGFya0BncmVlbmVuZXJneS5jb208L3RleHQ+PHRleHQgeD0iMjAiIHk9IjE0MCIgZmlsbD0iI2FkZjJiZiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj4rMSAoNTU1KSA3ODktMDEyMzwvdGV4dD48L3N2Zz4=',
    createdAt: new Date('2024-08-02'),
    updatedAt: new Date('2024-08-02'),
  },
];

// Function to initialize sample business cards
export const initializeSampleBusinessCards = (): void => {
  const existingCards = getBusinessCards();
  
  // Only add sample cards if there are no existing cards
  if (existingCards.length === 0) {
    saveBusinessCards(SAMPLE_BUSINESS_CARDS);
    console.log('Sample business cards initialized');
  }
};

// Function to add sample cards regardless of existing data (for demo purposes)
export const addSampleBusinessCards = (): void => {
  const existingCards = getBusinessCards();
  const newCards = SAMPLE_BUSINESS_CARDS.filter(
    sampleCard => !existingCards.some(existing => existing.id === sampleCard.id)
  );
  
  if (newCards.length > 0) {
    const updatedCards = [...existingCards, ...newCards];
    saveBusinessCards(updatedCards);
    console.log(`Added ${newCards.length} sample business cards`);
  } else {
    console.log('All sample business cards already exist');
  }
};
