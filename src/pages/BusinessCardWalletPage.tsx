import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BusinessCardWallet } from '@/components/business-card-wallet/BusinessCardWallet';

interface BusinessCardWalletPageProps {
    onNavigate: (page: string) => void;
}

export const BusinessCardWalletPage: React.FC<BusinessCardWalletPageProps> = ({ onNavigate }) => {
    const handleAddNew = () => {
        onNavigate('scanner');
    };

    const handleBackToHome = () => {
        onNavigate('home');
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={handleBackToHome}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </div>

                <BusinessCardWallet
                    onAddNew={handleAddNew}
                />
            </div>
        </div>
    );
};
