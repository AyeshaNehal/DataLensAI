export interface DatasetColumn {
  name: string;
  type: string;
  sample_values: any[];
}

export interface Dataset {
  id: number;
  user_id: number;
  name: string;
  description?: string | null;
  row_count: number;
  column_count: number;
  columns: DatasetColumn[];
  file_size_bytes: number;
  created_at: string;
}

export interface DatasetPreview {
  dataset: Dataset;
  preview_rows: Record<string, any>[];
}
