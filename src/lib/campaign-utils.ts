import type { 
    Campaign, 
    CampaignTemplate, 
    QRCodeForm, 
    CampaignAnalytics,
    CampaignFilter 
} from '@/types/campaign';

const STORAGE_KEYS = {
    CAMPAIGNS: 'b2breeze_campaigns',
    TEMPLATES: 'b2breeze_campaign_templates',
    RECIPIENTS: 'b2breeze_campaign_recipients',
    QR_FORMS: 'b2breeze_qr_forms'
};

// Sample Campaign Templates
export const SAMPLE_TEMPLATES: CampaignTemplate[] = [
    {
        id: 'template-1',
        name: 'Event Follow-up',
        subject: 'Great meeting you at {Event}!',
        content: 'Hi {Name},\n\nIt was wonderful meeting you at {Event}. I hope you found our discussion about {Topic} valuable.\n\nAs promised, I\'m attaching our latest catalog for your review. Please feel free to reach out if you have any questions.\n\nBest regards,\n{SenderName}\n{Company}',
        variables: ['Name', 'Event', 'Topic', 'SenderName', 'Company'],
        type: 'email',
        category: 'follow-up',
        createdAt: new Date('2025-07-15')
    },
    {
        id: 'template-2',
        name: 'WhatsApp Introduction',
        content: 'Hello {Name}! 👋\n\nThank you for your interest in {Company}. We specialize in {Service} and would love to help you achieve your goals.\n\nWould you like to schedule a quick call to discuss your requirements?\n\nBest regards,\n{SenderName}',
        variables: ['Name', 'Company', 'Service', 'SenderName'],
        type: 'whatsapp',
        category: 'introduction',
        createdAt: new Date('2025-07-20')
    },
    {
        id: 'template-3',
        name: 'Product Launch Announcement',
        subject: 'Exciting News: New {ProductName} Launch!',
        content: 'Dear {Name},\n\nWe\'re thrilled to announce the launch of our latest product - {ProductName}!\n\n{ProductDescription}\n\nAs a valued contact, you\'re among the first to know. Check it out at {ProductURL}\n\nSpecial launch offer: Use code LAUNCH25 for 25% off!\n\nBest regards,\n{SenderName}',
        variables: ['Name', 'ProductName', 'ProductDescription', 'ProductURL', 'SenderName'],
        type: 'email',
        category: 'promotional',
        createdAt: new Date('2025-07-25')
    },
    {
        id: 'template-4',
        name: 'Trade Fair Thank You',
        content: 'Hi {Name}!\n\nThank you for visiting our booth at {EventName}. It was great discussing {Topic} with you.\n\nHere\'s the information you requested: {Information}\n\nLet\'s continue the conversation! When would be a good time for a follow-up call?\n\nBest regards,\n{SenderName}\n{Company}',
        variables: ['Name', 'EventName', 'Topic', 'Information', 'SenderName', 'Company'],
        type: 'whatsapp',
        category: 'event',
        createdAt: new Date('2025-08-01')
    }
];

// Sample QR Code Forms
export const SAMPLE_QR_FORMS: QRCodeForm[] = [
    {
        id: 'qr-form-1',
        name: 'Trade Fair Contact Form',
        title: 'Connect with BusinessPro',
        description: 'Thank you for visiting our booth! Please share your details to receive our catalog and special offers.',
        fields: [
            {
                id: 'field-1',
                type: 'text',
                label: 'Full Name',
                placeholder: 'Enter your full name',
                required: true,
                order: 1
            },
            {
                id: 'field-2',
                type: 'email',
                label: 'Email Address',
                placeholder: 'your.email@company.com',
                required: true,
                order: 2
            },
            {
                id: 'field-3',
                type: 'phone',
                label: 'Phone Number',
                placeholder: '+1 (555) 123-4567',
                required: false,
                order: 3
            },
            {
                id: 'field-4',
                type: 'company',
                label: 'Company Name',
                placeholder: 'Your company name',
                required: true,
                order: 4
            },
            {
                id: 'field-5',
                type: 'select',
                label: 'Industry',
                placeholder: 'Select your industry',
                required: false,
                options: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Other'],
                order: 5
            },
            {
                id: 'field-6',
                type: 'textarea',
                label: 'How can we help you?',
                placeholder: 'Tell us about your requirements...',
                required: false,
                order: 6
            }
        ],
        autoResponseEnabled: true,
        autoResponseTemplate: SAMPLE_TEMPLATES[0],
        isActive: true,
        createdAt: new Date('2025-07-10'),
        submissions: [
            {
                id: 'submission-1',
                formId: 'qr-form-1',
                data: {
                    'Full Name': 'Alex Johnson',
                    'Email Address': 'alex.johnson@techcorp.com',
                    'Phone Number': '+1 (555) 123-4567',
                    'Company Name': 'TechCorp Solutions',
                    'Industry': 'Technology',
                    'How can we help you?': 'Looking for CRM solutions for our growing team'
                },
                submittedAt: new Date('2025-08-01T10:30:00Z'),
                ipAddress: '192.168.1.100',
                customerId: 'customer-1'
            },
            {
                id: 'submission-2',
                formId: 'qr-form-1',
                data: {
                    'Full Name': 'Sarah Mitchell',
                    'Email Address': 'sarah@healthplus.com',
                    'Company Name': 'HealthPlus Clinic',
                    'Industry': 'Healthcare'
                },
                submittedAt: new Date('2025-08-02T14:15:00Z'),
                ipAddress: '192.168.1.101',
                customerId: 'customer-8'
            }
        ],
        analytics: {
            totalViews: 150,
            totalSubmissions: 25,
            conversionRate: 16.67,
            submissionsToday: 3,
            submissionsThisWeek: 8,
            submissionsThisMonth: 25
        }
    }
];

// Sample Campaigns
export const SAMPLE_CAMPAIGNS: Campaign[] = [
    {
        id: 'campaign-1',
        name: 'Tech Conference Follow-up',
        description: 'Follow-up email campaign for contacts from Tech Summit 2025',
        type: 'email',
        status: 'completed',
        templateId: 'template-1',
        recipientIds: ['customer-1', 'customer-2', 'customer-3', 'customer-4'],
        createdAt: new Date('2025-07-28'),
        scheduledAt: new Date('2025-07-29T09:00:00Z'),
        sentAt: new Date('2025-07-29T09:15:00Z'),
        analytics: {
            sent: 4,
            delivered: 4,
            opened: 3,
            clicked: 2,
            responded: 1,
            bounced: 0,
            openRate: 75,
            responseRate: 25,
            clickRate: 50
        }
    },
    {
        id: 'campaign-2',
        name: 'Product Launch WhatsApp',
        description: 'WhatsApp campaign announcing new CRM features to key clients',
        type: 'whatsapp',
        status: 'active',
        templateId: 'template-3',
        recipientIds: ['customer-5', 'customer-6', 'customer-7'],
        createdAt: new Date('2025-08-01'),
        scheduledAt: new Date('2025-08-04T10:00:00Z'),
        analytics: {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            responded: 0,
            bounced: 0,
            openRate: 0,
            responseRate: 0,
            clickRate: 0
        }
    },
    {
        id: 'campaign-3',
        name: 'Trade Fair Prospects',
        description: 'Introduction email to leads collected from Trade Fair QR forms',
        type: 'email',
        status: 'draft',
        templateId: 'template-4',
        recipientIds: ['customer-8', 'customer-9'],
        createdAt: new Date('2025-08-03'),
        analytics: {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            responded: 0,
            bounced: 0,
            openRate: 0,
            responseRate: 0,
            clickRate: 0
        }
    }
];

// Storage Functions
export const initializeSampleCampaignData = (): void => {
    if (!localStorage.getItem(STORAGE_KEYS.TEMPLATES)) {
        localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(SAMPLE_TEMPLATES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QR_FORMS)) {
        localStorage.setItem(STORAGE_KEYS.QR_FORMS, JSON.stringify(SAMPLE_QR_FORMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CAMPAIGNS)) {
        localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(SAMPLE_CAMPAIGNS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECIPIENTS)) {
        localStorage.setItem(STORAGE_KEYS.RECIPIENTS, JSON.stringify([]));
    }
};

export const getCampaigns = (): Campaign[] => {
    const campaigns = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return campaigns ? JSON.parse(campaigns) : [];
};

export const saveCampaigns = (campaigns: Campaign[]): void => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
};

export const getTemplates = (): CampaignTemplate[] => {
    const templates = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return templates ? JSON.parse(templates) : [];
};

export const saveTemplates = (templates: CampaignTemplate[]): void => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
};

export const getQRForms = (): QRCodeForm[] => {
    const forms = localStorage.getItem(STORAGE_KEYS.QR_FORMS);
    return forms ? JSON.parse(forms) : [];
};

export const saveQRForms = (forms: QRCodeForm[]): void => {
    localStorage.setItem(STORAGE_KEYS.QR_FORMS, JSON.stringify(forms));
};

// Utility Functions
export const searchCampaigns = (campaigns: Campaign[], query: string): Campaign[] => {
    if (!query.trim()) return campaigns;
    
    const searchTerm = query.toLowerCase();
    return campaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm) ||
        campaign.description.toLowerCase().includes(searchTerm) ||
        campaign.type.toLowerCase().includes(searchTerm)
    );
};

export const filterCampaigns = (campaigns: Campaign[], filter: CampaignFilter): Campaign[] => {
    return campaigns.filter(campaign => {
        if (filter.status && filter.status !== 'all' && campaign.status !== filter.status) {
            return false;
        }
        if (filter.type && filter.type !== 'all' && campaign.type !== filter.type) {
            return false;
        }
        if (filter.dateRange) {
            const campaignDate = new Date(campaign.createdAt);
            if (campaignDate < filter.dateRange.start || campaignDate > filter.dateRange.end) {
                return false;
            }
        }
        return true;
    });
};

export const getStatusColor = (status: Campaign['status']): string => {
    switch (status) {
        case 'draft': return 'bg-gray-100 text-gray-800';
        case 'active': return 'bg-blue-100 text-blue-800';
        case 'paused': return 'bg-yellow-100 text-yellow-800';
        case 'completed': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export const getTypeColor = (type: Campaign['type']): string => {
    switch (type) {
        case 'email': return 'bg-purple-100 text-purple-800';
        case 'whatsapp': return 'bg-green-100 text-green-800';
        case 'telegram': return 'bg-blue-100 text-blue-800';
        case 'viber': return 'bg-indigo-100 text-indigo-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export const formatAnalytics = (analytics: CampaignAnalytics): string => {
    if (analytics.sent === 0) return 'No data yet';
    return `${analytics.openRate.toFixed(1)}% open, ${analytics.responseRate.toFixed(1)}% response`;
};

export const calculateTotalAnalytics = (campaigns: Campaign[]): CampaignAnalytics => {
    const totals = campaigns.reduce((acc, campaign) => {
        acc.sent += campaign.analytics.sent;
        acc.delivered += campaign.analytics.delivered;
        acc.opened += campaign.analytics.opened;
        acc.clicked += campaign.analytics.clicked;
        acc.responded += campaign.analytics.responded;
        acc.bounced += campaign.analytics.bounced;
        return acc;
    }, {
        sent: 0, delivered: 0, opened: 0, clicked: 0, responded: 0, bounced: 0,
        openRate: 0, responseRate: 0, clickRate: 0
    });

    totals.openRate = totals.sent > 0 ? (totals.opened / totals.sent) * 100 : 0;
    totals.responseRate = totals.sent > 0 ? (totals.responded / totals.sent) * 100 : 0;
    totals.clickRate = totals.opened > 0 ? (totals.clicked / totals.opened) * 100 : 0;

    return totals;
};

export const generateQRCodeUrl = (formId: string): string => {
    // In a real app, this would generate an actual QR code
    const baseUrl = window.location.origin;
    return `${baseUrl}/qr-form/${formId}`;
};

export const extractTemplateVariables = (content: string): string[] => {
    const variableRegex = /\{([^}]+)\}/g;
    const variables: string[] = [];
    let match;
    
    while ((match = variableRegex.exec(content)) !== null) {
        if (!variables.includes(match[1])) {
            variables.push(match[1]);
        }
    }
    
    return variables;
};

export const processTemplateContent = (template: CampaignTemplate, variables: Record<string, string>): string => {
    let processedContent = template.content;
    
    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        processedContent = processedContent.replace(regex, value);
    });
    
    return processedContent;
};
