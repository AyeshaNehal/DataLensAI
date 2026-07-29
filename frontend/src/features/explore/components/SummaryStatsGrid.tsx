import React from 'react';
import type { DatasetSummaryResponse } from '../../../types/eda';
import { Hash, Type, AlertTriangle, CheckCircle, BarChart3, Database } from 'lucide-react';

interface SummaryStatsGridProps {
  summary: DatasetSummaryResponse;
  selectedColumn: string | null;
  onSelectColumn: (colName: string) => void;
}

export const SummaryStatsGrid: React.FC<SummaryStatsGridProps> = ({
  summary,
  selectedColumn,
  onSelectColumn,
}) => {
  const { columns, row_count, column_count } = summary;

  const isNumeric = (typeStr: string) => {
    const t = typeStr.toLowerCase();
    return t.includes('int') || t.includes('float');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-white">{summary.dataset_name}</h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-accent">
              Pandas EDA Summary
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Profiling <strong className="text-slate-200">{row_count.toLocaleString()} rows</strong> ×{' '}
            <strong className="text-slate-200">{column_count} columns</strong> across numeric and categorical types.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-dark-900/60 px-3.5 py-2 rounded-xl border border-slate-700/60 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-accent" />
          <span>Click any column card below to plot its distribution</span>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {columns.map((col) => {
          const num = isNumeric(col.type);
          const active = selectedColumn === col.name;

          return (
            <div
              key={col.name}
              onClick={() => onSelectColumn(col.name)}
              className={`cursor-pointer glass-card rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                active
                  ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10 scale-[1.01]'
                  : 'border-slate-700/50 hover:border-slate-600 hover:bg-dark-800/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {num ? (
                      <Hash className="w-4 h-4 text-brand-400 shrink-0" />
                    ) : (
                      <Type className="w-4 h-4 text-indigo-400 shrink-0" />
                    )}
                    <h4 className="text-sm font-bold text-white truncate max-w-[160px]">
                      {col.name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono lowercase px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700">
                    {col.type}
                  </span>
                </div>

                {/* Missing & Distinct Info Bar */}
                <div className="flex items-center justify-between mt-3 text-xs text-slate-400 pb-3 border-b border-slate-800/80">
                  <span>
                    Distinct: <strong className="text-slate-200">{col.distinct_count}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    {col.missing_count > 0 ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span
                      className={
                        col.missing_count > 0 ? 'text-amber-400 font-semibold' : 'text-slate-400'
                      }
                    >
                      {col.missing_count > 0
                        ? `${col.missing_percentage}% missing`
                        : '0 missing'}
                    </span>
                  </span>
                </div>

                {/* Statistical Details */}
                <div className="mt-3 text-xs space-y-1.5 font-mono">
                  {num ? (
                    <>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500">Mean / Avg:</span>
                        <span>{col.mean ?? 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500">Median (50%):</span>
                        <span>{col.median ?? 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500">Std Dev:</span>
                        <span>{col.std ?? 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1">
                        <span>Min: {col.min ?? 'N/A'}</span>
                        <span>Max: {col.max ?? 'N/A'}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500">Top Value:</span>
                        <span className="font-sans font-semibold truncate max-w-[140px] text-brand-300">
                          {col.top_value ?? 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500">Frequency:</span>
                        <span>{col.top_count?.toLocaleString() ?? '0'} rows</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] text-right text-brand-accent font-semibold flex items-center justify-end gap-1">
                <span>{active ? 'Currently Plotting' : 'Click to Plot'}</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
