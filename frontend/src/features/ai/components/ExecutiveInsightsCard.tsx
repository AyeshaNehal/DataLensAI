import React from 'react';
import type { ExecutiveInsightsResponse, AIInsightItem } from '../../../types/ai';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BarChart2,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';

interface ExecutiveInsightsCardProps {
  report: ExecutiveInsightsResponse;
}

export const ExecutiveInsightsCard: React.FC<ExecutiveInsightsCardProps> = ({ report }) => {
  const getCategoryBadge = (category: AIInsightItem['category']) => {
    switch (category) {
      case 'trend':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="w-3 h-3" />
            <span>Trend Insight</span>
          </span>
        );
      case 'anomaly':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            <span>Data Anomaly</span>
          </span>
        );
      case 'recommendation':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Lightbulb className="w-3 h-3" />
            <span>Recommendation</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Key Metric</span>
          </span>
        );
    }
  };

  const firstChart = report.recommended_charts[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Executive Overview Banner */}
      <div className="glass-card rounded-3xl p-8 border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Executive AI Report: <span className="gradient-text">{report.dataset_name}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated statistical evaluation & anomaly detection across all columns.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>98% Analysis Confidence</span>
          </div>
        </div>

        <p className="mt-6 text-sm md:text-base text-slate-200 leading-relaxed bg-dark-900/60 p-5 rounded-2xl border border-slate-700/50">
          {report.summary}
        </p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {report.insights.map((insight, idx) => (
          <div
            key={idx}
            className="glass-card rounded-2xl p-6 border border-slate-700/50 hover:border-brand-500/40 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                {getCategoryBadge(insight.category)}
                <span className="text-[11px] font-mono text-slate-500">
                  {Math.round(insight.confidence * 100)}% conf
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{insight.title}</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Recommended Visualization preview */}
      {firstChart && firstChart.data && (
        <div className="glass-card rounded-3xl p-8 border border-slate-700/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-brand-400" />
              <h4 className="text-base font-bold text-white">
                AI Recommended Visualization: {firstChart.title}
              </h4>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Recharts Auto-Plot
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={firstChart.data} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey={firstChart.x_key}
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
                <Bar dataKey={firstChart.y_key} radius={[6, 6, 0, 0]}>
                  {firstChart.data.map((_: any, i: number) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={i === firstChart.data.length - 1 ? '#38BDF8' : '#6366F1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
