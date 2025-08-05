import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Plus,
    FileText,
    Eye,
    Edit,
    Trash2,
    Copy,
    Download,
    Share2,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ArrowLeft,
    Mail,
    MessageCircle,
    FileImage
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InvoicePreview } from '@/components/InvoicePreview';
import type { Invoice, InvoiceTemplate, InvoiceGeneratorState } from '@/types/invoice';
import {
    getInvoices,
    getInvoiceTemplates,
    initializeSampleInvoiceData,
    searchInvoices,
    filterInvoices,
    sortInvoices,
    getStatusColor,
    getTypeColor,
    formatCurrency,
    formatDate,
    isOverdue,
    calculateAnalytics
} from '@/lib/invoice-utils';
import { exportToPDF, exportToPNG, shareViaEmail, shareViaWhatsApp } from '@/lib/invoice-export-utils';

interface InvoiceGeneratorPageProps {
    onNavigate: (page: string) => void;
}

interface InvoiceCardProps {
    invoice: Invoice;
    onEdit: (invoice: Invoice) => void;
    onDelete: (invoiceId: string) => void;
    onDuplicate: (invoice: Invoice) => void;
    onPreview: (invoice: Invoice) => void;
    onExport: (invoice: Invoice, format: 'pdf' | 'png') => void;
    onShare: (invoice: Invoice, method: 'email' | 'whatsapp') => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
    invoice,
    onEdit,
    onDelete,
    onDuplicate,
    onPreview,
    onExport,
    onShare
}) => {
    const overdue = isOverdue(invoice);

    const getStatusIcon = (status: Invoice['status']) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'approved': return <CheckCircle2 className="w-4 h-4" />;
            case 'payment-received': return <CheckCircle2 className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            case 'overdue': return <AlertTriangle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getTypeIcon = (type: Invoice['type']) => {
        switch (type) {
            case 'quotation': return <FileText className="w-4 h-4" />;
            case 'proforma': return <FileText className="w-4 h-4" />;
            case 'commercial': return <FileText className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <Card className={`hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50 ${overdue ? 'border-l-4 border-l-red-500' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(invoice.type)}
                            <CardTitle className="text-lg font-semibold">{invoice.invoiceNumber}</CardTitle>
                            {overdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </div>
                        <div className="space-y-1 mb-3">
                            <p className="text-sm font-medium text-foreground">
                                {invoice.customerDetails.company || invoice.customerDetails.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Issued: {formatDate(invoice.issueDate)}
                                {invoice.dueDate && ` • Due: ${formatDate(invoice.dueDate)}`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getStatusColor(overdue ? 'overdue' : invoice.status)}>
                                {getStatusIcon(overdue ? 'overdue' : invoice.status)}
                                <span className="ml-1 capitalize">{overdue ? 'Overdue' : invoice.status.replace('-', ' ')}</span>
                            </Badge>
                            <Badge className={getTypeColor(invoice.type)}>
                                <span className="capitalize">{invoice.type}</span>
                            </Badge>
                            <Badge variant="outline" className="text-green-700 bg-green-50">
                                <DollarSign className="w-3 h-3 mr-1" />
                                {formatCurrency(invoice.total)}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Invoice Details */}
                    <div className="bg-muted/30 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-muted-foreground">Items:</span>
                                <span className="ml-2 font-medium">{invoice.items.length}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Currency:</span>
                                <span className="ml-2 font-medium">{invoice.currency}</span>
                            </div>
                            {invoice.versions.length > 0 && (
                                <div className="col-span-2">
                                    <span className="text-muted-foreground">Version:</span>
                                    <span className="ml-2 font-medium">{invoice.currentVersion}</span>
                                    <span className="text-xs text-muted-foreground ml-1">
                                        ({invoice.versions.length} revision{invoice.versions.length !== 1 ? 's' : ''})
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPreview(invoice)}
                            className="flex-1"
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(invoice)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <div className="relative group">
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                            </Button>
                            <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                <div className="p-1 min-w-[120px]">
                                    <button
                                        onClick={() => onExport(invoice, 'pdf')}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center gap-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Export PDF
                                    </button>
                                    <button
                                        onClick={() => onExport(invoice, 'png')}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center gap-2"
                                    >
                                        <FileImage className="w-4 h-4" />
                                        Export PNG
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <Button variant="outline" size="sm">
                                <Share2 className="w-4 h-4" />
                            </Button>
                            <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                <div className="p-1 min-w-[140px]">
                                    <button
                                        onClick={() => onShare(invoice, 'email')}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center gap-2"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Send Email
                                    </button>
                                    <button
                                        onClick={() => onShare(invoice, 'whatsapp')}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center gap-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDuplicate(invoice)}
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(invoice.id)}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

interface TemplateCardProps {
    template: InvoiceTemplate;
    onEdit: (template: InvoiceTemplate) => void;
    onDelete: (templateId: string) => void;
    onUse: (template: InvoiceTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onEdit, onDelete, onUse }) => {
    const getTypeIcon = (type: InvoiceTemplate['type']) => {
        switch (type) {
            case 'quotation': return <FileText className="w-4 h-4" />;
            case 'proforma': return <FileText className="w-4 h-4" />;
            case 'commercial': return <FileText className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(template.type)}
                            <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                            {template.isDefault && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                    Default
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <Badge className={getTypeColor(template.type)}>
                                <span className="capitalize">{template.type}</span>
                            </Badge>
                            <Badge variant="outline">
                                {template.defaultItems.length} item{template.defaultItems.length !== 1 ? 's' : ''}
                            </Badge>
                            <Badge variant="outline" className="text-green-700 bg-green-50">
                                {template.currency}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {template.defaultTerms}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Template Details */}
                    <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-sm">
                            <div className="mb-2">
                                <span className="text-muted-foreground">Tax Rate:</span>
                                <span className="ml-2 font-medium">{template.taxRate}%</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Created:</span>
                                <span className="ml-2 font-medium">{formatDate(template.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => onUse(template)}
                            className="flex-1"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Use Template
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(template)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(template.id)}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const InvoiceGeneratorPage: React.FC<InvoiceGeneratorPageProps> = ({ onNavigate }) => {
    const [state, setState] = useState<InvoiceGeneratorState>({
        invoices: [],
        templates: [],
        view: 'invoices',
        searchQuery: '',
        filter: { type: 'all', status: 'all' },
        sort: { field: 'issueDate', direction: 'desc' },
        isLoading: false
    });

    // Initialize sample data on component mount
    useEffect(() => {
        initializeSampleInvoiceData();
        setState(prev => ({
            ...prev,
            invoices: getInvoices(),
            templates: getInvoiceTemplates()
        }));
    }, []);

    // Filtered, searched, and sorted data
    const processedInvoices = useMemo(() => {
        let processed = filterInvoices(state.invoices, state.filter);
        processed = searchInvoices(processed, state.searchQuery);
        return sortInvoices(processed, state.sort);
    }, [state.invoices, state.searchQuery, state.filter, state.sort]);

    const filteredTemplates = useMemo(() => {
        return state.templates.filter(template =>
            template.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            template.type.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
    }, [state.templates, state.searchQuery]);

    // Analytics
    const analytics = useMemo(() => {
        return calculateAnalytics(state.invoices);
    }, [state.invoices]);

    const handleInvoiceEdit = (invoice: Invoice) => {
        setState(prev => ({ ...prev, selectedInvoice: invoice, view: 'edit' }));
        alert(`Edit invoice: ${invoice.invoiceNumber}\n(Feature coming soon!)`);
    };

    const handleInvoiceDelete = (invoiceId: string) => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            setState(prev => ({
                ...prev,
                invoices: prev.invoices.filter(inv => inv.id !== invoiceId)
            }));
        }
    };

    const handleInvoiceDuplicate = (invoice: Invoice) => {
        const newInvoice: Invoice = {
            ...invoice,
            id: `invoice-${Date.now()}`,
            invoiceNumber: `${invoice.invoiceNumber}-COPY`,
            status: 'pending',
            issueDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            versions: [],
            currentVersion: 1
        };
        setState(prev => ({
            ...prev,
            invoices: [...prev.invoices, newInvoice]
        }));
    };

    const handleInvoicePreview = (invoice: Invoice) => {
        setState(prev => ({ ...prev, selectedInvoice: invoice, view: 'preview' }));
    };

    const handleInvoiceExport = async (invoice: Invoice, format: 'pdf' | 'png') => {
        try {
            if (format === 'pdf') {
                await exportToPDF(invoice);
            } else {
                await exportToPNG(invoice);
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert(`Failed to export ${invoice.invoiceNumber} as ${format.toUpperCase()}. Please try again.`);
        }
    };

    const handleInvoiceShare = (invoice: Invoice, method: 'email' | 'whatsapp') => {
        try {
            if (method === 'email') {
                shareViaEmail(invoice);
            } else {
                shareViaWhatsApp(invoice);
            }
        } catch (error) {
            console.error('Share failed:', error);
            alert(`Failed to share ${invoice.invoiceNumber} via ${method}. Please try again.`);
        }
    }; const handleTemplateEdit = (template: InvoiceTemplate) => {
        setState(prev => ({ ...prev, selectedTemplate: template, view: 'edit' }));
        alert(`Edit template: ${template.name}\n(Feature coming soon!)`);
    };

    const handleTemplateDelete = (templateId: string) => {
        if (confirm('Are you sure you want to delete this template?')) {
            setState(prev => ({
                ...prev,
                templates: prev.templates.filter(t => t.id !== templateId)
            }));
        }
    };

    const handleTemplateUse = (template: InvoiceTemplate) => {
        setState(prev => ({ ...prev, selectedTemplate: template, view: 'create' }));
        alert(`Create invoice with template: ${template.name}\n(Feature coming soon!)`);
    };

    const renderTabNavigation = () => (
        <div className="flex items-center gap-2 mb-6">
            <Button
                variant={state.view === 'invoices' ? 'default' : 'outline'}
                onClick={() => setState(prev => ({ ...prev, view: 'invoices' }))}
                className="flex items-center gap-2"
            >
                <FileText className="w-4 h-4" />
                Invoices ({state.invoices.length})
            </Button>
            <Button
                variant={state.view === 'templates' ? 'default' : 'outline'}
                onClick={() => setState(prev => ({ ...prev, view: 'templates' }))}
                className="flex items-center gap-2"
            >
                <Copy className="w-4 h-4" />
                Templates ({state.templates.length})
            </Button>
            <Button
                variant={state.view === 'create' ? 'default' : 'outline'}
                onClick={() => setState(prev => ({ ...prev, view: 'create' }))}
                className="flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Create New
            </Button>
        </div>
    );

    const renderStatsCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalInvoices}</div>
                    <p className="text-xs text-muted-foreground">
                        {state.invoices.filter(inv => inv.status === 'pending').length} pending
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">
                        Avg: {formatCurrency(analytics.averageInvoiceValue)}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(analytics.pendingAmount)}</div>
                    <p className="text-xs text-muted-foreground">
                        Overdue: {formatCurrency(analytics.overdueAmount)}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analytics.paymentRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                        Collection efficiency
                    </p>
                </CardContent>
            </Card>
        </div>
    );

    const renderSearchAndFilters = () => (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder={`Search ${state.view}...`}
                    value={state.searchQuery}
                    onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="pl-10"
                />
            </div>
            {state.view === 'invoices' && (
                <>
                    <select
                        value={state.filter.type || 'all'}
                        onChange={(e) => setState(prev => ({
                            ...prev,
                            filter: { ...prev.filter, type: e.target.value as any }
                        }))}
                        className="px-3 py-2 border border-border rounded-md bg-background"
                    >
                        <option value="all">All Types</option>
                        <option value="quotation">Quotations</option>
                        <option value="proforma">Proforma</option>
                        <option value="commercial">Commercial</option>
                    </select>
                    <select
                        value={state.filter.status || 'all'}
                        onChange={(e) => setState(prev => ({
                            ...prev,
                            filter: { ...prev.filter, status: e.target.value as any }
                        }))}
                        className="px-3 py-2 border border-border rounded-md bg-background"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="payment-received">Paid</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </>
            )}
            <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create New
            </Button>
        </div>
    );

    const renderInvoices = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {processedInvoices.map((invoice) => (
                <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    onEdit={handleInvoiceEdit}
                    onDelete={handleInvoiceDelete}
                    onDuplicate={handleInvoiceDuplicate}
                    onPreview={handleInvoicePreview}
                    onExport={handleInvoiceExport}
                    onShare={handleInvoiceShare}
                />
            ))}
            {processedInvoices.length === 0 && (
                <div className="col-span-full text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
                    <p className="text-muted-foreground mb-4">
                        {state.searchQuery ? 'Try adjusting your search criteria.' : 'Create your first invoice to get started.'}
                    </p>
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Invoice
                    </Button>
                </div>
            )}
        </div>
    );

    const renderTemplates = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
                <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleTemplateEdit}
                    onDelete={handleTemplateDelete}
                    onUse={handleTemplateUse}
                />
            ))}
            {filteredTemplates.length === 0 && (
                <div className="col-span-full text-center py-12">
                    <Copy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                    <p className="text-muted-foreground mb-4">
                        {state.searchQuery ? 'Try adjusting your search criteria.' : 'Create your first template to get started.'}
                    </p>
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Template
                    </Button>
                </div>
            )}
        </div>
    );

    const renderCreateForm = () => (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Create New Invoice</CardTitle>
                    <p className="text-muted-foreground">
                        Choose a template or start from scratch to create a new invoice.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Invoice Creator</h3>
                        <p className="text-muted-foreground mb-6">
                            Full invoice creation interface coming soon!
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" onClick={() => setState(prev => ({ ...prev, view: 'templates' }))}>
                                Choose Template
                            </Button>
                            <Button>
                                Start from Scratch
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <>
            {/* Invoice Preview View */}
            {state.view === 'preview' && state.selectedInvoice && (
                <InvoicePreview
                    invoice={state.selectedInvoice}
                    onBack={() => setState(prev => ({ ...prev, view: 'invoices', selectedInvoice: undefined }))}
                    onEdit={handleInvoiceEdit}
                    onExport={handleInvoiceExport}
                    onShare={handleInvoiceShare}
                />
            )}

            {/* Main Invoice Generator View */}
            {state.view !== 'preview' && (
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Button
                            variant="outline"
                            onClick={() => onNavigate('home')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-foreground">Invoice Generator</h1>
                            <p className="text-muted-foreground">
                                Create and manage professional quotations, proforma and commercial invoices with B2BBreeze
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {state.view === 'invoices' && renderStatsCards()}

                    {/* Tab Navigation */}
                    {renderTabNavigation()}

                    {/* Search and Filters */}
                    {(state.view === 'invoices' || state.view === 'templates') && renderSearchAndFilters()}

                    {/* Content */}
                    {state.view === 'invoices' && renderInvoices()}
                    {state.view === 'templates' && renderTemplates()}
                    {state.view === 'create' && renderCreateForm()}
                </div>
            )}
        </>
    );
};
