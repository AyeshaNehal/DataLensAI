import React, { useState } from 'react';
import type { AIQueryResponse } from '../../../types/ai';
import { aiService } from '../services/aiService';
import {
  Send,
  Loader2,
  Code2,
  Copy,
  Check,
  BarChart2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
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
  Cell,
  CartesianGrid,
} from 'recharts';

interface NaturalLanguageQueryBoxProps {
  datasetId: number;
  onQuerySuccess?: (newQuery: AIQueryResponse) => void;
}

const SAMPLE_QUESTIONS = [
  'Which category generated the highest revenue?',
  'What is the average value across all records?',
  'Is there a correlation between the top two numeric metrics?',
  'Show me a breakdown of the top 10 rows',
];

export const NaturalLanguageQueryBox: React.FC<NaturalLanguageQueryBoxProps> = ({
  datasetId,
  onQuerySuccess,
}) => {
  const [question, setQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<AIQueryResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await aiService.askQuery(datasetId, question.trim());
      setLastResponse(res);
      if (onQuerySuccess) {
        onQuerySuccess(res);
      }
    } catch (err) {
      setError('Failed to get an AI response for your question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderChart = (chartConfig: AIQueryResponse['chart_config']) => {
    if (!chartConfig || !chartConfig.data || chartConfig.data.length === 0) {
      return null;
    }

    return (
      <div className="glass-card rounded-2xl p-6 border border-slate-700/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-brand-400" />
            <h5 className="text-sm font-bold text-white">
              AI Visualization: {chartConfig.title}
            </h5>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            {chartConfig.chart_type.toUpperCase()}
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartConfig.chart_type === 'bar' ? (
              <BarChart data={chartConfig.data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey={chartConfig.x_key}
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
                <Bar dataKey={chartConfig.y_key} radius={[6, 6, 0, 0]}>
                  {chartConfig.data.map((_, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={idx === chartConfig.data!.length - 1 ? '#38BDF8' : '#6366F1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : chartConfig.chart_type === 'line' ? (
              <LineChart data={chartConfig.data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey={chartConfig.x_key}
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
                  dataKey={chartConfig.y_key}
                  stroke="#38BDF8"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366F1' }}
                />
              </LineChart>
            ) : (
              <AreaChart data={chartConfig.data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="aiAreaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey={chartConfig.x_key}
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
                  dataKey={chartConfig.y_key}
                  stroke="#6366F1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#aiAreaColor)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card rounded-3xl p-8 border border-slate-700/50 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-400" />
            <h3 className="text-xl font-bold text-white">
              Ask Your Data <span className="gradient-text">In Natural Language</span>
            </h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Type any question to get instant executive answers, Pandas code, and custom plots.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Which category generated the highest revenue in this dataset?"
            className="w-full bg-dark-900 border border-slate-700 rounded-2xl px-5 py-4 pr-32 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="absolute right-2.5 top-2.5 bottom-2.5 px-5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all shadow-md shadow-brand-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Sample Question Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase mr-1">
            Try asking:
          </span>
          {SAMPLE_QUESTIONS.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuestion(sq);
              }}
              className="px-3 py-1 rounded-full bg-dark-800 hover:bg-dark-700 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Answer Card */}
      {lastResponse && (
        <div className="space-y-6 pt-4 border-t border-slate-800 animate-fade-in">
          <div className="bg-dark-900/80 border border-slate-700/60 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">
                AI Answer
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {new Date(lastResponse.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-base text-white leading-relaxed font-medium">
              {lastResponse.answer}
            </p>
          </div>

          {/* Generated Python/Pandas Code Snippet */}
          {lastResponse.generated_code && (
            <div className="bg-dark-950 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="bg-dark-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Generated Python / Pandas Code
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(lastResponse.generated_code!)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-700 text-xs text-slate-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                <code>{lastResponse.generated_code}</code>
              </pre>
            </div>
          )}

          {/* Render Recharts if available */}
          {renderChart(lastResponse.chart_config)}
        </div>
      )}
    </div>
  );
};
