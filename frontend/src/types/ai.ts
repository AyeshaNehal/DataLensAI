export interface AIInsightItem {
  title: string;
  description: string;
  category: 'trend' | 'anomaly' | 'recommendation' | 'stat';
  confidence: number;
}

export interface ExecutiveInsightsResponse {
  dataset_id: number;
  dataset_name: string;
  summary: string;
  insights: AIInsightItem[];
  recommended_charts: Record<string, any>[];
}

export interface AIQueryRequest {
  dataset_id: number;
  question: string;
}

export interface ChartRecommendation {
  chart_type: 'bar' | 'line' | 'area' | 'pie' | 'none';
  x_key: string;
  y_key: string;
  title: string;
  data?: Record<string, any>[] | null;
}

export interface AIQueryResponse {
  query_id: number;
  question: string;
  answer: string;
  generated_code?: string | null;
  chart_config?: ChartRecommendation | null;
  created_at: string;
  confidence: number;
}

export interface QueryHistoryItem {
  id: number;
  dataset_id: number;
  question: string;
  answer: string;
  generated_code?: string | null;
  chart_config?: Record<string, any> | null;
  created_at: string;
}
