export interface BusinessMetrics {
  totalLeads: number;
  totalCustomers: number;
  totalInvoices: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  overdueInvoices: number;
  pendingQuotations: number;
}

export interface LeadMetrics {
  eventName: string;
  region: string;
  leadsCollected: number;
  conversions: number;
  conversionRate: number;
  date: string;
}

export interface ProductMetrics {
  productName: string;
  requestCount: number;
  revenue: number;
  category: string;
}

export interface RevenueMetrics {
  month: string;
  quotations: number;
  proformaInvoices: number;
  commercialInvoices: number;
  totalRevenue: number;
  invoiceCount: number;
}

export interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
}

export interface RegionalData {
  region: string;
  leads: number;
  customers: number;
  revenue: number;
  topProduct: string;
}

export interface TrendData {
  period: string;
  leads: number;
  conversions: number;
  revenue: number;
  averageOrderValue: number;
}

export interface AnalyticsData {
  businessMetrics: BusinessMetrics;
  leadMetrics: LeadMetrics[];
  productMetrics: ProductMetrics[];
  revenueMetrics: RevenueMetrics[];
  conversionFunnel: ConversionFunnel[];
  regionalData: RegionalData[];
  trendData: TrendData[];
  lastUpdated: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  dateRange: {
    start: string;
    end: string;
  };
  includeCharts: boolean;
  reportTitle: string;
}

export type AnalyticsPeriod = 'week' | 'month' | 'quarter' | 'year';
export type AnalyticsView = 'overview' | 'leads' | 'products' | 'revenue' | 'regions' | 'trends';

export interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  selectedPeriod: AnalyticsPeriod;
  selectedView: AnalyticsView;
  dateRange: {
    start: string;
    end: string;
  };
}
