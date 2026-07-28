import React from 'react';
import type { Dataset } from '../../../types/dataset';
import { FileText, Trash2, Eye, Calendar, HardDrive, Columns, Rows } from 'lucide-react';

interface DatasetCardProps {
  dataset: Dataset;
  onInspect: (dataset: Dataset) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({
  dataset,
  onInspect,
  onDelete,
  isDeleting,
}) => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-200 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600/30 to-indigo-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white hover:text-brand-accent transition-colors">
                {dataset.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {dataset.description || 'No description provided'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onDelete(dataset.id)}
            disabled={isDeleting}
            title="Delete dataset"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Dimension Pill Badges */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <div className="bg-dark-900/60 border border-slate-700/50 rounded-xl p-2.5 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center justify-center gap-1">
              <Rows className="w-3 h-3 text-brand-400" />
              Rows
            </span>
            <p className="text-sm font-bold text-slate-200 mt-0.5">
              {dataset.row_count.toLocaleString()}
            </p>
          </div>

          <div className="bg-dark-900/60 border border-slate-700/50 rounded-xl p-2.5 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center justify-center gap-1">
              <Columns className="w-3 h-3 text-indigo-400" />
              Columns
            </span>
            <p className="text-sm font-bold text-slate-200 mt-0.5">
              {dataset.column_count}
            </p>
          </div>

          <div className="bg-dark-900/60 border border-slate-700/50 rounded-xl p-2.5 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center justify-center gap-1">
              <HardDrive className="w-3 h-3 text-emerald-400" />
              Size
            </span>
            <p className="text-sm font-bold text-slate-200 mt-0.5">
              {(dataset.file_size_bytes / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {new Date(dataset.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <button
          onClick={() => onInspect(dataset)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-accent font-semibold rounded-lg border border-brand-500/30 transition-all duration-200 hover:scale-[1.02]"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Inspect Table</span>
        </button>
      </div>
    </div>
  );
};
