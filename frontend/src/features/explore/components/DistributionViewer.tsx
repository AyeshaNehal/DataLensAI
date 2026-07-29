import React from 'react';
import type { ColumnDistributionResponse } from '../../../types/eda';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { BarChart2, Sparkles } from 'lucide-react';

interface DistributionViewerProps {
  distribution: ColumnDistributionResponse;
}

export const DistributionViewer: React.FC<DistributionViewerProps> = ({ distribution }) => {
  const { column_name, column_type, total_count, bins } = distribution;

  const isNumeric = (typeStr: string) => {
    const t = typeStr.toLowerCase();
    return t.includes('int') || t.includes('float');
  };

  return (
    <div className="glass-card rounded-3xl p-8 border border-slate-700/50 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-brand-400" />
            <h3 className="text-xl font-bold text-white">
              Distribution: <span className="gradient-text">{column_name}</span>
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {column_type}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {isNumeric(column_type)
              ? 'Binned numeric histogram showing frequency density across value ranges.'
              : 'Top category frequencies across dataset rows.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-accent">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{total_count.toLocaleString()} valid samples</span>
        </div>
      </div>

      {/* Recharts BarChart */}
      <div className="h-72 w-full pt-4">
        {bins.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No data available to plot for this column.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bins} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E2336',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                formatter={(value: any, _name: any, props: any) => [
                  `${value} rows (${props.payload.percentage}%)`,
                  'Frequency',
                ]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {bins.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === bins.length - 1 ? '#38BDF8' : '#6366F1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
