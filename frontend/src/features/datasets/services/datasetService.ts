import { apiClient } from '../../../services/api';
import type { Dataset, DatasetPreview } from '../../../types/dataset';

export const datasetService = {
  /**
   * Upload a new CSV dataset with multipart/form-data.
   */
  async uploadCsv(file: File, description?: string): Promise<Dataset> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const response = await apiClient.post<Dataset>('/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Fetch all datasets uploaded by the current user.
   */
  async getMyDatasets(): Promise<Dataset[]> {
    const response = await apiClient.get<Dataset[]>('/datasets/');
    return response.data;
  },

  /**
   * Get dataset metadata and first 50 preview rows.
   */
  async getDatasetPreview(id: number): Promise<DatasetPreview> {
    const response = await apiClient.get<DatasetPreview>(`/datasets/${id}/preview`);
    return response.data;
  },

  /**
   * Delete a dataset by ID.
   */
  async deleteDataset(id: number): Promise<void> {
    await apiClient.delete(`/datasets/${id}`);
  },
};
