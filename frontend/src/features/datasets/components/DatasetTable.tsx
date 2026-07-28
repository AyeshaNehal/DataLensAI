import React from 'react';
import type { DatasetPreview } from '../../../types/dataset';
import { Hash, Type, Calendar, Sparkles } from 'lucide-react';

interface DatasetTableProps {
  preview: DatasetPreview;
}

export const DatasetTable: React.FC<DatasetTableProps> = ({ preview }) => {
  const { dataset, preview_rows } = preview;

  const getColumnIcon = (typeStr: string) => {
    const t = typeStr.toLowerCase();
    if (t.includes('int') || t.includes('float')) {
      return <Hash className="w-3.5 h-3.5 text-brand-400" />;
    }
    if (t.includes('date') || t.includes('time')) {
      return <Calendar className="w-3.5 h-3.5 text-emerald-400" />;
    }
    return <Type className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <div className="glass-card rounded-3xl border border-slate-700/50 overflow-hidden space-y-4 animate-fade-in">
      {/* Table Header Bar */}
      <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{dataset.name}</h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-accent">
              Preview Mode (50 rows)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total dimensions: <strong className="text-slate-200">{dataset.row_count} rows</strong> ×{' '}
            <strong className="text-slate-200">{dataset.column_count} columns</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-dark-900/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
          <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
          <span>Pandas Inferred Types Active</span>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Table */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-900/80 border-b border-slate-800 text-xs font-semibold text-slate-300 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md">
              <th className="py-3.5 px-4 text-slate-500 font-mono w-12 text-center">#</th>
              {dataset.columns.map((col, idx) => (
                <th key={idx} className="py-3.5 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getColumnIcon(col.type)}
                    <span className="text-slate-200">{col.name}</span>
                    <span className="text-[10px] lowercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {col.type}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {preview_rows.length === 0 ? (
              <tr>
                <td
                  colSpan={dataset.columns.length + 1}
                  className="py-12 text-center text-slate-500"
                >
                  No preview rows available for this dataset.
                </td>
              </tr>
            ) : (
              preview_rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-brand-500/5 transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-center font-mono text-xs text-slate-500">
                    {rowIdx + 1}
                  </td>
                  {dataset.columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="py-3 px-6 whitespace-nowrap text-slate-300 font-mono text-xs"
                    >
                      {row[col.name] !== null && row[col.name] !== undefined
                        ? String(row[col.name])
                        : <span className="text-slate-600 italic">null</span>}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
