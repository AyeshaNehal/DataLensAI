import React, { useState, useEffect } from 'react';
import type { Dataset } from '../types/dataset';
import type {
  DatasetSummaryResponse,
  ColumnDistributionResponse,
  CorrelationMatrixResponse,
} from '../types/eda';
import { datasetService } from '../features/datasets/services/datasetService';
import { edaService } from '../features/explore/services/edaService';
import { SummaryStatsGrid } from '../features/explore/components/SummaryStatsGrid';
import { DistributionViewer } from '../features/explore/components/DistributionViewer';
import { CorrelationViewer } from '../features/explore/components/CorrelationViewer';
import { ChartBuilder } from '../features/explore/components/ChartBuilder';
import {
  BarChart2,
  Loader2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExplorePage: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null);
  const [summary, setSummary] = useState<DatasetSummaryResponse | null>(null);
  const [distribution, setDistribution] = useState<ColumnDistributionResponse | null>(null);
  const [correlation, setCorrelation] = useState<CorrelationMatrixResponse | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user datasets on mount
  useEffect(() => {
    setIsLoading(true);
    datasetService
      .getMyDatasets()
      .then((data) => {
        setDatasets(data);
        if (data.length > 0) {
          setSelectedDatasetId(data[0].id);
        }
      })
      .catch(() => setError('Failed to load datasets. Please check authentication.'))
      .finally(() => setIsLoading(false));
  }, []);

  // When selectedDatasetId changes, load summary & correlation matrix
  useEffect(() => {
    if (!selectedDatasetId) return;
    setIsLoading(true);
    setError(null);

    Promise.all([
      edaService.getDatasetSummary(selectedDatasetId),
      edaService.getCorrelationMatrix(selectedDatasetId),
    ])
      .then(([summaryRes, corrRes]) => {
        setSummary(summaryRes);
        setCorrelation(corrRes);

        // Select first column by default for distribution viewer
        if (summaryRes.columns.length > 0) {
          setSelectedColumn(summaryRes.columns[0].name);
        }
      })
      .catch(() => setError('Failed to perform EDA profiling on selected dataset.'))
      .finally(() => setIsLoading(false));
  }, [selectedDatasetId]);

  // When selectedColumn changes, load distribution bins
  useEffect(() => {
    if (!selectedDatasetId || !selectedColumn) return;

    edaService
      .getColumnDistribution(selectedDatasetId, selectedColumn, 12)
      .then((res) => setDistribution(res))
      .catch(() => setDistribution(null));
  }, [selectedDatasetId, selectedColumn]);

  if (isLoading && datasets.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
        <p className="text-sm font-semibold">Loading interactive EDA workspace...</p>
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6 animate-fade-in">
        <div className="glass-card rounded-3xl p-10 border border-slate-700/50 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mx-auto flex items-center justify-center">
            <BarChart2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">No Datasets Ready for Exploration</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You need to upload at least one .csv file in the Dataset Studio before running Pandas
            EDA and visual charting.
          </p>
          <Link
            to="/datasets"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-brand-500/20 transition-all"
          >
            <span>Go to CSV Dataset Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* Header & Dataset Selector Bar */}
      <div className="glass-card rounded-3xl p-6 border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <BarChart2 className="w-7 h-7 text-brand-400" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Data Exploration <span className="gradient-text">& Visual EDA</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Pandas-driven statistical profiling, histogram distributions, correlation matrices, and
            Recharts studio.
          </p>
        </div>

        {/* Dataset Selection Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Active Dataset:
          </label>
          <select
            value={selectedDatasetId ?? ''}
            onChange={(e) => setSelectedDatasetId(Number(e.target.value))}
            className="bg-dark-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-brand-500 shadow-sm"
          >
            {datasets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.row_count} rows)
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {summary && (
        <>
          {/* Summary Statistics Grid */}
          <SummaryStatsGrid
            summary={summary}
            selectedColumn={selectedColumn}
            onSelectColumn={(col) => setSelectedColumn(col)}
          />

          {/* Column Histogram / Distribution Chart */}
          {distribution && <DistributionViewer distribution={distribution} />}

          {/* Interactive Recharts Studio */}
          <ChartBuilder datasetId={selectedDatasetId!} summary={summary} />

          {/* Correlation Matrix */}
          {correlation && <CorrelationViewer matrixData={correlation} />}
        </>
      )}
    </div>
  );
};
