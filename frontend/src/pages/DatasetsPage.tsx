import React, { useState, useEffect } from 'react';
import { datasetService } from '../features/datasets/services/datasetService';
import type { Dataset, DatasetPreview } from '../types/dataset';
import { CsvUploader } from '../features/datasets/components/CsvUploader';
import { DatasetCard } from '../features/datasets/components/DatasetCard';
import { DatasetTable } from '../features/datasets/components/DatasetTable';
import { Database, Plus, Table, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export const DatasetsPage: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Active dataset preview state for table inspection
  const [activePreview, setActivePreview] = useState<DatasetPreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [showUploader, setShowUploader] = useState<boolean>(false);

  const fetchDatasets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await datasetService.getMyDatasets();
      setDatasets(data);
    } catch (err: any) {
      setError('Could not load datasets. Please check your session.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleUploadSuccess = (newDataset: Dataset) => {
    setDatasets((prev) => [newDataset, ...prev]);
    setShowUploader(false);
    handleInspect(newDataset);
  };

  const handleInspect = async (dataset: Dataset) => {
    setIsLoadingPreview(true);
    setError(null);
    try {
      const previewData = await datasetService.getDatasetPreview(dataset.id);
      setActivePreview(previewData);
    } catch (err: any) {
      setError('Could not fetch dataset preview rows.');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this dataset and its raw CSV file?')) {
      return;
    }
    setDeletingId(id);
    try {
      await datasetService.deleteDataset(id);
      setDatasets((prev) => prev.filter((d) => d.id !== id));
      if (activePreview?.dataset.id === id) {
        setActivePreview(null);
      }
    } catch (err: any) {
      alert('Could not delete dataset.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Dataset <span className="gradient-text">Management</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Upload, store, and inspect your tabular CSV datasets with FastAPI & Pandas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activePreview && (
            <button
              onClick={() => setActivePreview(null)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-dark-800 border border-slate-700 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Datasets</span>
            </button>
          )}

          <button
            onClick={() => {
              setActivePreview(null);
              setShowUploader((prev) => !prev);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-brand-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{showUploader ? 'Close Uploader' : 'Upload New CSV'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* CSV Uploader Collapsible */}
      {showUploader && (
        <CsvUploader onUploadSuccess={handleUploadSuccess} />
      )}

      {/* Active Table Preview Section */}
      {isLoadingPreview ? (
        <div className="glass-card rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-sm font-medium">Loading Pandas schema & preview rows...</p>
        </div>
      ) : activePreview ? (
        <DatasetTable preview={activePreview} />
      ) : null}

      {/* Datasets Grid */}
      {!activePreview && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-400" />
              <span>Your Uploaded Datasets ({datasets.length})</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="glass-card rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-sm font-medium">Loading your datasets from PostgreSQL...</p>
            </div>
          ) : datasets.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center space-y-4 border border-slate-700/50">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-400 mx-auto flex items-center justify-center">
                <Table className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">No datasets uploaded yet</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                  Click the "Upload New CSV" button above to ingest your first dataset and inspect its column schema!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasets.map((d) => (
                <DatasetCard
                  key={d.id}
                  dataset={d}
                  onInspect={handleInspect}
                  onDelete={handleDelete}
                  isDeleting={deletingId === d.id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
