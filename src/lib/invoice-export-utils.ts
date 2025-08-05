// Invoice Export Utilities
export const exportToPDF = async (invoice: any): Promise<void> => {
    // This is a placeholder for PDF export functionality
    // In a real application, you would use libraries like:
    // - jsPDF with html2canvas
    // - Puppeteer for server-side PDF generation
    // - Browser's built-in print to PDF functionality
    
    console.log('Exporting invoice to PDF:', invoice.invoiceNumber);
    
    // For now, we'll trigger the browser's print dialog
    window.print();
};

export const exportToPNG = async (invoice: any): Promise<void> => {
    // This is a placeholder for PNG export functionality
    // In a real application, you would use html2canvas
    
    console.log('Exporting invoice to PNG:', invoice.invoiceNumber);
    
    try {
        // Find the invoice content element
        const element = document.querySelector('.invoice-print-content');
        if (!element) {
            throw new Error('Invoice content not found');
        }

        // For now, we'll show an alert
        alert(`PNG export functionality will use html2canvas library to capture the invoice content.\n\nInvoice: ${invoice.invoiceNumber}`);
        
        // TODO: Implement html2canvas integration
        // const canvas = await html2canvas(element);
        // const link = document.createElement('a');
        // link.download = `${invoice.invoiceNumber}.png`;
        // link.href = canvas.toDataURL();
        // link.click();
        
    } catch (error) {
        console.error('Failed to export PNG:', error);
        alert('Failed to export PNG. Please try again.');
    }
};

export const shareViaEmail = (invoice: any): void => {
    const subject = `Invoice ${invoice.invoiceNumber} - ${invoice.companyDetails.name}`;
    const body = `Dear ${invoice.customerDetails.name},

Please find attached invoice ${invoice.invoiceNumber} for ${invoice.total} ${invoice.currency}.

Invoice Details:
- Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}
- Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
- Amount: ${invoice.total} ${invoice.currency}

Best regards,
${invoice.companyDetails.name}`;

    const emailUrl = `mailto:${invoice.customerDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
};

export const shareViaWhatsApp = (invoice: any): void => {
    const message = `Hello ${invoice.customerDetails.name},

I hope this message finds you well. Please find the details for invoice ${invoice.invoiceNumber}:

📄 Invoice: ${invoice.invoiceNumber}
💰 Amount: ${invoice.total} ${invoice.currency}
📅 Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}
${invoice.dueDate ? `📅 Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}` : ''}

${invoice.notes ? `\nNotes: ${invoice.notes}` : ''}

Thank you for your business!

Best regards,
${invoice.companyDetails.name}
${invoice.companyDetails.phone}`;

    const whatsappUrl = `https://wa.me/${invoice.customerDetails.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};
