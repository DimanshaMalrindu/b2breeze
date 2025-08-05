import type {
  AnalyticsData,
  BusinessMetrics,
  LeadMetrics,
  ProductMetrics,
  RevenueMetrics,
  ConversionFunnel,
  RegionalData,
  TrendData,
  ChartData,
  AnalyticsPeriod,
  ExportOptions
} from '@/types/analytics';
import type { Invoice } from '@/types/invoice';
import type { CustomerContact } from '@/types/customer';
import type { Campaign } from '@/types/campaign';

// Color palette for charts
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  gradient: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f97316', '#84cc16']
};

// Get analytics data from localStorage
export const getAnalyticsData = (): AnalyticsData | null => {
  try {
    const data = localStorage.getItem('b2breeze_analytics');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting analytics data:', error);
    return null;
  }
};

// Save analytics data to localStorage
export const saveAnalyticsData = (data: AnalyticsData): void => {
  try {
    localStorage.setItem('b2breeze_analytics', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving analytics data:', error);
  }
};

// Generate business metrics from actual data
export const calculateBusinessMetrics = (
  invoices: Invoice[],
  customers: CustomerContact[],
  campaigns: Campaign[]
): BusinessMetrics => {
  const totalLeads = campaigns.reduce((sum, campaign) => sum + (campaign.analytics?.sent || 0), 0);
  const totalCustomers = customers.length;
  const totalInvoices = invoices.length;
  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'payment-received')
    .reduce((sum, invoice) => sum + invoice.total, 0);
  
  const conversions = invoices.filter(invoice => 
    invoice.status === 'payment-received'
  ).length;
  const conversionRate = totalLeads > 0 ? (conversions / totalLeads) * 100 : 0;
  
  const averageOrderValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
  const overdueInvoices = invoices.filter(invoice => 
    invoice.status === 'overdue' || (invoice.status === 'approved' && invoice.dueDate && new Date(invoice.dueDate) < new Date())
  ).length;
  
  const pendingQuotations = invoices.filter(invoice => 
    invoice.type === 'quotation' && invoice.status === 'pending'
  ).length;

  return {
    totalLeads,
    totalCustomers,
    totalInvoices,
    totalRevenue,
    conversionRate,
    averageOrderValue,
    overdueInvoices,
    pendingQuotations
  };
};

// Generate lead metrics from campaigns
export const calculateLeadMetrics = (campaigns: Campaign[]): LeadMetrics[] => {
  return campaigns.map(campaign => ({
    eventName: campaign.name,
    region: 'Unknown', // Campaign doesn't have region in current structure
    leadsCollected: campaign.analytics?.sent || 0,
    conversions: campaign.analytics?.responded || 0,
    conversionRate: campaign.analytics?.responseRate || 0,
    date: campaign.createdAt.toISOString()
  }));
};

// Generate product metrics from invoices
export const calculateProductMetrics = (invoices: Invoice[]): ProductMetrics[] => {
  const productMap = new Map<string, { count: number; revenue: number; category: string }>();
  
  invoices.forEach(invoice => {
    invoice.items.forEach(item => {
      const existing = productMap.get(item.description) || { count: 0, revenue: 0, category: 'General' };
      productMap.set(item.description, {
        count: existing.count + item.quantity,
        revenue: existing.revenue + (item.quantity * item.unitPrice),
        category: existing.category
      });
    });
  });

  return Array.from(productMap.entries())
    .map(([productName, data]) => ({
      productName,
      requestCount: data.count,
      revenue: data.revenue,
      category: data.category
    }))
    .sort((a, b) => b.requestCount - a.requestCount);
};

// Generate revenue metrics by month
export const calculateRevenueMetrics = (invoices: Invoice[]): RevenueMetrics[] => {
  const monthlyData = new Map<string, { 
    quotations: number; 
    proformaInvoices: number; 
    commercialInvoices: number; 
    totalRevenue: number;
    invoiceCount: number;
  }>();

  invoices.forEach(invoice => {
    const month = new Date(invoice.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
    
    const existing = monthlyData.get(month) || {
      quotations: 0,
      proformaInvoices: 0,
      commercialInvoices: 0,
      totalRevenue: 0,
      invoiceCount: 0
    };

    const revenue = invoice.status === 'payment-received' ? invoice.total : 0;
    
    monthlyData.set(month, {
      quotations: existing.quotations + (invoice.type === 'quotation' ? revenue : 0),
      proformaInvoices: existing.proformaInvoices + (invoice.type === 'proforma' ? revenue : 0),
      commercialInvoices: existing.commercialInvoices + (invoice.type === 'commercial' ? revenue : 0),
      totalRevenue: existing.totalRevenue + revenue,
      invoiceCount: existing.invoiceCount + 1
    });
  });

  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
};

// Generate conversion funnel data
export const calculateConversionFunnel = (
  campaigns: Campaign[],
  invoices: Invoice[]
): ConversionFunnel[] => {
  const totalReach = campaigns.reduce((sum, campaign) => sum + (campaign.analytics?.sent || 0), 0);
  const inquiries = campaigns.reduce((sum, campaign) => sum + (campaign.analytics?.responded || 0), 0);
  const quotations = invoices.filter(invoice => invoice.type === 'quotation').length;
  const conversions = invoices.filter(invoice => invoice.status === 'payment-received').length;

  return [
    { stage: 'Reach', count: totalReach, percentage: 100 },
    { stage: 'Inquiries', count: inquiries, percentage: totalReach > 0 ? (inquiries / totalReach) * 100 : 0 },
    { stage: 'Quotations', count: quotations, percentage: totalReach > 0 ? (quotations / totalReach) * 100 : 0 },
    { stage: 'Conversions', count: conversions, percentage: totalReach > 0 ? (conversions / totalReach) * 100 : 0 }
  ];
};

// Generate regional data
export const calculateRegionalData = (
  customers: CustomerContact[],
  campaigns: Campaign[],
  invoices: Invoice[]
): RegionalData[] => {
  const regionMap = new Map<string, { leads: number; customers: number; revenue: number; products: Map<string, number> }>();

  // Process customers by region
  customers.forEach(customer => {
    const region = customer.country || 'Unknown';
    const existing = regionMap.get(region) || { leads: 0, customers: 0, revenue: 0, products: new Map() };
    regionMap.set(region, { ...existing, customers: existing.customers + 1 });
  });

  // Process campaigns by region
  campaigns.forEach(campaign => {
    const region = 'Unknown'; // Campaign doesn't have region info
    const existing = regionMap.get(region) || { leads: 0, customers: 0, revenue: 0, products: new Map() };
    regionMap.set(region, { 
      ...existing, 
      leads: existing.leads + (campaign.analytics?.sent || 0) 
    });
  });

  // Process invoices by customer region
  invoices.forEach(invoice => {
    const region = invoice.customerDetails.country || 'Unknown';
    const existing = regionMap.get(region) || { leads: 0, customers: 0, revenue: 0, products: new Map() };
    const revenue = invoice.status === 'payment-received' ? invoice.total : 0;
    
    // Track top products per region
    invoice.items.forEach(item => {
      const productCount = existing.products.get(item.description) || 0;
      existing.products.set(item.description, productCount + item.quantity);
    });

    regionMap.set(region, { 
      ...existing, 
      revenue: existing.revenue + revenue 
    });
  });

  return Array.from(regionMap.entries()).map(([region, data]) => {
    const topProduct = Array.from(data.products.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    return {
      region,
      leads: data.leads,
      customers: data.customers,
      revenue: data.revenue,
      topProduct
    };
  }).sort((a, b) => b.revenue - a.revenue);
};

// Generate trend data
export const calculateTrendData = (
  invoices: Invoice[],
  campaigns: Campaign[],
  period: AnalyticsPeriod = 'month'
): TrendData[] => {
  const now = new Date();
  const periods: TrendData[] = [];
  
  // Generate periods based on selected timeframe
  const periodCount = period === 'week' ? 12 : period === 'month' ? 12 : period === 'quarter' ? 8 : 5;
  
  for (let i = periodCount - 1; i >= 0; i--) {
    const periodDate = new Date(now);
    
    if (period === 'week') {
      periodDate.setDate(periodDate.getDate() - (i * 7));
    } else if (period === 'month') {
      periodDate.setMonth(periodDate.getMonth() - i);
    } else if (period === 'quarter') {
      periodDate.setMonth(periodDate.getMonth() - (i * 3));
    } else {
      periodDate.setFullYear(periodDate.getFullYear() - i);
    }

    const periodStr = period === 'week' 
      ? `Week ${Math.ceil((now.getTime() - periodDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}`
      : periodDate.toLocaleDateString('en-US', { 
          [period === 'year' ? 'year' : 'month']: period === 'year' ? 'numeric' : 'short',
          ...(period === 'month' && { year: 'numeric' })
        });

    // Calculate metrics for this period
    const periodStart = new Date(periodDate);
    const periodEnd = new Date(periodDate);
    
    if (period === 'week') {
      periodEnd.setDate(periodEnd.getDate() + 7);
    } else if (period === 'month') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else if (period === 'quarter') {
      periodEnd.setMonth(periodEnd.getMonth() + 3);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    const periodInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.createdAt);
      return invoiceDate >= periodStart && invoiceDate < periodEnd;
    });

    const periodCampaigns = campaigns.filter(campaign => {
      const campaignDate = new Date(campaign.createdAt);
      return campaignDate >= periodStart && campaignDate < periodEnd;
    });

    const leads = periodCampaigns.reduce((sum, campaign) => sum + (campaign.analytics?.sent || 0), 0);
    const conversions = periodInvoices.filter(invoice => invoice.status === 'payment-received').length;
    const revenue = periodInvoices
      .filter(invoice => invoice.status === 'payment-received')
      .reduce((sum, invoice) => sum + invoice.total, 0);
    const averageOrderValue = conversions > 0 ? revenue / conversions : 0;

    periods.push({
      period: periodStr,
      leads,
      conversions,
      revenue,
      averageOrderValue
    });
  }

  return periods;
};

// Initialize sample analytics data
export const initializeSampleAnalyticsData = (): void => {
  const existingData = getAnalyticsData();
  if (existingData) return;

  // Generate sample data for demo purposes
  const sampleData: AnalyticsData = {
    businessMetrics: {
      totalLeads: 1250,
      totalCustomers: 89,
      totalInvoices: 156,
      totalRevenue: 89750,
      conversionRate: 7.12,
      averageOrderValue: 575,
      overdueInvoices: 8,
      pendingQuotations: 12
    },
    leadMetrics: [
      { eventName: 'Tech Expo 2024', region: 'New York', leadsCollected: 145, conversions: 12, conversionRate: 8.3, date: '2024-07-15' },
      { eventName: 'Business Summit', region: 'California', leadsCollected: 198, conversions: 18, conversionRate: 9.1, date: '2024-07-20' },
      { eventName: 'Trade Show', region: 'Texas', leadsCollected: 167, conversions: 15, conversionRate: 9.0, date: '2024-07-25' },
      { eventName: 'Digital Conference', region: 'Florida', leadsCollected: 203, conversions: 22, conversionRate: 10.8, date: '2024-08-01' }
    ],
    productMetrics: [
      { productName: 'Business Cards (Premium)', requestCount: 245, revenue: 12250, category: 'Printing' },
      { productName: 'Website Development', requestCount: 89, revenue: 35600, category: 'Digital' },
      { productName: 'Logo Design', requestCount: 156, revenue: 15600, category: 'Design' },
      { productName: 'Marketing Brochures', requestCount: 134, revenue: 8040, category: 'Printing' },
      { productName: 'Social Media Package', requestCount: 98, revenue: 19600, category: 'Digital' }
    ],
    revenueMetrics: [
      { month: 'Jan 2024', quotations: 15000, proformaInvoices: 12000, commercialInvoices: 18000, totalRevenue: 45000, invoiceCount: 32 },
      { month: 'Feb 2024', quotations: 18000, proformaInvoices: 14000, commercialInvoices: 22000, totalRevenue: 54000, invoiceCount: 38 },
      { month: 'Mar 2024', quotations: 16000, proformaInvoices: 13000, commercialInvoices: 25000, totalRevenue: 54000, invoiceCount: 35 },
      { month: 'Apr 2024', quotations: 20000, proformaInvoices: 16000, commercialInvoices: 28000, totalRevenue: 64000, invoiceCount: 42 },
      { month: 'May 2024', quotations: 22000, proformaInvoices: 18000, commercialInvoices: 30000, totalRevenue: 70000, invoiceCount: 45 },
      { month: 'Jun 2024', quotations: 19000, proformaInvoices: 15000, commercialInvoices: 26000, totalRevenue: 60000, invoiceCount: 40 }
    ],
    conversionFunnel: [
      { stage: 'Reach', count: 1250, percentage: 100 },
      { stage: 'Inquiries', count: 234, percentage: 18.7 },
      { stage: 'Quotations', count: 156, percentage: 12.5 },
      { stage: 'Conversions', count: 89, percentage: 7.1 }
    ],
    regionalData: [
      { region: 'California', leads: 298, customers: 25, revenue: 28500, topProduct: 'Website Development' },
      { region: 'New York', leads: 245, customers: 22, revenue: 25200, topProduct: 'Business Cards (Premium)' },
      { region: 'Texas', leads: 234, customers: 18, revenue: 19800, topProduct: 'Logo Design' },
      { region: 'Florida', leads: 203, customers: 15, revenue: 16200, topProduct: 'Marketing Brochures' },
      { region: 'Illinois', leads: 189, customers: 9, revenue: 12600, topProduct: 'Social Media Package' }
    ],
    trendData: [
      { period: 'Jan 2024', leads: 180, conversions: 12, revenue: 15000, averageOrderValue: 1250 },
      { period: 'Feb 2024', leads: 210, conversions: 16, revenue: 18500, averageOrderValue: 1156 },
      { period: 'Mar 2024', leads: 195, conversions: 14, revenue: 16800, averageOrderValue: 1200 },
      { period: 'Apr 2024', leads: 225, conversions: 18, revenue: 21200, averageOrderValue: 1178 },
      { period: 'May 2024', leads: 240, conversions: 20, revenue: 24500, averageOrderValue: 1225 },
      { period: 'Jun 2024', leads: 200, conversions: 15, revenue: 18750, averageOrderValue: 1250 }
    ],
    lastUpdated: new Date().toISOString()
  };

  saveAnalyticsData(sampleData);
};

// Convert data to chart format
export const formatChartData = (
  data: number[],
  labels: string[],
  label: string,
  colors?: string[]
): ChartData => {
  return {
    labels,
    datasets: [{
      label,
      data,
      backgroundColor: colors || CHART_COLORS.gradient.slice(0, data.length),
      borderColor: colors || CHART_COLORS.gradient.slice(0, data.length),
      borderWidth: 2,
      fill: false
    }]
  };
};

// Export analytics data
export const exportAnalyticsData = async (
  data: AnalyticsData,
  options: ExportOptions
): Promise<void> => {
  const { format, dateRange, includeCharts, reportTitle } = options;
  
  if (format === 'csv') {
    await exportToCSV(data, reportTitle);
  } else if (format === 'excel') {
    await exportToExcel(data, reportTitle, includeCharts);
  } else if (format === 'pdf') {
    await exportToPDF(data, reportTitle, includeCharts, dateRange);
  }
};

// Export to CSV
const exportToCSV = async (data: AnalyticsData, title: string): Promise<void> => {
  const csvContent = [
    // Business Metrics
    `${title} - Business Metrics`,
    'Metric,Value',
    `Total Leads,${data.businessMetrics.totalLeads}`,
    `Total Customers,${data.businessMetrics.totalCustomers}`,
    `Total Invoices,${data.businessMetrics.totalInvoices}`,
    `Total Revenue,$${data.businessMetrics.totalRevenue.toLocaleString()}`,
    `Conversion Rate,${data.businessMetrics.conversionRate.toFixed(2)}%`,
    `Average Order Value,$${data.businessMetrics.averageOrderValue.toFixed(2)}`,
    '',
    // Revenue by Month
    'Monthly Revenue',
    'Month,Quotations,Proforma Invoices,Commercial Invoices,Total Revenue,Invoice Count',
    ...data.revenueMetrics.map(metric => 
      `${metric.month},$${metric.quotations},$${metric.proformaInvoices},$${metric.commercialInvoices},$${metric.totalRevenue},${metric.invoiceCount}`
    ),
    '',
    // Top Products
    'Top Products',
    'Product,Requests,Revenue,Category',
    ...data.productMetrics.map(product => 
      `${product.productName},${product.requestCount},$${product.revenue},${product.category}`
    ),
    '',
    // Regional Data
    'Regional Performance',
    'Region,Leads,Customers,Revenue,Top Product',
    ...data.regionalData.map(region => 
      `${region.region},${region.leads},${region.customers},$${region.revenue},${region.topProduct}`
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/\s+/g, '_')}_analytics.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export to Excel (placeholder for future implementation)
const exportToExcel = async (
  _data: AnalyticsData, 
  _title: string, 
  _includeCharts: boolean
): Promise<void> => {
  // This would require a library like xlsx or exceljs
  console.log('Excel export would be implemented here with xlsx library');
  alert('Excel export feature will be available soon. Use CSV export for now.');
};

// Export to PDF (placeholder for future implementation)
const exportToPDF = async (
  _data: AnalyticsData, 
  _title: string, 
  _includeCharts: boolean,
  _dateRange: { start: string; end: string }
): Promise<void> => {
  // This would require a library like jsPDF with chart support
  console.log('PDF export would be implemented here with jsPDF and chart libraries');
  alert('PDF export feature will be available soon. Use CSV export for now.');
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format percentage for display
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Format large numbers with abbreviations
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};
