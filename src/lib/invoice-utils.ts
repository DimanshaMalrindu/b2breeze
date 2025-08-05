import type { 
    Invoice, 
    InvoiceItem, 
    InvoiceTemplate, 
    CompanyDetails,
    InvoiceFilter,
    InvoiceSort,
    InvoiceAnalytics
} from '@/types/invoice';

const STORAGE_KEYS = {
    INVOICES: 'b2breeze_invoices',
    TEMPLATES: 'b2breeze_invoice_templates',
    SETTINGS: 'b2breeze_invoice_settings'
};

// Sample Company Details
const SAMPLE_COMPANY: CompanyDetails = {
    name: 'BusinessPro Solutions',
    email: 'contact@businesspro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, Suite 100',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    website: 'www.businesspro.com',
    logo: '/logo.png',
    taxId: 'TAX123456789',
    registrationNumber: 'REG987654321',
    bankDetails: {
        bankName: 'Business Bank of America',
        accountName: 'BusinessPro Solutions LLC',
        accountNumber: '1234567890',
        routingNumber: '123456789',
        swiftCode: 'BBOFUS3N',
        iban: 'US64BBOF12345678901234'
    }
};

// Sample Invoice Items
const SAMPLE_ITEMS: InvoiceItem[] = [
    {
        id: 'item-1',
        description: 'Business Card Scanner License (Annual)',
        quantity: 1,
        unitPrice: 299.99,
        discount: 0,
        discountType: 'fixed',
        taxRate: 8.25,
        total: 299.99,
        category: 'Software License'
    },
    {
        id: 'item-2',
        description: 'CRM Setup and Configuration',
        quantity: 5,
        unitPrice: 150.00,
        discount: 10,
        discountType: 'percentage',
        taxRate: 8.25,
        total: 675.00,
        category: 'Professional Services'
    },
    {
        id: 'item-3',
        description: 'Premium Support Package (6 months)',
        quantity: 1,
        unitPrice: 199.99,
        discount: 50,
        discountType: 'fixed',
        taxRate: 8.25,
        total: 149.99,
        category: 'Support'
    }
];

// Sample Invoice Templates
export const SAMPLE_TEMPLATES: InvoiceTemplate[] = [
    {
        id: 'template-1',
        name: 'Standard Quotation',
        type: 'quotation',
        companyDetails: SAMPLE_COMPANY,
        defaultItems: [SAMPLE_ITEMS[0]],
        defaultTerms: 'This quotation is valid for 30 days from the date of issue. Payment terms: Net 30 days.',
        defaultNotes: 'Thank you for your business! Please contact us if you have any questions.',
        taxRate: 8.25,
        currency: 'USD',
        isDefault: true,
        createdAt: new Date('2025-07-01')
    },
    {
        id: 'template-2',
        name: 'Service Invoice',
        type: 'commercial',
        companyDetails: SAMPLE_COMPANY,
        defaultItems: [SAMPLE_ITEMS[1], SAMPLE_ITEMS[2]],
        defaultTerms: 'Payment due within 15 days of invoice date. Late payments may incur a 1.5% monthly service charge.',
        defaultNotes: 'Services have been completed as per agreed scope. Thank you for choosing BusinessPro!',
        taxRate: 8.25,
        currency: 'USD',
        isDefault: false,
        createdAt: new Date('2025-07-15')
    },
    {
        id: 'template-3',
        name: 'Proforma Invoice',
        type: 'proforma',
        companyDetails: SAMPLE_COMPANY,
        defaultItems: SAMPLE_ITEMS,
        defaultTerms: 'This proforma invoice is for customs purposes only. Payment required before shipment.',
        defaultNotes: 'Please review all items carefully. Contact us for any modifications needed.',
        taxRate: 8.25,
        currency: 'USD',
        isDefault: false,
        createdAt: new Date('2025-07-20')
    }
];

// Sample Invoices
export const SAMPLE_INVOICES: Invoice[] = [
    {
        id: 'invoice-1',
        invoiceNumber: 'QUO-2025-08-001',
        type: 'quotation',
        status: 'pending',
        customerId: 'customer-1',
        customerDetails: {
            name: 'Alex Johnson',
            email: 'alex.johnson@techcorp.com',
            phone: '+1 (555) 123-4567',
            company: 'TechCorp Solutions',
            address: '456 Tech Avenue',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94105',
            country: 'United States',
            taxId: 'TAX-TC-001'
        },
        companyDetails: SAMPLE_COMPANY,
        items: [SAMPLE_ITEMS[0], SAMPLE_ITEMS[2]],
        subtotal: 449.98,
        taxAmount: 37.12,
        taxRate: 8.25,
        discountAmount: 0,
        discountType: 'fixed',
        discountValue: 0,
        total: 487.10,
        currency: 'USD',
        notes: 'Special pricing for early adopter program.',
        termsAndConditions: 'This quotation is valid for 30 days from the date of issue.',
        paymentTerms: 'Net 30 days',
        dueDate: new Date('2025-09-03'),
        issueDate: new Date('2025-08-04'),
        createdAt: new Date('2025-08-04'),
        updatedAt: new Date('2025-08-04'),
        versions: [],
        currentVersion: 1
    },
    {
        id: 'invoice-2',
        invoiceNumber: 'INV-2025-08-001',
        type: 'commercial',
        status: 'approved',
        customerId: 'customer-5',
        customerDetails: {
            name: 'Maria Rodriguez',
            email: 'maria@healthplus.com',
            phone: '+1 (555) 987-6543',
            company: 'HealthPlus Medical',
            address: '789 Medical Center Dr',
            city: 'Miami',
            state: 'FL',
            postalCode: '33101',
            country: 'United States',
            taxId: 'TAX-HP-002'
        },
        companyDetails: SAMPLE_COMPANY,
        items: [SAMPLE_ITEMS[1]],
        subtotal: 675.00,
        taxAmount: 55.69,
        taxRate: 8.25,
        discountAmount: 75.00,
        discountType: 'fixed',
        discountValue: 75,
        total: 655.69,
        currency: 'USD',
        notes: 'Setup completed successfully. Welcome to BusinessPro!',
        termsAndConditions: 'Payment due within 15 days. Late payments incur 1.5% monthly charge.',
        paymentTerms: 'Net 15 days',
        dueDate: new Date('2025-08-19'),
        issueDate: new Date('2025-08-02'),
        createdAt: new Date('2025-08-02'),
        updatedAt: new Date('2025-08-03'),
        versions: [
            {
                version: 1,
                createdAt: new Date('2025-08-02'),
                createdBy: 'System',
                changes: 'Initial invoice created',
                items: [SAMPLE_ITEMS[1]],
                subtotal: 750.00,
                taxAmount: 61.88,
                total: 811.88
            }
        ],
        currentVersion: 2
    },
    {
        id: 'invoice-3',
        invoiceNumber: 'PRO-2025-08-001',
        type: 'proforma',
        status: 'payment-received',
        customerId: 'customer-3',
        customerDetails: {
            name: 'Robert Chen',
            email: 'robert.chen@innovate.com',
            phone: '+1 (555) 456-7890',
            company: 'InnovateTech Ltd',
            address: '321 Innovation Blvd',
            city: 'Austin',
            state: 'TX',
            postalCode: '73301',
            country: 'United States',
            taxId: 'TAX-IT-003'
        },
        companyDetails: SAMPLE_COMPANY,
        items: SAMPLE_ITEMS,
        subtotal: 1124.98,
        taxAmount: 92.81,
        taxRate: 8.25,
        discountAmount: 100.00,
        discountType: 'fixed',
        discountValue: 100,
        total: 1117.79,
        currency: 'USD',
        notes: 'Complete package with premium support included.',
        termsAndConditions: 'Payment required before service delivery.',
        paymentTerms: 'Payment in advance',
        issueDate: new Date('2025-07-30'),
        createdAt: new Date('2025-07-30'),
        updatedAt: new Date('2025-08-01'),
        versions: [],
        currentVersion: 1
    }
];

// Storage Functions
export const initializeSampleInvoiceData = (): void => {
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
        localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(SAMPLE_INVOICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TEMPLATES)) {
        localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(SAMPLE_TEMPLATES));
    }
};

export const getInvoices = (): Invoice[] => {
    const invoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return invoices ? JSON.parse(invoices) : [];
};

export const saveInvoices = (invoices: Invoice[]): void => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
};

export const getInvoiceTemplates = (): InvoiceTemplate[] => {
    const templates = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return templates ? JSON.parse(templates) : [];
};

export const saveInvoiceTemplates = (templates: InvoiceTemplate[]): void => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
};

// Utility Functions
export const searchInvoices = (invoices: Invoice[], query: string): Invoice[] => {
    if (!query.trim()) return invoices;
    
    const searchTerm = query.toLowerCase();
    return invoices.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm) ||
        invoice.customerDetails.name.toLowerCase().includes(searchTerm) ||
        invoice.customerDetails.company?.toLowerCase().includes(searchTerm) ||
        invoice.type.toLowerCase().includes(searchTerm) ||
        invoice.status.toLowerCase().includes(searchTerm)
    );
};

export const filterInvoices = (invoices: Invoice[], filter: InvoiceFilter): Invoice[] => {
    return invoices.filter(invoice => {
        if (filter.type && filter.type !== 'all' && invoice.type !== filter.type) {
            return false;
        }
        if (filter.status && filter.status !== 'all' && invoice.status !== filter.status) {
            return false;
        }
        if (filter.customerId && invoice.customerId !== filter.customerId) {
            return false;
        }
        if (filter.minAmount && invoice.total < filter.minAmount) {
            return false;
        }
        if (filter.maxAmount && invoice.total > filter.maxAmount) {
            return false;
        }
        if (filter.dateRange) {
            const invoiceDate = new Date(invoice.issueDate);
            if (invoiceDate < filter.dateRange.start || invoiceDate > filter.dateRange.end) {
                return false;
            }
        }
        return true;
    });
};

export const sortInvoices = (invoices: Invoice[], sort: InvoiceSort): Invoice[] => {
    return [...invoices].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sort.field) {
            case 'invoiceNumber':
                aValue = a.invoiceNumber;
                bValue = b.invoiceNumber;
                break;
            case 'issueDate':
                aValue = new Date(a.issueDate).getTime();
                bValue = new Date(b.issueDate).getTime();
                break;
            case 'dueDate':
                aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                break;
            case 'total':
                aValue = a.total;
                bValue = b.total;
                break;
            case 'status':
                aValue = a.status;
                bValue = b.status;
                break;
            case 'customerName':
                aValue = a.customerDetails.name;
                bValue = b.customerDetails.name;
                break;
            default:
                return 0;
        }

        if (sort.direction === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });
};

export const calculateInvoiceTotals = (items: InvoiceItem[], taxRate: number, discountAmount: number): {
    subtotal: number;
    taxAmount: number;
    total: number;
} => {
    const subtotal = items.reduce((sum, item) => {
        let itemTotal = item.quantity * item.unitPrice;
        if (item.discount > 0) {
            if (item.discountType === 'percentage') {
                itemTotal = itemTotal * (1 - item.discount / 100);
            } else {
                itemTotal = itemTotal - item.discount;
            }
        }
        return sum + itemTotal;
    }, 0);

    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = (subtotalAfterDiscount * taxRate) / 100;
    const total = subtotalAfterDiscount + taxAmount;

    return {
        subtotal: Math.round(subtotal * 100) / 100,
        taxAmount: Math.round(taxAmount * 100) / 100,
        total: Math.round(total * 100) / 100
    };
};

export const getStatusColor = (status: Invoice['status']): string => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'approved': return 'bg-blue-100 text-blue-800';
        case 'payment-received': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'overdue': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export const getTypeColor = (type: Invoice['type']): string => {
    switch (type) {
        case 'quotation': return 'bg-purple-100 text-purple-800';
        case 'proforma': return 'bg-indigo-100 text-indigo-800';
        case 'commercial': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

export const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const generateInvoiceNumber = (type: Invoice['type'], nextNumber: number): string => {
    const prefix = type === 'quotation' ? 'QUO' : type === 'proforma' ? 'PRO' : 'INV';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const number = String(nextNumber).padStart(3, '0');
    
    return `${prefix}-${year}-${month}-${number}`;
};

export const isOverdue = (invoice: Invoice): boolean => {
    if (!invoice.dueDate || invoice.status === 'payment-received' || invoice.status === 'cancelled') {
        return false;
    }
    return new Date(invoice.dueDate) < new Date();
};

export const calculateAnalytics = (invoices: Invoice[]): InvoiceAnalytics => {
    const totalInvoices = invoices.length;
    const totalRevenue = invoices
        .filter(inv => inv.status === 'payment-received')
        .reduce((sum, inv) => sum + inv.total, 0);
    
    const pendingAmount = invoices
        .filter(inv => inv.status === 'pending' || inv.status === 'approved')
        .reduce((sum, inv) => sum + inv.total, 0);
    
    const overdueInvoices = invoices.filter(inv => isOverdue(inv));
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);
    
    const averageInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
    const paidInvoices = invoices.filter(inv => inv.status === 'payment-received').length;
    const paymentRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0;

    // Group customers by total amount
    const customerTotals: Record<string, { name: string; total: number; count: number }> = {};
    invoices.forEach(invoice => {
        const key = invoice.customerId || invoice.customerDetails.name;
        if (!customerTotals[key]) {
            customerTotals[key] = {
                name: invoice.customerDetails.name,
                total: 0,
                count: 0
            };
        }
        customerTotals[key].total += invoice.total;
        customerTotals[key].count += 1;
    });

    const topCustomers = Object.entries(customerTotals)
        .map(([customerId, data]) => ({
            customerId,
            customerName: data.name,
            totalAmount: data.total,
            invoiceCount: data.count
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 5);

    // Monthly revenue (last 6 months)
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        
        const monthInvoices = invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.issueDate);
            return invoiceDate.getMonth() === date.getMonth() && 
                   invoiceDate.getFullYear() === date.getFullYear() &&
                   invoice.status === 'payment-received';
        });
        
        return {
            month: monthStr,
            revenue: monthInvoices.reduce((sum, inv) => sum + inv.total, 0),
            invoiceCount: monthInvoices.length
        };
    }).reverse();

    return {
        totalInvoices,
        totalRevenue,
        pendingAmount,
        overdueAmount,
        averageInvoiceValue,
        paymentRate,
        topCustomers,
        monthlyRevenue
    };
};
