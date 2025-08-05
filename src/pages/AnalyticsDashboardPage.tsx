import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    Target,
    MapPin,
    Download,
    Zap,
    ShoppingCart,
    AlertTriangle,
    Clock,
    FileText,
    RefreshCw,
    ArrowUp,
    ArrowDown,
    Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type {
    AnalyticsData,
    AnalyticsPeriod,
    AnalyticsView,
    ExportOptions
} from '@/types/analytics';
import {
    getAnalyticsData,
    initializeSampleAnalyticsData,
    formatCurrency,
    formatPercentage,
    formatNumber,
    exportAnalyticsData
} from '@/lib/analytics-utils';

interface AnalyticsDashboardPageProps {
    onNavigate: (page: string) => void;
}

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
    format?: 'currency' | 'percentage' | 'number';
}

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    onExport?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    icon,
    color,
    format = 'number'
}) => {
    const formatValue = (val: string | number) => {
        if (typeof val === 'string') return val;
        switch (format) {
            case 'currency': return formatCurrency(val);
            case 'percentage': return formatPercentage(val);
            default: return formatNumber(val);
        }
    };

    const getChangeIcon = () => {
        if (!change) return <Minus className="w-3 h-3" />;
        if (change > 0) return <ArrowUp className="w-3 h-3 text-green-500" />;
        if (change < 0) return <ArrowDown className="w-3 h-3 text-red-500" />;
        return <Minus className="w-3 h-3" />;
    };

    const getChangeColor = () => {
        if (!change) return 'text-gray-500';
        return change > 0 ? 'text-green-500' : 'text-red-500';
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {formatValue(value)}
                        </p>
                        {change !== undefined && (
                            <div className={`flex items-center mt-2 text-sm ${getChangeColor()}`}>
                                {getChangeIcon()}
                                <span className="ml-1">{Math.abs(change).toFixed(1)}%</span>
                                <span className="text-gray-500 ml-1">vs last period</span>
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-full ${color}`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const ChartCard: React.FC<ChartCardProps> = ({ title, children, onExport }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {onExport && (
                <Button variant="outline" size="sm" onClick={onExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                </Button>
            )}
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

export const AnalyticsDashboardPage: React.FC<AnalyticsDashboardPageProps> = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>('month');
    const [selectedView, setSelectedView] = useState<AnalyticsView>('overview');
    const [dateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        loadAnalyticsData();
    }, [selectedPeriod]);

    const loadAnalyticsData = async () => {
        setLoading(true);
        try {
            // Initialize sample data if none exists
            initializeSampleAnalyticsData();

            // Get data from localStorage
            const analyticsData = getAnalyticsData();
            setData(analyticsData);
        } catch (error) {
            console.error('Error loading analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
        if (!data) return;

        const exportOptions: ExportOptions = {
            format,
            dateRange,
            includeCharts: format === 'pdf',
            reportTitle: `B2Breeze Analytics Report - ${new Date().toLocaleDateString()}`
        };

        try {
            await exportAnalyticsData(data, exportOptions);
        } catch (error) {
            console.error('Export error:', error);
        }
    };

    const handleRefresh = () => {
        loadAnalyticsData();
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-2">Loading analytics...</span>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
                    <p className="text-gray-600 mb-4">Analytics data is not available.</p>
                    <Button onClick={loadAnalyticsData}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600">Track your business performance and insights with B2Breeze</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value as AnalyticsPeriod)}
                    >
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="quarter">Quarter</option>
                        <option value="year">Year</option>
                    </select>

                    <Button variant="outline" onClick={handleRefresh}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>

                    <select
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => e.target.value && handleExport(e.target.value as 'csv' | 'excel' | 'pdf')}
                        defaultValue=""
                    >
                        <option value="" disabled>Export</option>
                        <option value="csv">CSV</option>
                        <option value="excel">Excel</option>
                        <option value="pdf">PDF</option>
                    </select>
                </div>
            </div>

            {/* View Navigation */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'leads', label: 'Leads', icon: Target },
                    { id: 'products', label: 'Products', icon: ShoppingCart },
                    { id: 'revenue', label: 'Revenue', icon: DollarSign },
                    { id: 'regions', label: 'Regions', icon: MapPin },
                    { id: 'trends', label: 'Trends', icon: TrendingUp }
                ].map(view => {
                    const Icon = view.icon;
                    return (
                        <Button
                            key={view.id}
                            variant={selectedView === view.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedView(view.id as AnalyticsView)}
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {view.label}
                        </Button>
                    );
                })}
            </div>

            {/* Overview View */}
            {selectedView === 'overview' && (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            title="Total Leads"
                            value={data.businessMetrics.totalLeads}
                            change={12.5}
                            icon={<Target className="w-6 h-6 text-white" />}
                            color="bg-blue-500"
                            format="number"
                        />
                        <MetricCard
                            title="Total Revenue"
                            value={data.businessMetrics.totalRevenue}
                            change={8.3}
                            icon={<DollarSign className="w-6 h-6 text-white" />}
                            color="bg-green-500"
                            format="currency"
                        />
                        <MetricCard
                            title="Conversion Rate"
                            value={data.businessMetrics.conversionRate}
                            change={-2.1}
                            icon={<Zap className="w-6 h-6 text-white" />}
                            color="bg-purple-500"
                            format="percentage"
                        />
                        <MetricCard
                            title="Total Customers"
                            value={data.businessMetrics.totalCustomers}
                            change={15.7}
                            icon={<Users className="w-6 h-6 text-white" />}
                            color="bg-orange-500"
                            format="number"
                        />
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Pending Quotations</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">
                                            {data.businessMetrics.pendingQuotations}
                                        </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-yellow-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Overdue Invoices</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">
                                            {data.businessMetrics.overdueInvoices}
                                        </p>
                                    </div>
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">
                                            {formatCurrency(data.businessMetrics.averageOrderValue)}
                                        </p>
                                    </div>
                                    <ShoppingCart className="w-8 h-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">
                                            {data.businessMetrics.totalInvoices}
                                        </p>
                                    </div>
                                    <FileText className="w-8 h-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard title="Revenue Trend" onExport={() => handleExport('csv')}>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                <div className="text-center">
                                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">Revenue chart visualization</p>
                                    <p className="text-sm text-gray-400">Chart library integration needed</p>
                                </div>
                            </div>
                        </ChartCard>

                        <ChartCard title="Conversion Funnel" onExport={() => handleExport('csv')}>
                            <div className="space-y-3">
                                {data.conversionFunnel.map((stage, index) => (
                                    <div key={stage.stage} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' :
                                                index === 1 ? 'bg-green-500' :
                                                    index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                                                }`} />
                                            <span className="font-medium">{stage.stage}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">{formatNumber(stage.count)}</div>
                                            <div className="text-sm text-gray-500">{formatPercentage(stage.percentage)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>
                    </div>
                </div>
            )}

            {/* Leads View */}
            {selectedView === 'leads' && (
                <div className="space-y-6">
                    <ChartCard title="Lead Generation by Event">
                        <div className="space-y-4">
                            {data.leadMetrics.map((lead) => (
                                <div key={lead.eventName} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-semibold">{lead.eventName}</h4>
                                        <p className="text-sm text-gray-600">{lead.region} • {new Date(lead.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">{formatNumber(lead.leadsCollected)} leads</div>
                                        <div className="text-sm text-gray-600">
                                            {lead.conversions} conversions ({formatPercentage(lead.conversionRate)})
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>
            )}

            {/* Products View */}
            {selectedView === 'products' && (
                <div className="space-y-6">
                    <ChartCard title="Top Requested Products">
                        <div className="space-y-4">
                            {data.productMetrics.slice(0, 10).map((product, index) => (
                                <div key={product.productName} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{product.productName}</h4>
                                            <p className="text-sm text-gray-600">{product.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">{formatNumber(product.requestCount)} requests</div>
                                        <div className="text-sm text-gray-600">{formatCurrency(product.revenue)} revenue</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>
            )}

            {/* Revenue View */}
            {selectedView === 'revenue' && (
                <div className="space-y-6">
                    <ChartCard title="Monthly Revenue Breakdown">
                        <div className="space-y-4">
                            {data.revenueMetrics.map((month) => (
                                <div key={month.month} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold">{month.month}</h4>
                                        <div className="text-right">
                                            <div className="font-semibold">{formatCurrency(month.totalRevenue)}</div>
                                            <div className="text-sm text-gray-600">{month.invoiceCount} invoices</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Quotations:</span>
                                            <div className="font-medium">{formatCurrency(month.quotations)}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Proforma:</span>
                                            <div className="font-medium">{formatCurrency(month.proformaInvoices)}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Commercial:</span>
                                            <div className="font-medium">{formatCurrency(month.commercialInvoices)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>
            )}

            {/* Regions View */}
            {selectedView === 'regions' && (
                <div className="space-y-6">
                    <ChartCard title="Regional Performance">
                        <div className="space-y-4">
                            {data.regionalData.map((region, index) => (
                                <div key={region.region} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{region.region}</h4>
                                            <p className="text-sm text-gray-600">Top Product: {region.topProduct}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">{formatCurrency(region.revenue)}</div>
                                        <div className="text-sm text-gray-600">
                                            {formatNumber(region.leads)} leads • {region.customers} customers
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>
            )}

            {/* Trends View */}
            {selectedView === 'trends' && (
                <div className="space-y-6">
                    <ChartCard title="Business Trends">
                        <div className="space-y-4">
                            {data.trendData.map((trend) => (
                                <div key={trend.period} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold">{trend.period}</h4>
                                        <div className="text-right">
                                            <div className="font-semibold">{formatCurrency(trend.revenue)}</div>
                                            <div className="text-sm text-gray-600">AOV: {formatCurrency(trend.averageOrderValue)}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Leads:</span>
                                            <div className="font-medium">{formatNumber(trend.leads)}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Conversions:</span>
                                            <div className="font-medium">{trend.conversions}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>
            )}

            {/* Last Updated */}
            <div className="text-center text-sm text-gray-500">
                Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </div>
        </div>
    );
};
