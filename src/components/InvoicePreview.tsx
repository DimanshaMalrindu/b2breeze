import React from 'react';
import '../styles/invoice-print.css';
import {
    ArrowLeft,
    Download,
    Share2,
    Mail,
    MessageCircle,
    FileText,
    FileImage,
    Printer,
    Edit,
    Building,
    MapPin,
    Phone,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate, getStatusColor, getTypeColor } from '@/lib/invoice-utils';

interface InvoicePreviewProps {
    invoice: Invoice;
    onBack: () => void;
    onEdit: (invoice: Invoice) => void;
    onExport: (invoice: Invoice, format: 'pdf' | 'png') => void;
    onShare: (invoice: Invoice, method: 'email' | 'whatsapp') => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
    invoice,
    onBack,
    onEdit,
    onExport,
    onShare
}) => {
    const handlePrint = () => {
        window.print();
    };

    const getInvoiceTitle = (type: Invoice['type']) => {
        switch (type) {
            case 'quotation': return 'QUOTATION';
            case 'proforma': return 'PROFORMA INVOICE';
            case 'commercial': return 'COMMERCIAL INVOICE';
            default: return 'INVOICE';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header Actions */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border no-print">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={onBack}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-xl font-semibold">{invoice.invoiceNumber}</h1>
                                <p className="text-sm text-muted-foreground">
                                    {getInvoiceTitle(invoice.type)} Preview
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(invoice)}
                                className="flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </Button>

                            <div className="relative group">
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Export
                                </Button>
                                <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                    <div className="p-1 min-w-[140px]">
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
                                        <button
                                            onClick={handlePrint}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center gap-2"
                                        >
                                            <Printer className="w-4 h-4" />
                                            Print
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <Share2 className="w-4 h-4" />
                                    Share
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice Preview Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto invoice-print-content">
                    {/* Invoice Status Banner */}
                    <div className="mb-6 no-print">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-4">
                                <Badge className={`${getStatusColor(invoice.status)} text-sm px-3 py-1`}>
                                    <span className="capitalize">{invoice.status.replace('-', ' ')}</span>
                                </Badge>
                                <Badge className={`${getTypeColor(invoice.type)} text-sm px-3 py-1`}>
                                    <span className="capitalize">{invoice.type}</span>
                                </Badge>
                                {invoice.versions.length > 0 && (
                                    <Badge variant="outline" className="text-sm px-3 py-1">
                                        Version {invoice.currentVersion}
                                    </Badge>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(invoice.total)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {invoice.currency}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Invoice */}
                    <Card className="print:shadow-none print:border-none">
                        <CardContent className="p-8">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        {invoice.companyDetails.logo && (
                                            <div className="mb-4">
                                                <div className="w-32 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground">
                                                    <Building className="w-8 h-8" />
                                                </div>
                                            </div>
                                        )}
                                        <h1 className="text-3xl font-bold text-primary mb-2">
                                            {invoice.companyDetails.name}
                                        </h1>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>
                                                    {invoice.companyDetails.address}, {invoice.companyDetails.city}, {invoice.companyDetails.state} {invoice.companyDetails.postalCode}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <span>{invoice.companyDetails.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                <span>{invoice.companyDetails.email}</span>
                                            </div>
                                            {invoice.companyDetails.website && (
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4" />
                                                    <span>{invoice.companyDetails.website}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <h2 className="text-2xl font-bold mb-4">
                                            {getInvoiceTitle(invoice.type)}
                                        </h2>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="font-medium">Invoice #:</span>
                                                <span className="ml-2">{invoice.invoiceNumber}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Issue Date:</span>
                                                <span className="ml-2">{formatDate(invoice.issueDate)}</span>
                                            </div>
                                            {invoice.dueDate && (
                                                <div>
                                                    <span className="font-medium">Due Date:</span>
                                                    <span className="ml-2">{formatDate(invoice.dueDate)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bill To Section */}
                            <div className="mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 text-primary">Bill To:</h3>
                                        <div className="space-y-1 text-sm">
                                            <div className="font-medium text-foreground">
                                                {invoice.customerDetails.name}
                                            </div>
                                            {invoice.customerDetails.company && (
                                                <div className="font-medium text-foreground">
                                                    {invoice.customerDetails.company}
                                                </div>
                                            )}
                                            {invoice.customerDetails.address && (
                                                <div className="text-muted-foreground">
                                                    {invoice.customerDetails.address}
                                                    {invoice.customerDetails.city && `, ${invoice.customerDetails.city}`}
                                                    {invoice.customerDetails.state && `, ${invoice.customerDetails.state}`}
                                                    {invoice.customerDetails.postalCode && ` ${invoice.customerDetails.postalCode}`}
                                                </div>
                                            )}
                                            {invoice.customerDetails.phone && (
                                                <div className="text-muted-foreground">
                                                    Phone: {invoice.customerDetails.phone}
                                                </div>
                                            )}
                                            {invoice.customerDetails.email && (
                                                <div className="text-muted-foreground">
                                                    Email: {invoice.customerDetails.email}
                                                </div>
                                            )}
                                            {invoice.customerDetails.taxId && (
                                                <div className="text-muted-foreground">
                                                    Tax ID: {invoice.customerDetails.taxId}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {invoice.companyDetails.bankDetails && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3 text-primary">Payment Details:</h3>
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                <div>
                                                    <span className="font-medium">Bank:</span>
                                                    <span className="ml-2">{invoice.companyDetails.bankDetails.bankName}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Account:</span>
                                                    <span className="ml-2">{invoice.companyDetails.bankDetails.accountName}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Account #:</span>
                                                    <span className="ml-2">{invoice.companyDetails.bankDetails.accountNumber}</span>
                                                </div>
                                                {invoice.companyDetails.bankDetails.routingNumber && (
                                                    <div>
                                                        <span className="font-medium">Routing #:</span>
                                                        <span className="ml-2">{invoice.companyDetails.bankDetails.routingNumber}</span>
                                                    </div>
                                                )}
                                                {invoice.companyDetails.bankDetails.swiftCode && (
                                                    <div>
                                                        <span className="font-medium">SWIFT:</span>
                                                        <span className="ml-2">{invoice.companyDetails.bankDetails.swiftCode}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="mb-8">
                                <div className="border border-border rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="text-left p-4 font-semibold">Description</th>
                                                <th className="text-center p-4 font-semibold w-20">Qty</th>
                                                <th className="text-right p-4 font-semibold w-24">Unit Price</th>
                                                <th className="text-right p-4 font-semibold w-20">Discount</th>
                                                <th className="text-right p-4 font-semibold w-24">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoice.items.map((item, index) => (
                                                <tr key={item.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                                                    <td className="p-4">
                                                        <div className="font-medium">{item.description}</div>
                                                        {item.category && (
                                                            <div className="text-sm text-muted-foreground mt-1">
                                                                Category: {item.category}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-center">{item.quantity}</td>
                                                    <td className="p-4 text-right">{formatCurrency(item.unitPrice)}</td>
                                                    <td className="p-4 text-right">
                                                        {item.discount > 0 ? (
                                                            <span className="text-red-600">
                                                                -{item.discountType === 'percentage' ? `${item.discount}%` : formatCurrency(item.discount)}
                                                            </span>
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right font-medium">{formatCurrency(item.total)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Totals Section */}
                            <div className="mb-8">
                                <div className="flex justify-end">
                                    <div className="w-full max-w-md space-y-2">
                                        <div className="flex justify-between py-2">
                                            <span className="text-muted-foreground">Subtotal:</span>
                                            <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                                        </div>

                                        {invoice.discountAmount > 0 && (
                                            <div className="flex justify-between py-2">
                                                <span className="text-muted-foreground">
                                                    Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'}):
                                                </span>
                                                <span className="font-medium text-red-600">
                                                    -{formatCurrency(invoice.discountAmount)}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between py-2">
                                            <span className="text-muted-foreground">Tax ({invoice.taxRate}%):</span>
                                            <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                                        </div>

                                        <div className="border-t border-border pt-2">
                                            <div className="flex justify-between py-2">
                                                <span className="text-lg font-semibold">Total:</span>
                                                <span className="text-lg font-bold text-primary">
                                                    {formatCurrency(invoice.total)} {invoice.currency}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes and Terms */}
                            {(invoice.notes || invoice.termsAndConditions || invoice.paymentTerms) && (
                                <div className="space-y-6">
                                    {invoice.notes && (
                                        <div>
                                            <h4 className="font-semibold mb-2 text-primary">Notes:</h4>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                {invoice.notes}
                                            </p>
                                        </div>
                                    )}

                                    {invoice.paymentTerms && (
                                        <div>
                                            <h4 className="font-semibold mb-2 text-primary">Payment Terms:</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {invoice.paymentTerms}
                                            </p>
                                        </div>
                                    )}

                                    {invoice.termsAndConditions && (
                                        <div>
                                            <h4 className="font-semibold mb-2 text-primary">Terms & Conditions:</h4>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                {invoice.termsAndConditions}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
                                <p>Thank you for your business!</p>
                                {invoice.companyDetails.taxId && (
                                    <p className="mt-1">Tax ID: {invoice.companyDetails.taxId}</p>
                                )}
                                {invoice.companyDetails.registrationNumber && (
                                    <p>Registration #: {invoice.companyDetails.registrationNumber}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
