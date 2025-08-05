import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Plus,
    Mail,
    MessageCircle,
    Send,
    QrCode,
    BarChart3,
    Eye,
    Users,
    Play,
    Pause,
    Edit,
    Trash2,
    Copy,
    ExternalLink,
    ArrowLeft,
    CheckCircle2,
    Clock,
    TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Campaign, CampaignTemplate, QRCodeForm, CampaignPlannerState } from '@/types/campaign';
import {
    getCampaigns,
    getTemplates,
    getQRForms,
    initializeSampleCampaignData,
    searchCampaigns,
    filterCampaigns,
    getStatusColor,
    getTypeColor,
    formatAnalytics,
    calculateTotalAnalytics,
    generateQRCodeUrl
} from '@/lib/campaign-utils';

interface CampaignPlannerPageProps {
    onNavigate: (page: string) => void;
}

interface CampaignCardProps {
    campaign: Campaign;
    onEdit: (campaign: Campaign) => void;
    onDelete: (campaignId: string) => void;
    onDuplicate: (campaign: Campaign) => void;
    onToggleStatus: (campaignId: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
    campaign,
    onEdit,
    onDelete,
    onDuplicate,
    onToggleStatus
}) => {
    const getStatusIcon = (status: Campaign['status']) => {
        switch (status) {
            case 'draft': return <Edit className="w-4 h-4" />;
            case 'active': return <Play className="w-4 h-4" />;
            case 'paused': return <Pause className="w-4 h-4" />;
            case 'completed': return <CheckCircle2 className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getTypeIcon = (type: Campaign['type']) => {
        switch (type) {
            case 'email': return <Mail className="w-4 h-4" />;
            case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
            case 'telegram': return <Send className="w-4 h-4" />;
            case 'viber': return <MessageCircle className="w-4 h-4" />;
            default: return <Mail className="w-4 h-4" />;
        }
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                                {getTypeIcon(campaign.type)}
                                <CardTitle className="text-lg font-semibold">{campaign.name}</CardTitle>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getStatusColor(campaign.status)}>
                                {getStatusIcon(campaign.status)}
                                <span className="ml-1 capitalize">{campaign.status}</span>
                            </Badge>
                            <Badge className={getTypeColor(campaign.type)}>
                                <span className="capitalize">{campaign.type}</span>
                            </Badge>
                            <Badge variant="outline">
                                <Users className="w-3 h-3 mr-1" />
                                {campaign.recipientIds.length} recipients
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Analytics Summary */}
                    <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Performance:</span>
                            <span className="font-medium">{formatAnalytics(campaign.analytics)}</span>
                        </div>
                        {campaign.analytics.sent > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                                <div className="text-center">
                                    <div className="font-medium">{campaign.analytics.sent}</div>
                                    <div className="text-muted-foreground">Sent</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-medium">{campaign.analytics.opened}</div>
                                    <div className="text-muted-foreground">Opened</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-medium">{campaign.analytics.responded}</div>
                                    <div className="text-muted-foreground">Responded</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(campaign)}
                            className="flex-1"
                        >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDuplicate(campaign)}
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onToggleStatus(campaign.id)}
                            disabled={campaign.status === 'completed'}
                        >
                            {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(campaign.id)}
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
    template: CampaignTemplate;
    onEdit: (template: CampaignTemplate) => void;
    onDelete: (templateId: string) => void;
    onUse: (template: CampaignTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onEdit, onDelete, onUse }) => {
    const getTypeIcon = (type: CampaignTemplate['type']) => {
        switch (type) {
            case 'email': return <Mail className="w-4 h-4" />;
            case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
            case 'telegram': return <Send className="w-4 h-4" />;
            case 'viber': return <MessageCircle className="w-4 h-4" />;
            default: return <Mail className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category: CampaignTemplate['category']) => {
        switch (category) {
            case 'follow-up': return 'bg-blue-100 text-blue-800';
            case 'introduction': return 'bg-green-100 text-green-800';
            case 'promotional': return 'bg-purple-100 text-purple-800';
            case 'event': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
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
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <Badge className={getTypeColor(template.type)}>
                                <span className="capitalize">{template.type}</span>
                            </Badge>
                            <Badge className={getCategoryColor(template.category)}>
                                <span className="capitalize">{template.category}</span>
                            </Badge>
                        </div>
                        {template.subject && (
                            <p className="text-sm font-medium text-foreground mb-2">
                                Subject: {template.subject}
                            </p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {template.content.substring(0, 120)}...
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Variables */}
                    {template.variables.length > 0 && (
                        <div className="bg-muted/30 rounded-lg p-3">
                            <div className="text-sm font-medium text-foreground mb-2">Variables:</div>
                            <div className="flex flex-wrap gap-1">
                                {template.variables.map((variable) => (
                                    <Badge key={variable} variant="outline" className="text-xs">
                                        {'{' + variable + '}'}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => onUse(template)}
                            className="flex-1"
                        >
                            <Play className="w-4 h-4 mr-1" />
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

interface QRFormCardProps {
    form: QRCodeForm;
    onEdit: (form: QRCodeForm) => void;
    onDelete: (formId: string) => void;
    onToggleStatus: (formId: string) => void;
    onViewSubmissions: (form: QRCodeForm) => void;
}

const QRFormCard: React.FC<QRFormCardProps> = ({
    form,
    onEdit,
    onDelete,
    onToggleStatus,
    onViewSubmissions
}) => {
    const qrUrl = generateQRCodeUrl(form.id);

    return (
        <Card className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <QrCode className="w-5 h-5" />
                            <CardTitle className="text-lg font-semibold">{form.name}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{form.description}</p>
                        <div className="flex items-center gap-2">
                            <Badge className={form.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {form.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline">
                                {form.fields.length} fields
                            </Badge>
                            {form.autoResponseEnabled && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                    Auto-response
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Analytics */}
                    <div className="bg-muted/30 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="font-medium">{form.analytics.totalViews}</div>
                                <div className="text-muted-foreground">Total Views</div>
                            </div>
                            <div>
                                <div className="font-medium">{form.analytics.totalSubmissions}</div>
                                <div className="text-muted-foreground">Submissions</div>
                            </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border/50">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Conversion Rate:</span>
                                <span className="font-medium">{form.analytics.conversionRate.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewSubmissions(form)}
                            className="flex-1"
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            View ({form.submissions.length})
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(qrUrl, '_blank')}
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(form)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onToggleStatus(form.id)}
                            className={form.isActive ? 'text-orange-600' : 'text-green-600'}
                        >
                            {form.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(form.id)}
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

export const CampaignPlannerPage: React.FC<CampaignPlannerPageProps> = ({ onNavigate }) => {
    const [state, setState] = useState<CampaignPlannerState>({
        campaigns: [],
        templates: [],
        recipients: [],
        qrForms: [],
        view: 'campaigns',
        searchQuery: '',
        filterStatus: 'all',
        filterType: 'all'
    });

    // Initialize sample data on component mount
    useEffect(() => {
        initializeSampleCampaignData();
        setState(prev => ({
            ...prev,
            campaigns: getCampaigns(),
            templates: getTemplates(),
            qrForms: getQRForms()
        }));
    }, []);

    // Filtered and searched data
    const filteredCampaigns = useMemo(() => {
        let filtered = filterCampaigns(state.campaigns, {
            status: state.filterStatus,
            type: state.filterType
        });
        return searchCampaigns(filtered, state.searchQuery);
    }, [state.campaigns, state.searchQuery, state.filterStatus, state.filterType]);

    const filteredTemplates = useMemo(() => {
        return state.templates.filter(template =>
            template.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            template.content.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
    }, [state.templates, state.searchQuery]);

    const filteredQRForms = useMemo(() => {
        return state.qrForms.filter(form =>
            form.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            form.description.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
    }, [state.qrForms, state.searchQuery]);

    // Analytics summary
    const totalAnalytics = useMemo(() => {
        return calculateTotalAnalytics(state.campaigns);
    }, [state.campaigns]);

    const handleCampaignEdit = (campaign: Campaign) => {
        alert(`Edit campaign: ${campaign.name}\n(Feature coming soon!)`);
    };

    const handleCampaignDelete = (campaignId: string) => {
        if (confirm('Are you sure you want to delete this campaign?')) {
            setState(prev => ({
                ...prev,
                campaigns: prev.campaigns.filter(c => c.id !== campaignId)
            }));
        }
    };

    const handleCampaignDuplicate = (campaign: Campaign) => {
        const newCampaign: Campaign = {
            ...campaign,
            id: `campaign-${Date.now()}`,
            name: `${campaign.name} (Copy)`,
            status: 'draft',
            createdAt: new Date(),
            sentAt: undefined,
            analytics: {
                sent: 0, delivered: 0, opened: 0, clicked: 0, responded: 0, bounced: 0,
                openRate: 0, responseRate: 0, clickRate: 0
            }
        };
        setState(prev => ({
            ...prev,
            campaigns: [...prev.campaigns, newCampaign]
        }));
    };

    const handleToggleCampaignStatus = (campaignId: string) => {
        setState(prev => ({
            ...prev,
            campaigns: prev.campaigns.map(campaign => {
                if (campaign.id === campaignId) {
                    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
                    return { ...campaign, status: newStatus };
                }
                return campaign;
            })
        }));
    };

    const handleTemplateEdit = (template: CampaignTemplate) => {
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

    const handleTemplateUse = (template: CampaignTemplate) => {
        alert(`Create campaign with template: ${template.name}\n(Feature coming soon!)`);
    };

    const handleQRFormEdit = (form: QRCodeForm) => {
        alert(`Edit QR form: ${form.name}\n(Feature coming soon!)`);
    };

    const handleQRFormDelete = (formId: string) => {
        if (confirm('Are you sure you want to delete this QR form?')) {
            setState(prev => ({
                ...prev,
                qrForms: prev.qrForms.filter(f => f.id !== formId)
            }));
        }
    };

    const handleQRFormToggleStatus = (formId: string) => {
        setState(prev => ({
            ...prev,
            qrForms: prev.qrForms.map(form => {
                if (form.id === formId) {
                    return { ...form, isActive: !form.isActive };
                }
                return form;
            })
        }));
    };

    const handleViewSubmissions = (form: QRCodeForm) => {
        alert(`View submissions for: ${form.name}\nTotal: ${form.submissions.length} submissions\n(Feature coming soon!)`);
    };

    const renderTabNavigation = () => (
        <div className="flex items-center gap-2 mb-6">
            <Button
                variant={state.view === 'campaigns' ? 'default' : 'outline'}
                onClick={() => setState(prev => ({ ...prev, view: 'campaigns' }))}
                className="flex items-center gap-2"
            >
                <Send className="w-4 h-4" />
                Campaigns ({state.campaigns.length})
            </Button>
            <Button
                variant={state.view === 'templates' ? 'default' : 'outline'}
                onClick={() => setState(prev => ({ ...prev, view: 'templates' }))}
                className="flex items-center gap-2"
            >
                <Mail className="w-4 h-4" />
                Templates ({state.templates.length})
            </Button>
            <Button
                variant={state.view === 'qr-forms' ? 'default' : 'outline'}
                onClick={() => setState(prev => ({ ...prev, view: 'qr-forms' }))}
                className="flex items-center gap-2"
            >
                <QrCode className="w-4 h-4" />
                QR Forms ({state.qrForms.length})
            </Button>
            <Button
                variant={state.view === 'analytics' ? 'default' : 'outline'}
                onClick={() => setState(prev => ({ ...prev, view: 'analytics' }))}
                className="flex items-center gap-2"
            >
                <BarChart3 className="w-4 h-4" />
                Analytics
            </Button>
        </div>
    );

    const renderStatsCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                    <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{state.campaigns.length}</div>
                    <p className="text-xs text-muted-foreground">
                        {state.campaigns.filter(c => c.status === 'active').length} active
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalAnalytics.sent}</div>
                    <p className="text-xs text-muted-foreground">
                        {totalAnalytics.delivered} delivered
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalAnalytics.openRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                        {totalAnalytics.opened} opens
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalAnalytics.responseRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                        {totalAnalytics.responded} responses
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
            {state.view === 'campaigns' && (
                <>
                    <select
                        value={state.filterStatus}
                        onChange={(e) => setState(prev => ({ ...prev, filterStatus: e.target.value as any }))}
                        className="px-3 py-2 border border-border rounded-md bg-background"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        value={state.filterType}
                        onChange={(e) => setState(prev => ({ ...prev, filterType: e.target.value as any }))}
                        className="px-3 py-2 border border-border rounded-md bg-background"
                    >
                        <option value="all">All Types</option>
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="telegram">Telegram</option>
                        <option value="viber">Viber</option>
                    </select>
                </>
            )}
            <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create New
            </Button>
        </div>
    );

    const renderCampaigns = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCampaigns.map((campaign) => (
                <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onEdit={handleCampaignEdit}
                    onDelete={handleCampaignDelete}
                    onDuplicate={handleCampaignDuplicate}
                    onToggleStatus={handleToggleCampaignStatus}
                />
            ))}
            {filteredCampaigns.length === 0 && (
                <div className="col-span-full text-center py-12">
                    <Send className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
                    <p className="text-muted-foreground mb-4">
                        {state.searchQuery ? 'Try adjusting your search criteria.' : 'Create your first campaign to get started.'}
                    </p>
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Campaign
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
                    <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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

    const renderQRForms = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredQRForms.map((form) => (
                <QRFormCard
                    key={form.id}
                    form={form}
                    onEdit={handleQRFormEdit}
                    onDelete={handleQRFormDelete}
                    onToggleStatus={handleQRFormToggleStatus}
                    onViewSubmissions={handleViewSubmissions}
                />
            ))}
            {filteredQRForms.length === 0 && (
                <div className="col-span-full text-center py-12">
                    <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No QR forms found</h3>
                    <p className="text-muted-foreground mb-4">
                        {state.searchQuery ? 'Try adjusting your search criteria.' : 'Create your first QR form to get started.'}
                    </p>
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create QR Form
                    </Button>
                </div>
            )}
        </div>
    );

    const renderAnalytics = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Campaign Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Total Campaigns</span>
                                <span className="font-medium">{state.campaigns.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Active</span>
                                <span className="font-medium text-green-600">
                                    {state.campaigns.filter(c => c.status === 'active').length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Completed</span>
                                <span className="font-medium">
                                    {state.campaigns.filter(c => c.status === 'completed').length}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">QR Forms Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Total Forms</span>
                                <span className="font-medium">{state.qrForms.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Total Views</span>
                                <span className="font-medium">
                                    {state.qrForms.reduce((sum, form) => sum + form.analytics.totalViews, 0)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Submissions</span>
                                <span className="font-medium text-green-600">
                                    {state.qrForms.reduce((sum, form) => sum + form.analytics.totalSubmissions, 0)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Templates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Total Templates</span>
                                <span className="font-medium">{state.templates.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Email</span>
                                <span className="font-medium">
                                    {state.templates.filter(t => t.type === 'email').length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">WhatsApp</span>
                                <span className="font-medium">
                                    {state.templates.filter(t => t.type === 'whatsapp').length}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Campaign Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {state.campaigns
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 5)
                            .map((campaign) => (
                                <div key={campaign.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <Badge className={getStatusColor(campaign.status)}>
                                            {campaign.status}
                                        </Badge>
                                        <div>
                                            <div className="font-medium">{campaign.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(campaign.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {formatAnalytics(campaign.analytics)}
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
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
                    <h1 className="text-3xl font-bold text-foreground">Campaign Planner</h1>
                    <p className="text-muted-foreground">
                        Create and manage smart, personalized follow-up campaigns with B2Breeze
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            {renderStatsCards()}

            {/* Tab Navigation */}
            {renderTabNavigation()}

            {/* Search and Filters */}
            {renderSearchAndFilters()}

            {/* Content */}
            {state.view === 'campaigns' && renderCampaigns()}
            {state.view === 'templates' && renderTemplates()}
            {state.view === 'qr-forms' && renderQRForms()}
            {state.view === 'analytics' && renderAnalytics()}
        </div>
    );
};
