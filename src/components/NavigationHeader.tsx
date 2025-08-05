import React from 'react';
import {
    Home,
    Scan,
    Wallet,
    Users,
    Calendar,
    Megaphone,
    FileText,
    BarChart3,
    Menu,
    X,
    Mic,
    LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NavigationHeaderProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    onLogout?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({ currentPage, onNavigate, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const navigationItems = [
        {
            id: 'home',
            label: 'Home',
            icon: <Home className="w-4 h-4" />,
            description: 'Dashboard'
        },
        {
            id: 'business-card-scanner',
            label: 'Scanner',
            icon: <Scan className="w-4 h-4" />,
            description: 'Scan Cards'
        },
        {
            id: 'business-card-wallet',
            label: 'Wallet',
            icon: <Wallet className="w-4 h-4" />,
            description: 'Card Collection'
        },
        {
            id: 'customer-directory',
            label: 'Directory',
            icon: <Users className="w-4 h-4" />,
            description: 'Customer Management'
        },
        {
            id: 'task-planner',
            label: 'Tasks',
            icon: <Calendar className="w-4 h-4" />,
            description: 'Task Planning'
        },
        {
            id: 'campaign-planner',
            label: 'Campaigns',
            icon: <Megaphone className="w-4 h-4" />,
            description: 'Marketing Campaigns'
        },
        {
            id: 'invoice-generator',
            label: 'Invoices',
            icon: <FileText className="w-4 h-4" />,
            description: 'Generate Invoices'
        },
        {
            id: 'analytics-dashboard',
            label: 'Analytics',
            icon: <BarChart3 className="w-4 h-4" />,
            description: 'Business Insights'
        },
        {
            id: 'conversation-recorder',
            label: 'Recorder',
            icon: <Mic className="w-4 h-4" />,
            description: 'Record Conversations'
        }
    ];

    const handleNavigation = (itemId: string) => {
        onNavigate(itemId);
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Main Navigation Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo/Brand */}
                        <div
                            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleNavigation('home')}
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">B2B</span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold">B2BBreeze</h1>
                                <p className="text-xs text-muted-foreground -mt-1">Business, as smooth as a breeze</p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navigationItems.slice(0, 6).map((item) => (
                                <Button
                                    key={item.id}
                                    variant={currentPage === item.id ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleNavigation(item.id)}
                                    className="flex items-center gap-2 relative"
                                >
                                    {item.icon}
                                    <span className="hidden xl:inline">{item.label}</span>
                                </Button>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>

                        {/* Desktop More Options */}
                        <div className="hidden lg:flex items-center gap-2">
                            {navigationItems.slice(6).map((item) => (
                                <Button
                                    key={item.id}
                                    variant={currentPage === item.id ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleNavigation(item.id)}
                                    className="flex items-center gap-1 relative"
                                >
                                    {item.icon}
                                </Button>
                            ))}
                            {onLogout && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onLogout}
                                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <Card className="m-4">
                        <div className="p-4">
                            <h3 className="font-semibold mb-4">Navigation</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {navigationItems.map((item) => (
                                    <Button
                                        key={item.id}
                                        variant={currentPage === item.id ? 'default' : 'outline'}
                                        onClick={() => handleNavigation(item.id)}
                                        className="flex flex-col items-center gap-2 h-auto py-4 relative"
                                    >
                                        {item.icon}
                                        <div className="text-center">
                                            <div className="text-sm font-medium">{item.label}</div>
                                            <div className="text-xs text-muted-foreground">{item.description}</div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                            {onLogout && (
                                <div className="mt-4 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            onLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};
