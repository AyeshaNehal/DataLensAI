import React, { useState, useEffect } from 'react';
import type { QueryHistoryItem } from '../../../types/ai';
import { aiService } from '../services/aiService';
import { History, MessageSquare, ChevronDown, ChevronUp, Code2, Loader2 } from 'lucide-react';

interface QueryHistoryListProps {
  datasetId: number;
  refreshTrigger?: number;
}

export const QueryHistoryList: React.FC<QueryHistoryListProps> = ({
  datasetId,
  refreshTrigger = 0,
}) => {
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    aiService
      .getQueryHistory(datasetId)
      .then((data) => setHistory(data))
      .catch(() => setHistory([]))
      .finally(() => setIsLoading(false));
  }, [datasetId, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 border border-slate-700/50 flex items-center justify-center gap-3 text-slate-400 text-sm">
        <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
        <span>Loading AI query log...</span>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 border border-slate-700/50 text-center space-y-2">
        <History className="w-8 h-8 text-slate-500 mx-auto" />
        <h4 className="text-base font-bold text-white">No AI Query History Yet</h4>
        <p className="text-xs text-slate-400">
          Ask your first question above to start recording your AI analytics trail.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 border border-slate-700/50 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-brand-400" />
          <h4 className="text-lg font-bold text-white">
            AI Query <span className="gradient-text">History Trail</span>
          </h4>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {history.length} {history.length === 1 ? 'question' : 'questions'} logged
        </span>
      </div>

      <div className="space-y-3">
        {history.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-dark-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full flex items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-brand-400 shrink-0" />
                  <span className="text-sm font-bold text-white line-clamp-1">
                    {item.question}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-3 text-sm animate-fade-in">
                  <p className="text-slate-200 leading-relaxed bg-dark-950 p-3.5 rounded-xl border border-slate-800/80">
                    {item.answer}
                  </p>
                  {item.generated_code && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <Code2 className="w-3.5 h-3.5 text-brand-400" />
                        <span>SQL / Pandas Logic</span>
                      </div>
                      <pre className="bg-dark-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
                        <code>{item.generated_code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
