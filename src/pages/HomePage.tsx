import React from 'react'
import {
    Wallet,
    Users,
    Calendar,
    Megaphone,
    FileText,
    BarChart3,
    Scan,
    Mic
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    comingSoon?: boolean;
    onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, comingSoon, onClick }) => (
    <Card
        className="relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 hover:border-primary/50"
        onClick={onClick}
    >
        <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {icon}
                </div>
                <div className="flex-1">
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                    {comingSoon && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mt-1 inline-block">
                            Coming Soon
                        </span>
                    )}
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-sm leading-relaxed">
                {description}
            </CardDescription>
        </CardContent>
    </Card>
)

interface HomePageProps {
    onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    const features = [
        {
            icon: <Scan className="w-6 h-6" />,
            title: "Business Card Scanner",
            description: "Instantly digitize business cards with OCR technology. Capture contact information and store it securely in your digital wallet.",
            onClick: () => onNavigate('business-card-scanner')
        },
        {
            icon: <Wallet className="w-6 h-6" />,
            title: "Business Card Wallet",
            description: "Organize and manage all your business contacts in one place. Search, categorize, and access cards instantly.",
            onClick: () => onNavigate('business-card-wallet')
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Customer Directory",
            description: "Maintain a comprehensive database of your customers with detailed profiles, interaction history, and preferences.",
            onClick: () => onNavigate('customer-directory')
        },
        {
            icon: <Calendar className="w-6 h-6" />,
            title: "Task Planner",
            description: "Organize your business activities with smart task management. Set priorities, deadlines, and track progress effortlessly.",
            onClick: () => onNavigate('task-planner')
        },
        {
            icon: <Megaphone className="w-6 h-6" />,
            title: "Campaign Planner",
            description: "Design and execute marketing campaigns with ease. Track performance and optimize your outreach strategies.",
            onClick: () => onNavigate('campaign-planner')
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: "Invoice Generator",
            description: "Create professional invoices in minutes. Customize templates, track payments, and manage your billing efficiently.",
            onClick: () => onNavigate('invoice-generator')
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Analytics Dashboard",
            description: "Get insights into your business performance with comprehensive analytics and beautiful visualizations.",
            onClick: () => onNavigate('analytics-dashboard')
        },
        {
            icon: <Mic className="w-6 h-6" />,
            title: "Conversation Recorder",
            description: "Record and transcribe client conversations in real-time. Generate summaries and track follow-up actions.",
            onClick: () => onNavigate('conversation-recorder')
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 rounded-lg mb-12">
                <div className="px-8 py-20 lg:py-28">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            Streamline Your{" "}
                            <span className="text-primary">Business Operations</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                            Welcome to B2BBreeze - business, as smooth as a breeze.
                            All-in-one professional platform for modern business management.
                            From business card scanning to analytics, everything you need to grow your business efficiently.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="text-lg px-8 py-3" onClick={() => onNavigate('business-card-scanner')}>
                                Try Scanner Now
                            </Button>
                            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                                Watch Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        Powerful Features for Modern Business
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Everything you need to manage your business professionally. Start with our core features and expand as you grow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            onClick={feature.onClick}
                        />
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg">
                <div className="max-w-4xl mx-auto text-center px-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join thousands of professionals who trust B2BBreeze for their daily operations.
                        Experience business, as smooth as a breeze.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="text-lg px-8 py-3" onClick={() => onNavigate('business-card-scanner')}>
                            Get Started Free
                        </Button>
                        <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                            Schedule Demo
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
