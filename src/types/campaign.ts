export interface Campaign {
    id: string;
    name: string;
    description: string;
    type: 'email' | 'whatsapp' | 'telegram' | 'viber';
    status: 'draft' | 'active' | 'paused' | 'completed';
    templateId: string;
    recipientIds: string[]; // Customer IDs from directory
    createdAt: Date;
    scheduledAt?: Date;
    sentAt?: Date;
    analytics: CampaignAnalytics;
}

export interface CampaignTemplate {
    id: string;
    name: string;
    subject?: string; // For email campaigns
    content: string;
    variables: string[]; // e.g., ['Name', 'Event', 'Company']
    type: 'email' | 'whatsapp' | 'telegram' | 'viber';
    category: 'follow-up' | 'introduction' | 'promotional' | 'event';
    createdAt: Date;
}

export interface CampaignAnalytics {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    responded: number;
    bounced: number;
    openRate: number; // percentage
    responseRate: number; // percentage
    clickRate: number; // percentage
}

export interface CampaignRecipient {
    id: string;
    campaignId: string;
    customerId: string;
    status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'responded' | 'bounced';
    label: 'interested' | 'not-interested' | 'follow-up' | 'no-response' | '';
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    respondedAt?: Date;
    personalizedContent?: string;
}

export interface QRCodeForm {
    id: string;
    name: string;
    title: string;
    description: string;
    fields: QRFormField[];
    autoResponseEnabled: boolean;
    autoResponseTemplate?: CampaignTemplate;
    redirectUrl?: string;
    isActive: boolean;
    createdAt: Date;
    submissions: QRFormSubmission[];
    analytics: QRFormAnalytics;
}

export interface QRFormField {
    id: string;
    type: 'text' | 'email' | 'phone' | 'company' | 'select' | 'textarea';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[]; // For select fields
    order: number;
}

export interface QRFormSubmission {
    id: string;
    formId: string;
    data: Record<string, string>;
    submittedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    customerId?: string; // If auto-added to directory
}

export interface QRFormAnalytics {
    totalViews: number;
    totalSubmissions: number;
    conversionRate: number;
    submissionsToday: number;
    submissionsThisWeek: number;
    submissionsThisMonth: number;
}

export interface CampaignPlannerState {
    campaigns: Campaign[];
    templates: CampaignTemplate[];
    recipients: CampaignRecipient[];
    qrForms: QRCodeForm[];
    selectedCampaign?: Campaign;
    selectedTemplate?: CampaignTemplate;
    selectedQRForm?: QRCodeForm;
    view: 'campaigns' | 'templates' | 'qr-forms' | 'analytics';
    searchQuery: string;
    filterStatus: Campaign['status'] | 'all';
    filterType: Campaign['type'] | 'all';
}

export interface CampaignFilter {
    status?: Campaign['status'] | 'all';
    type?: Campaign['type'] | 'all';
    dateRange?: {
        start: Date;
        end: Date;
    };
}

export interface EmailIntegration {
    provider: 'gmail' | 'outlook';
    accessToken: string;
    refreshToken: string;
    email: string;
    isConnected: boolean;
}

export interface WhatsAppIntegration {
    businessAccountId: string;
    phoneNumberId: string;
    accessToken: string;
    isConnected: boolean;
}
