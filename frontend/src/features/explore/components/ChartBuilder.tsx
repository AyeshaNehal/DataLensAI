import React, { useState, useEffect } from 'react';
import type { DatasetSummaryResponse, CustomChartResponse } from '../../../types/eda';
import { edaService } from '../services/edaService';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Sliders, BarChart3, LineChart as LineIcon, Activity, Loader2, AlertCircle } from 'lucide-react';

interface ChartBuilderProps {
  datasetId: number;
  summary: DatasetSummaryResponse;
}

export const ChartBuilder: React.FC<ChartBuilderProps> = ({ datasetId, summary }) => {
  const allCols = summary.columns.map((c) => c.name);
  const numCols = summary.columns
    .filter((c) => c.type.toLowerCase().includes('int') || c.type.toLowerCase().includes('float'))
    .map((c) => c.name);

  const [xCol, setXCol] = useState<string>(allCols[0] || '');
  const [yCol, setYCol] = useState<string>(numCols[0] || allCols[1] || allCols[0] || '');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [chartData, setChartData] = useState<CustomChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!xCol || !yCol) return;
    setIsLoading(true);
    setError(null);

    edaService
      .getCustomChartData(datasetId, xCol, yCol, chartType, 50)
      .then((res) => setChartData(res))
      .catch(() => setError('Failed to generate chart data for selected columns.'))
      .finally(() => setIsLoading(false));
  }, [datasetId, xCol, yCol, chartType]);

  return (
    <div className="glass-card rounded-3xl p-8 border border-slate-700/50 space-y-6 animate-fade-in">
      {/* Control Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-accent" />
            <h3 className="text-xl font-bold text-white">
              Interactive <span className="gradient-text">Chart Studio</span>
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Pick any X and Y variables from your dataset to generate real-time Recharts visualizations.
          </p>
        </div>

        {/* Dropdown Selectors */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              X Axis (Category / Dimension)
            </label>
            <select
              value={xCol}
              onChange={(e) => setXCol(e.target.value)}
              className="block bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
            >
              {allCols.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Y Axis (Metric / Value)
            </label>
            <select
              value={yCol}
              onChange={(e) => setYCol(e.target.value)}
              className="block bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
            >
              {allCols.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Chart Type Toggle Pill */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Chart Style
            </label>
            <div className="flex items-center bg-dark-900 border border-slate-700/80 rounded-xl p-1">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  chartType === 'bar'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Bar</span>
              </button>

              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  chartType === 'line'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LineIcon className="w-3.5 h-3.5" />
                <span>Line</span>
              </button>

              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  chartType === 'area'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Area</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Recharts Render Canvas */}
      <div className="h-80 w-full">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            <p className="text-sm font-medium">Computing live Pandas chart coordinates...</p>
          </div>
        ) : !chartData || chartData.data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No chart data available for selected columns.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData.data} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E2336',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey={yCol} radius={[6, 6, 0, 0]}>
                  {chartData.data.map((_, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={idx === chartData.data.length - 1 ? '#38BDF8' : '#6366F1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={chartData.data} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E2336',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={yCol}
                  stroke="#38BDF8"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366F1' }}
                  activeDot={{ r: 7, fill: '#38BDF8' }}
                />
              </LineChart>
            ) : (
              <AreaChart data={chartData.data} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E2336',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={yCol}
                  stroke="#6366F1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorArea)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
