import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

/* ───────── helpers ───────────────────────────────────────── */
const STATUS_COLORS: Record<string, { fill: string; bg: string; text: string }> = {
  New:       { fill: '#3b82f6', bg: 'bg-blue-100 dark:bg-blue-900/30',     text: 'text-blue-700 dark:text-blue-300' },
  Contacted: { fill: '#f59e0b', bg: 'bg-amber-100 dark:bg-amber-900/30',   text: 'text-amber-700 dark:text-amber-300' },
  Qualified: { fill: '#10b981', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
  Lost:      { fill: '#ef4444', bg: 'bg-red-100 dark:bg-red-900/30',       text: 'text-red-700 dark:text-red-300' },
};

const SOURCE_COLORS = ['#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626'];

/* ── Donut chart ─────────────────────────────────────────── */
interface DonutSlice { label: string; value: number; fill: string }
const DonutChart: React.FC<{ slices: DonutSlice[]; total: number }> = ({ slices, total }) => {
  const r = 70, cx = 90, cy = 90, strokeWidth = 28;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = slices.map((s) => {
    const fraction = total > 0 ? s.value / total : 0;
    const dash = fraction * circumference;
    const gap = circumference - dash;
    const seg = { ...s, dash, gap, offset };
    offset += dash;
    return seg;
  });

  return (
    <svg viewBox="0 0 180 180" className="w-40 h-40">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-100 dark:text-slate-700" />
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={seg.fill}
          strokeWidth={strokeWidth}
          strokeDasharray={`${seg.dash} ${seg.gap}`}
          strokeDashoffset={-seg.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          className="transition-all duration-700"
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-slate-900 dark:fill-white" fontSize="20" fontWeight="bold">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" className="fill-slate-500" fontSize="10">Total</text>
    </svg>
  );
};

/* ── Horizontal bar chart ────────────────────────────────── */
const HBar: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className="text-xs text-slate-500 dark:text-slate-400 w-20 shrink-0 truncate">{label}</span>
    <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: max > 0 ? `${(value / max) * 100}%` : '0%', background: color }}
      />
    </div>
    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-6 text-right">{value}</span>
  </div>
);

/* ── Mini sparkline (SVG) ────────────────────────────────── */
const Sparkline: React.FC<{ points: number[]; color?: string }> = ({ points, color = '#7c3aed' }) => {
  if (points.length < 2) return null;
  const max = Math.max(...points, 1);
  const w = 200, h = 50, n = points.length;
  const xs = points.map((_, i) => (i / (n - 1)) * w);
  const ys = points.map((v) => h - (v / max) * (h - 4) - 2);
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const area = `${path} L${xs[n - 1]},${h} L${xs[0]},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-12">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sg)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ───────── main page ─────────────────────────────────────── */
const AnalyticsPage: React.FC = () => {
  const { data: raw, isLoading } = useQuery({
    queryKey: ['analytics-leads'],
    queryFn: async () => {
      const res = await axiosInstance.get('/leads?limit=1000');
      return res.data.leads as any[];
    },
  });

  const analytics = useMemo(() => {
    if (!raw) return null;

    /* status counts */
    const statusCount: Record<string, number> = {};
    raw.forEach((l) => {
      statusCount[l.status] = (statusCount[l.status] || 0) + 1;
    });

    /* source counts */
    const sourceCount: Record<string, number> = {};
    raw.forEach((l) => {
      sourceCount[l.source] = (sourceCount[l.source] || 0) + 1;
    });

    /* leads per day (last 14 days) */
    const today = new Date();
    const dayMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dayMap[d.toISOString().split('T')[0]] = 0;
    }
    raw.forEach((l) => {
      const day = l.createdAt?.split('T')[0];
      if (day && dayMap[day] !== undefined) dayMap[day]++;
    });
    const trendPoints = Object.values(dayMap);
    const trendLabels = Object.keys(dayMap).map((d) => {
      const [, , dd] = d.split('-');
      return dd;
    });

    /* conversion rate */
    const qualified = statusCount['Qualified'] || 0;
    const convRate = raw.length > 0 ? ((qualified / raw.length) * 100).toFixed(1) : '0.0';

    return { statusCount, sourceCount, trendPoints, trendLabels, convRate, total: raw.length };
  }, [raw]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!analytics) return null;

  const { statusCount, sourceCount, trendPoints, trendLabels, convRate, total } = analytics;
  const donutSlices = Object.entries(statusCount).map(([label, value]) => ({
    label,
    value,
    fill: STATUS_COLORS[label]?.fill ?? '#94a3b8',
  }));
  const maxSource = Math.max(...Object.values(sourceCount), 1);

  const kpis = [
    { label: 'Total Leads',    value: total,                      icon: Users,       color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Qualified',      value: statusCount['Qualified']??0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Conversion Rate',value: `${convRate}%`,             icon: TrendingUp,  color: 'text-violet-600',  bg: 'bg-violet-50 dark:bg-violet-900/20' },
    { label: 'Lost',           value: statusCount['Lost']??0,     icon: XCircle,     color: 'text-rose-600',    bg: 'bg-rose-50 dark:bg-rose-900/20' },
  ];

  return (
    <div className="space-y-8">
      {/* header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Visual overview of your entire lead pipeline.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className={`${k.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <k.icon className={`w-5 h-5 ${k.color}`} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">{k.label}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Trend + Donut */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* sparkline trend */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Leads Over Time</h3>
          <p className="text-xs text-slate-500 mb-4">Last 14 days</p>
          <Sparkline points={trendPoints} color="#7c3aed" />
          <div className="flex justify-between mt-2">
            {trendLabels.filter((_, i) => i % 2 === 0).map((d) => (
              <span key={d} className="text-[10px] text-slate-400">{d}</span>
            ))}
          </div>
        </div>

        {/* donut + legend */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Status Breakdown</h3>
          <p className="text-xs text-slate-500 mb-4">Distribution across all statuses</p>
          <div className="flex items-center gap-6">
            <DonutChart slices={donutSlices} total={total} />
            <div className="flex-1 space-y-2">
              {donutSlices.map((s) => {
                const cfg = STATUS_COLORS[s.label];
                return (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.fill }} />
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${cfg?.bg ?? ''} ${cfg?.text ?? ''}`}>{s.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{s.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Source breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Lead Sources</h3>
        <p className="text-xs text-slate-500 mb-6">Where your leads are coming from</p>
        <div className="max-w-2xl">
          {Object.entries(sourceCount).map(([src, cnt], i) => (
            <HBar key={src} label={src} value={cnt} max={maxSource} color={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
