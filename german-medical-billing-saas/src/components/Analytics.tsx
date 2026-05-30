import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Cell,
} from 'recharts';
import type { AnalyticsData } from '../types';
import {
  TrendingUp,
  FileText,
  AlertTriangle,
  Award,
  Euro,
  BarChart3,
  ArrowUpRight,
  Zap,
} from 'lucide-react';

interface AnalyticsProps {
  data: AnalyticsData;
  currentMonthCases: number;
  currentMonthSavings: number;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-slate-400 text-[11px] mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="text-white text-[12px] font-semibold">
            {p.name}: <span style={{ color: p.color }}>{typeof p.value === 'number' && p.value > 100 ? `${p.value.toFixed(2).replace('.', ',')} €` : p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Analytics: React.FC<AnalyticsProps> = ({
  data,
  currentMonthCases,
  currentMonthSavings,
}) => {
  const mergedData = data.monatlicheHistorie.map((m, i) => ({
    ...m,
    faelle: i === data.monatlicheHistorie.length - 1 ? currentMonthCases : m.faelle,
    optimierung: i === data.monatlicheHistorie.length - 1 ? currentMonthSavings : m.optimierung,
  }));

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-[22px]">Monatliche Praxis-Analytics</h2>
          <p className="text-slate-500 text-[13px] mt-0.5">
            Übersicht Ihrer Abrechnungsoptimierung · Juli 2025
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-2">
          <Zap size={15} className="text-emerald-400" />
          <span className="text-emerald-300 text-[13px] font-semibold">
            KI-Optimierungsrate: +{data.optimierungsRate}%
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Cases */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-6 translate-x-6" />
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
              <FileText size={17} className="text-blue-400" />
            </div>
            <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
              <ArrowUpRight size={13} />
              +6,7%
            </span>
          </div>
          <div className="text-white font-black text-[32px] leading-none mb-1">
            {currentMonthCases}
          </div>
          <p className="text-slate-400 text-[12px] font-medium">Dokumentierte Fälle</p>
          <p className="text-slate-600 text-[11px] mt-0.5">in diesem Monat (Jul. 2025)</p>
        </div>

        {/* Metric 2: Revenue saved */}
        <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-6 translate-x-6" />
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <Euro size={17} className="text-emerald-400" />
            </div>
            <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
              <ArrowUpRight size={13} />
              +15,2%
            </span>
          </div>
          <div className="text-emerald-300 font-black text-[32px] leading-none mb-1">
            {currentMonthSavings > 0
              ? currentMonthSavings.toFixed(2).replace('.', ',')
              : data.verhindeterHonorarverlust.toFixed(2).replace('.', ',')} €
          </div>
          <p className="text-slate-400 text-[12px] font-medium">Verhinderter Honorarverlust</p>
          <p className="text-slate-600 text-[11px] mt-0.5">durch KI-erkannte Zusatzpositionen</p>
        </div>

        {/* Metric 3: Most missed code */}
        <div className="bg-amber-500/8 border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -translate-y-6 translate-x-6" />
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
              <AlertTriangle size={17} className="text-amber-400" />
            </div>
            <span className="text-amber-400 text-[11px] font-semibold">
              Häufigste Lücke
            </span>
          </div>
          <div className="text-amber-300 font-black text-[24px] leading-none mb-1 font-mono">
            {data.vergesseneZiffern[0].code}
          </div>
          <p className="text-slate-400 text-[12px] font-medium">{data.vergesseneZiffern[0].beschreibung}</p>
          <p className="text-slate-600 text-[11px] mt-0.5">
            {data.vergesseneZiffern[0].anzahl}× vergessen · häufigste vergessene Ziffer
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Monthly Cases Chart */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={15} className="text-blue-400" />
            <h3 className="text-white font-semibold text-[14px]">Monatliche Fallzahlen</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mergedData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="monat"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
              <Bar dataKey="faelle" name="Fälle" radius={[6, 6, 0, 0]}>
                {mergedData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === mergedData.length - 1 ? '#10b981' : '#1e40af'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Optimization Trend */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={15} className="text-emerald-400" />
            <h3 className="text-white font-semibold text-[14px]">Optimierungstrend (€)</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={mergedData}>
              <defs>
                <linearGradient id="optimGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="monat"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={45}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="optimierung"
                name="Optimierung"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#optimGradient)"
                dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Most Forgotten Codes */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={15} className="text-amber-400" />
            <h3 className="text-white font-semibold text-[14px]">Häufigste vergessene Ziffern</h3>
          </div>
          <div className="space-y-3">
            {data.vergesseneZiffern.map((item, i) => (
              <div key={item.code} className="flex items-center gap-3">
                <span className="text-slate-600 text-[11px] font-bold w-4 shrink-0">{i + 1}</span>
                <span className="font-mono text-[12px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-0.5 shrink-0">
                  {item.code}
                </span>
                <span className="text-slate-400 text-[12px] flex-1 min-w-0 truncate">
                  {item.beschreibung}
                </span>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-white text-[12px] font-bold">{item.anzahl}×</span>
                  <div className="w-16 h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${(item.anzahl / data.vergesseneZiffern[0].anzahl) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Leistungen */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award size={15} className="text-violet-400" />
            <h3 className="text-white font-semibold text-[14px]">Top Leistungsziffern (Umsatz)</h3>
          </div>
          <div className="space-y-3">
            {data.topLeistungen.map((item, i) => (
              <div key={item.code} className="flex items-center gap-3">
                <span className="text-slate-600 text-[11px] font-bold w-4 shrink-0">{i + 1}</span>
                <span
                  className="font-mono text-[12px] font-bold rounded px-2 py-0.5 shrink-0"
                  style={{
                    color: COLORS[i % COLORS.length],
                    backgroundColor: `${COLORS[i % COLORS.length]}15`,
                    border: `1px solid ${COLORS[i % COLORS.length]}30`,
                  }}
                >
                  {item.code}
                </span>
                <span className="text-slate-400 text-[12px] flex-1 min-w-0 truncate">
                  {item.beschreibung}
                </span>
                <div className="text-right shrink-0">
                  <span className="text-white text-[12px] font-bold">
                    {item.umsatz.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €
                  </span>
                  <p className="text-slate-600 text-[10px]">{item.anzahl}× abg.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight Card */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Zap size={18} className="text-emerald-400" />
          </div>
          <div>
            <h4 className="text-white font-bold text-[14px] mb-1">KI-Insight des Monats</h4>
            <p className="text-slate-400 text-[13px] leading-relaxed">
              Im Juli 2025 hat die MedBill KI in <span className="text-white font-semibold">{currentMonthCases} dokumentierten Fällen</span> insgesamt{' '}
              <span className="text-emerald-300 font-semibold">
                {currentMonthSavings > 0
                  ? currentMonthSavings.toFixed(2).replace('.', ',')
                  : data.verhindeterHonorarverlust.toFixed(2).replace('.', ',')} €
              </span>{' '}
              an Honorarverlusten verhindert. Die häufigste übersehene Ziffer war{' '}
              <span className="text-amber-300 font-mono font-semibold">{data.vergesseneZiffern[0].code}</span>{' '}
              ({data.vergesseneZiffern[0].beschreibung}), die in{' '}
              <span className="text-white font-semibold">{data.vergesseneZiffern[0].anzahl} Fällen</span> automatisch ergänzt wurde.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
