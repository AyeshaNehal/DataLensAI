import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { datasetService } from '../features/datasets/services/datasetService';
import {
  Database,
  Sparkles,
  Upload,
  BarChart3,
  ShieldCheck,
  Calendar,
  Mail,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Sample visual preview data for Phase 1 WOW factor
const sampleChartData = [
  { name: 'Mon', queries: 12, insights: 8 },
  { name: 'Tue', queries: 19, insights: 14 },
  { name: 'Wed', queries: 27, insights: 21 },
  { name: 'Thu', queries: 35, insights: 28 },
  { name: 'Fri', queries: 48, insights: 42 },
  { name: 'Sat', queries: 30, insights: 25 },
  { name: 'Sun', queries: 40, insights: 34 },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [datasetCount, setDatasetCount] = useState<number>(0);

  useEffect(() => {
    datasetService
      .getMyDatasets()
      .then((data) => setDatasetCount(data.length))
      .catch(() => setDatasetCount(0));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* Welcome Header Card */}
      <div className="relative overflow-hidden glass-card rounded-3xl p-8 border border-slate-700/50">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-brand-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-accent text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 1 Verified: Secure JWT Session Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back,{' '}
              <span className="gradient-text">
                {user?.full_name || user?.email.split('@')[0]}
              </span>
              !
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Your DataLensAI protected dashboard is live. You are securely authenticated with a JSON Web Token (JWT) over FastAPI.
            </p>
          </div>

          {/* Profile metadata pill box */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-dark-900/60 border border-slate-700/60 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Email Address</p>
                <p className="text-sm font-semibold text-slate-200">{user?.email}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-700/60 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Account Status</p>
                <p className="text-sm font-semibold text-emerald-400">Active & Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/datasets"
          className="glass-card rounded-2xl p-6 border border-slate-700/50 hover:border-brand-500/50 transition-all duration-200 flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Uploaded Datasets
            </p>
            <h3 className="text-3xl font-bold text-white mt-2">{datasetCount}</h3>
            <p className="text-xs text-brand-accent mt-1 flex items-center gap-1 group-hover:underline">
              <span>Manage Datasets</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
            <Database className="w-6 h-6" />
          </div>
        </Link>

        <div className="glass-card rounded-2xl p-6 border border-slate-700/50 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              AI Queries Asked
            </p>
            <h3 className="text-3xl font-bold text-white mt-2">0</h3>
            <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
              <span>Ready for Phase 4</span>
              <Sparkles className="w-3.5 h-3.5" />
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-700/50 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Member Since
            </p>
            <h3 className="text-lg font-bold text-white mt-2">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Just now'}
            </h3>
            <p className="text-xs text-emerald-400 mt-1">Session persisted</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Feature Preview Section (What comes next!) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CSV Upload Placeholder Card (Phase 2 Preview) */}
        <div className="glass-card rounded-3xl p-8 border border-slate-700/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-brand-400" />
                <span>CSV Dataset Ingestion</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-accent">
                Phase 2 Active
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Phase 2 is live! Upload tabular .csv datasets, inspect automatically profiled Pandas data types, and explore preview rows.
            </p>
          </div>

          <Link
            to="/datasets"
            className="block border-2 border-dashed border-slate-700/70 rounded-2xl p-10 text-center bg-dark-900/40 hover:border-brand-500 hover:bg-brand-500/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-100 group-hover:text-brand-accent transition-colors">
              Open CSV Dataset Studio →
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Upload .csv files up to 50MB and view interactive tables
            </p>
          </Link>
        </div>

        {/* AI Analytics Interactive Chart Preview (Phase 3 & 4 Preview) */}
        <div className="glass-card rounded-3xl p-8 border border-slate-700/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-accent" />
                <span>AI Query Activity Preview</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-accent">
                Recharts Live Demo
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              In Phase 3 & 4, your uploaded data will automatically generate interactive Recharts visualizations like this one.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleChartData}>
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748B"
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
                />
                <Bar dataKey="queries" radius={[6, 6, 0, 0]}>
                  {sampleChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === sampleChartData.length - 1 ? '#38BDF8' : '#6366F1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
