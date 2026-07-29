export interface ColumnSummary {
  name: string;
  type: string;
  missing_count: number;
  missing_percentage: number;
  distinct_count: number;
  mean?: number | null;
  median?: number | null;
  std?: number | null;
  min?: number | null;
  max?: number | null;
  top_value?: string | null;
  top_count?: number | null;
}

export interface DatasetSummaryResponse {
  dataset_id: number;
  dataset_name: string;
  row_count: number;
  column_count: number;
  columns: ColumnSummary[];
}

export interface DistributionBin {
  label: string;
  count: number;
  percentage: number;
}

export interface ColumnDistributionResponse {
  column_name: string;
  column_type: string;
  total_count: number;
  bins: DistributionBin[];
}

export interface CorrelationCell {
  x: string;
  y: string;
  value: number;
}

export interface CorrelationMatrixResponse {
  columns: string[];
  matrix: CorrelationCell[];
}

export interface CustomChartResponse {
  x_col: string;
  y_col: string;
  chart_type: string;
  data: Record<string, any>[];
}
