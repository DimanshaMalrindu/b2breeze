export interface Invoice {
    id: string;
    invoiceNumber: string;
    type: 'quotation' | 'proforma' | 'commercial';
    status: 'pending' | 'approved' | 'payment-received' | 'cancelled' | 'overdue';
    customerId?: string; // From Customer Directory
    customerDetails: CustomerDetails;
    companyDetails: CompanyDetails;
    items: InvoiceItem[];
    subtotal: number;
    taxAmount: number;
    taxRate: number;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    total: number;
    currency: string;
    notes?: string;
    termsAndConditions?: string;
    paymentTerms?: string;
    dueDate?: Date;
    issueDate: Date;
    createdAt: Date;
    updatedAt: Date;
    versions: InvoiceVersion[];
    currentVersion: number;
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    discountType: 'percentage' | 'fixed';
    taxRate: number;
    total: number;
    category?: string;
}

export interface CustomerDetails {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    taxId?: string;
}

export interface CompanyDetails {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    website?: string;
    logo?: string;
    taxId?: string;
    registrationNumber?: string;
    bankDetails?: BankDetails;
}

export interface BankDetails {
    bankName: string;
    accountName: string;
    accountNumber: string;
    routingNumber?: string;
    swiftCode?: string;
    iban?: string;
}

export interface InvoiceVersion {
    version: number;
    createdAt: Date;
    createdBy: string;
    changes: string;
    items: InvoiceItem[];
    subtotal: number;
    taxAmount: number;
    total: number;
}

export interface InvoiceTemplate {
    id: string;
    name: string;
    type: 'quotation' | 'proforma' | 'commercial';
    companyDetails: CompanyDetails;
    defaultItems: InvoiceItem[];
    defaultTerms: string;
    defaultNotes: string;
    taxRate: number;
    currency: string;
    isDefault: boolean;
    createdAt: Date;
}

export interface InvoiceFilter {
    type?: Invoice['type'] | 'all';
    status?: Invoice['status'] | 'all';
    dateRange?: {
        start: Date;
        end: Date;
    };
    customerId?: string;
    minAmount?: number;
    maxAmount?: number;
}

export interface InvoiceSort {
    field: 'invoiceNumber' | 'issueDate' | 'dueDate' | 'total' | 'status' | 'customerName';
    direction: 'asc' | 'desc';
}

export interface InvoiceGeneratorState {
    invoices: Invoice[];
    templates: InvoiceTemplate[];
    selectedInvoice?: Invoice;
    selectedTemplate?: InvoiceTemplate;
    view: 'invoices' | 'templates' | 'create' | 'edit' | 'preview';
    searchQuery: string;
    filter: InvoiceFilter;
    sort: InvoiceSort;
    isLoading: boolean;
}

export interface ExportOptions {
    format: 'pdf' | 'png' | 'email' | 'whatsapp';
    includeCompanyLogo: boolean;
    includeWatermark: boolean;
    watermarkText?: string;
    emailSubject?: string;
    emailMessage?: string;
    whatsappMessage?: string;
}

export interface InvoiceSettings {
    companyDetails: CompanyDetails;
    defaultCurrency: string;
    defaultTaxRate: number;
    invoiceNumberFormat: string; // e.g., "INV-{YYYY}-{MM}-{###}"
    nextInvoiceNumber: number;
    paymentTerms: string[];
    defaultPaymentTerms: string;
    languages: string[];
    defaultLanguage: string;
}

export interface InvoiceAnalytics {
    totalInvoices: number;
    totalRevenue: number;
    pendingAmount: number;
    overdueAmount: number;
    averageInvoiceValue: number;
    paymentRate: number; // percentage of invoices paid
    topCustomers: Array<{
        customerId: string;
        customerName: string;
        totalAmount: number;
        invoiceCount: number;
    }>;
    monthlyRevenue: Array<{
        month: string;
        revenue: number;
        invoiceCount: number;
    }>;
}
