import React, { useState, useRef } from 'react';
import { datasetService } from '../services/datasetService';
import type { Dataset } from '../../../types/dataset';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X, Sparkles } from 'lucide-react';

interface CsvUploaderProps {
  onUploadSuccess: (dataset: Dataset) => void;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a valid .csv file.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds the 50MB limit.');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError(null);

    try {
      const newDataset = await datasetService.uploadCsv(
        selectedFile,
        description.trim() || undefined
      );
      setSelectedFile(null);
      setDescription('');
      onUploadSuccess(newDataset);
    } catch (err: any) {
      const msg =
        err.response?.data?.detail || 'Failed to upload dataset. Please try again.';
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 border border-slate-700/50 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-brand-400" />
            <span>Upload CSV Dataset</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            DataLensAI will automatically inspect data types, compute statistics, and profile columns.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-accent">
          <Sparkles className="w-3 h-3" />
          <span>FastAPI + Pandas Engine</span>
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
            : 'border-slate-700/70 bg-dark-900/40 hover:border-brand-500/50 hover:bg-dark-900/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileSelect(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 mx-auto flex items-center justify-center mb-4">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-200">
          Click to select or drag & drop your CSV file here
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Supports valid tabular .csv files up to 50MB
        </p>
      </div>

      {/* Selected File Card & Upload Button */}
      {selectedFile && (
        <div className="bg-dark-900/60 border border-slate-700/60 rounded-2xl p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB • CSV Document
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Dataset Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Q3 Sales & Revenue Metrics for Product A"
              className="w-full bg-dark-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full py-3 px-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Profiling & Uploading to PostgreSQL...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Upload and Profile Dataset</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
