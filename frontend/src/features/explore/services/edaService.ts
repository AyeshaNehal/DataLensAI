import { apiClient } from '../../../services/api';
import type {
  DatasetSummaryResponse,
  ColumnDistributionResponse,
  CorrelationMatrixResponse,
  CustomChartResponse,
} from '../../../types/eda';

export const edaService = {
  /**
   * Get complete statistical EDA summary for all dataset columns.
   */
  async getDatasetSummary(datasetId: number): Promise<DatasetSummaryResponse> {
    const response = await apiClient.get<DatasetSummaryResponse>(
      `/eda/${datasetId}/summary`
    );
    return response.data;
  },

  /**
   * Get binned histogram or categorical frequency data for a specific column.
   */
  async getColumnDistribution(
    datasetId: number,
    column: string,
    bins: number = 10
  ): Promise<ColumnDistributionResponse> {
    const response = await apiClient.get<ColumnDistributionResponse>(
      `/eda/${datasetId}/distribution`,
      {
        params: { column, bins },
      }
    );
    return response.data;
  },

  /**
   * Get Pearson correlation matrix for all numeric columns.
   */
  async getCorrelationMatrix(datasetId: number): Promise<CorrelationMatrixResponse> {
    const response = await apiClient.get<CorrelationMatrixResponse>(
      `/eda/${datasetId}/correlation`
    );
    return response.data;
  },

  /**
   * Get X-Y chart data for interactive chart studio.
   */
  async getCustomChartData(
    datasetId: number,
    xCol: string,
    yCol: string,
    chartType: string = 'bar',
    limit: number = 50
  ): Promise<CustomChartResponse> {
    const response = await apiClient.get<CustomChartResponse>(
      `/eda/${datasetId}/chart-data`,
      {
        params: { x_col: xCol, y_col: yCol, chart_type: chartType, limit },
      }
    );
    return response.data;
  },
};
