import React, { useState, useEffect } from 'react';
import type { Dataset } from '../types/dataset';
import type { ExecutiveInsightsResponse } from '../types/ai';
import { datasetService } from '../features/datasets/services/datasetService';
import { aiService } from '../features/ai/services/aiService';
import { ExecutiveInsightsCard } from '../features/ai/components/ExecutiveInsightsCard';
import { NaturalLanguageQueryBox } from '../features/ai/components/NaturalLanguageQueryBox';
import { QueryHistoryList } from '../features/ai/components/QueryHistoryList';
import { Sparkles, Loader2, AlertCircle, ArrowRight, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AIInsightsPage: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null);
  const [report, setReport] = useState<ExecutiveInsightsResponse | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [historyTrigger, setHistoryTrigger] = useState<number>(0);

  // Load datasets on mount
  useEffect(() => {
    datasetService
      .getMyDatasets()
      .then((data) => {
        setDatasets(data);
        if (data.length > 0) {
          setSelectedDatasetId(data[0].id);
        }
      })
      .catch(() => setReportError('Failed to load datasets. Please check authentication.'));
  }, []);

  // When selected dataset changes, load Executive AI Report
  useEffect(() => {
    if (!selectedDatasetId) return;
    setIsLoadingReport(true);
    setReportError(null);

    aiService
      .getExecutiveInsights(selectedDatasetId)
      .then((res) => setReport(res))
      .catch(() => setReportError('Failed to generate Executive AI report for selected dataset.'))
      .finally(() => setIsLoadingReport(false));
  }, [selectedDatasetId]);

  if (datasets.length === 0 && !reportError) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
        <p className="text-sm font-semibold">Initializing AI Analyst workspace...</p>
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6 animate-fade-in">
        <div className="glass-card rounded-3xl p-10 border border-slate-700/50 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mx-auto flex items-center justify-center">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">No Datasets Ready for AI Analyst</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Upload a .csv file in the Dataset Studio to generate automated AI executive summaries
            and natural language answers.
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
            <Sparkles className="w-7 h-7 text-brand-400" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              AI Analyst <span className="gradient-text">& Natural Language Queries</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Automated executive insight report, outlier detection, and natural language query engine.
          </p>
        </div>

        {/* Dataset Selector */}
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

      {reportError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{reportError}</span>
        </div>
      )}

      {/* 1. Automated Executive AI Report Card */}
      {isLoadingReport ? (
        <div className="glass-card rounded-3xl p-12 border border-slate-700/50 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <span className="text-sm font-semibold">
            AI is analyzing dataset schema, correlations, and anomalies...
          </span>
        </div>
      ) : report ? (
        <ExecutiveInsightsCard report={report} />
      ) : null}

      {/* 2. Natural Language Query Engine */}
      {selectedDatasetId && (
        <NaturalLanguageQueryBox
          datasetId={selectedDatasetId}
          onQuerySuccess={() => setHistoryTrigger((prev) => prev + 1)}
        />
      )}

      {/* 3. Query History Log */}
      {selectedDatasetId && (
        <QueryHistoryList datasetId={selectedDatasetId} refreshTrigger={historyTrigger} />
      )}
    </div>
  );
};
