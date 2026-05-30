import React from 'react';
import { cn } from '../utils/cn';
import type { NavTab } from '../types';
import {
  Stethoscope,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Zap,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
  {
    id: 'abrechnung',
    label: 'KI-Dokumentation & Abrechnung',
    icon: <FileText size={18} />,
    badge: 'KI',
  },
  {
    id: 'analytics',
    label: 'Monatliche Praxis-Analytics',
    icon: <BarChart3 size={18} />,
  },
  {
    id: 'einstellungen',
    label: 'Einstellungen',
    icon: <Settings size={18} />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="w-64 shrink-0 bg-slate-900 flex flex-col h-screen sticky top-0 border-r border-slate-800">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Stethoscope size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-[15px] leading-tight tracking-tight">
              MedBill<span className="text-emerald-400"> KI</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-medium tracking-wider uppercase">
              Abrechnungs-Assistent
            </p>
          </div>
        </div>
      </div>

      {/* Version badge */}
      <div className="mx-4 mt-3 mb-1">
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
          <Zap size={12} className="text-emerald-400" />
          <span className="text-emerald-300 text-[11px] font-semibold tracking-wide">
            BEMA · GOZ · GOÄ
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">
          Navigation
        </p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group',
              activeTab === item.id
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            )}
          >
            <span
              className={cn(
                'shrink-0 transition-colors',
                activeTab === item.id ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
              )}
            >
              {item.icon}
            </span>
            <span className="text-[13px] font-medium leading-tight flex-1">{item.label}</span>
            {item.badge && (
              <span className="shrink-0 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wide">
                {item.badge}
              </span>
            )}
            {activeTab === item.id && (
              <ChevronRight size={14} className="shrink-0 text-emerald-400" />
            )}
          </button>
        ))}
      </nav>

      {/* DSGVO Badge */}
      <div className="px-3 pb-4">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-emerald-400 shrink-0" />
            <span className="text-emerald-300 text-[11px] font-bold">DSGVO-konform</span>
          </div>
          <p className="text-slate-500 text-[10px] leading-relaxed">
            Vollständig Client-Side. Keine Patientendaten werden übertragen oder gespeichert.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-slate-500 text-[10px]">Alle Daten lokal verarbeitet</span>
          </div>
        </div>

        {/* User */}
        <div className="mt-3 flex items-center gap-3 px-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            DM
          </div>
          <div>
            <p className="text-slate-300 text-[12px] font-semibold">Dr. Mustermann</p>
            <p className="text-slate-600 text-[10px]">Zahnarztpraxis · Hamburg</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
