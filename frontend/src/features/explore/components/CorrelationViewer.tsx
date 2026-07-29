import React from 'react';
import type { CorrelationMatrixResponse } from '../../../types/eda';
import { Grid, Sparkles, AlertCircle } from 'lucide-react';

interface CorrelationViewerProps {
  matrixData: CorrelationMatrixResponse;
}

export const CorrelationViewer: React.FC<CorrelationViewerProps> = ({ matrixData }) => {
  const { columns, matrix } = matrixData;

  // Helper to find correlation value between X and Y
  const getCorrelation = (xCol: string, yCol: string): number => {
    const cell = matrix.find((c) => c.x === xCol && c.y === yCol);
    return cell ? cell.value : 0;
  };

  // Helper to get color style based on Pearson r (-1.0 to 1.0)
  const getCellColorClass = (val: number): string => {
    if (val === 1) return 'bg-brand-600 text-white font-bold';
    if (val > 0.7) return 'bg-brand-500/80 text-white font-semibold';
    if (val > 0.4) return 'bg-brand-500/50 text-slate-100';
    if (val > 0.1) return 'bg-brand-500/25 text-slate-300';
    if (val < -0.7) return 'bg-rose-600/80 text-white font-semibold';
    if (val < -0.4) return 'bg-rose-500/50 text-slate-100';
    if (val < -0.1) return 'bg-rose-500/25 text-slate-300';
    return 'bg-dark-900/60 text-slate-400';
  };

  if (columns.length < 2) {
    return (
      <div className="glass-card rounded-3xl p-8 border border-slate-700/50 flex items-center justify-center gap-3 text-slate-400 text-sm">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          A correlation matrix requires at least 2 numeric columns with variance.
        </span>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 border border-slate-700/50 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">
              Pairwise Pearson <span className="gradient-text">Correlation Matrix</span>
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Visualizing linear relationships between numeric columns (-1.0 to +1.0).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{columns.length} numeric dimensions</span>
        </div>
      </div>

      {/* Responsive Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center text-xs font-mono">
          <thead>
            <tr>
              <th className="p-3 bg-dark-900/80 border border-slate-800 text-slate-400 font-sans">
                Variable
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="p-3 bg-dark-900/80 border border-slate-800 text-slate-200 font-sans truncate max-w-[120px]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {columns.map((rowCol) => (
              <tr key={rowCol}>
                <th className="p-3 bg-dark-900/80 border border-slate-800 text-slate-200 font-sans text-left truncate max-w-[120px]">
                  {rowCol}
                </th>
                {columns.map((colCol) => {
                  const val = getCorrelation(rowCol, colCol);
                  return (
                    <td
                      key={colCol}
                      title={`Correlation between ${rowCol} and ${colCol}: ${val}`}
                      className={`p-3.5 border border-slate-800/80 transition-transform duration-150 hover:scale-105 cursor-default ${getCellColorClass(
                        val
                      )}`}
                    >
                      {val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
