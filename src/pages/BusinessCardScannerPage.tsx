import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BusinessCardScanner } from '@/components/business-card-scanner/BusinessCardScanner';
import type { BusinessCardData } from '@/types/business-card';

interface BusinessCardScannerPageProps {
    onBack?: () => void;
}

export const BusinessCardScannerPage: React.FC<BusinessCardScannerPageProps> = ({ onBack }) => {
    const handleSave = (cardData: BusinessCardData) => {
        console.log('Business card saved:', cardData);
        // Here you would typically save to your backend or state management
    };

    const handleClose = () => {
        onBack?.();
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border/40 bg-background/95 backdrop-blur">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            {onBack && (
                                <Button variant="ghost" size="icon" onClick={onBack}>
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            )}
                            <div>
                                <h1 className="text-xl font-semibold">Business Card Scanner</h1>
                                <p className="text-sm text-muted-foreground">Scan and digitize business cards with B2Breeze</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <BusinessCardScanner onSave={handleSave} onClose={handleClose} />
            </div>
        </div>
    );
};
