import { apiClient } from '../../../services/api';
import type {
  ExecutiveInsightsResponse,
  AIQueryResponse,
  QueryHistoryItem,
} from '../../../types/ai';

export const aiService = {
  /**
   * Fetch automated executive AI insights report for a dataset.
   */
  async getExecutiveInsights(datasetId: number): Promise<ExecutiveInsightsResponse> {
    const response = await apiClient.get<ExecutiveInsightsResponse>(
      `/ai/${datasetId}/insights`
    );
    return response.data;
  },

  /**
   * Send a natural language question about a dataset to the AI engine.
   */
  async askQuery(datasetId: number, question: string): Promise<AIQueryResponse> {
    const response = await apiClient.post<AIQueryResponse>('/ai/query', {
      dataset_id: datasetId,
      question,
    });
    return response.data;
  },

  /**
   * Retrieve past AI queries asked by the authenticated user.
   */
  async getQueryHistory(datasetId?: number): Promise<QueryHistoryItem[]> {
    const response = await apiClient.get<QueryHistoryItem[]>('/ai/history', {
      params: datasetId ? { dataset_id: datasetId } : undefined,
    });
    return response.data;
  },
};
