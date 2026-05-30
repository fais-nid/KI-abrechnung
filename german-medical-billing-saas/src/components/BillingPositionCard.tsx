import React, { useState } from 'react';
import { cn } from '../utils/cn';
import type { BillingPosition } from '../types';
import {
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Info,
  TrendingUp,
  Edit3,
  Check,
} from 'lucide-react';

interface BillingPositionCardProps {
  position: BillingPosition;
  index: number;
  onUpdate: (id: string, updates: Partial<BillingPosition>) => void;
}

const FAKTOR_OPTIONS = [1.0, 1.15, 1.5, 1.8, 2.0, 2.3, 2.5, 3.0, 3.5];

export const BillingPositionCard: React.FC<BillingPositionCardProps> = ({
  position,
  index,
  onUpdate,
}) => {
  const [isEditingBegruendung, setIsEditingBegruendung] = useState(false);
  const [begruendungText, setBegruendungText] = useState(position.begruendung);
  const [isExpanded, setIsExpanded] = useState(true);

  const euroValue = position.punkte * position.faktor * position.euroProPunkt;

  const systemColor =
    position.system === 'GOZ'
      ? 'bg-blue-500/10 text-blue-300 border-blue-500/25'
      : position.system === 'GOÄ'
      ? 'bg-violet-500/10 text-violet-300 border-violet-500/25'
      : 'bg-amber-500/10 text-amber-300 border-amber-500/25';

  const faktorColor =
    position.faktor >= 3.0
      ? 'text-emerald-400 bg-emerald-500/10'
      : position.faktor >= 2.3
      ? 'text-blue-400 bg-blue-500/10'
      : 'text-slate-400 bg-slate-700/50';

  const handleFaktorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(position.id, { faktor: parseFloat(e.target.value) });
  };

  const handleBegruendungSave = () => {
    onUpdate(position.id, { begruendung: begruendungText });
    setIsEditingBegruendung(false);
  };

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200 overflow-hidden',
        position.isHighlighted
          ? 'border-emerald-500/40 bg-emerald-500/5 shadow-md shadow-emerald-500/10'
          : 'border-slate-700/60 bg-slate-800/40'
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card Header */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Index */}
        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-slate-400 text-[11px] font-bold">{index + 1}</span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* System Badge */}
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wide',
                systemColor
              )}
            >
              {position.system}
            </span>
            {/* Code */}
            <span className="text-white font-bold text-[14px] font-mono">{position.code}</span>
            {/* Highlighted */}
            {position.isHighlighted && (
              <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
                <Sparkles size={10} />
                Optimiert
              </span>
            )}
          </div>
          <p className="text-slate-300 text-[13px] font-medium leading-snug line-clamp-1">
            {position.kurzBeschreibung}
          </p>
          <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{position.kategorie}</p>
        </div>

        {/* Value & Faktor */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-white font-bold text-[16px]">
              {euroValue.toFixed(2).replace('.', ',')} €
            </div>
            <div className="text-slate-500 text-[10px]">{position.punkte} Pkt.</div>
          </div>
          <ChevronDown
            size={16}
            className={cn(
              'text-slate-500 transition-transform duration-200',
              isExpanded ? 'rotate-180' : ''
            )}
          />
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-700/50 pt-3">
          {/* Full description */}
          <p className="text-slate-400 text-[12px] leading-relaxed">{position.beschreibung}</p>

          {/* Controls row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Faktor selector */}
            <div className="flex items-center gap-2 bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-700/50">
              <TrendingUp size={13} className="text-slate-500" />
              <span className="text-slate-500 text-[11px] font-medium">Steigerungssatz:</span>
              <select
                value={position.faktor}
                onChange={handleFaktorChange}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'text-[13px] font-bold bg-transparent border-none outline-none cursor-pointer rounded px-1',
                  faktorColor
                )}
              >
                {FAKTOR_OPTIONS.filter((f) => f <= position.maxFaktor).map((f) => (
                  <option key={f} value={f} className="bg-slate-800 text-white">
                    {f.toFixed(1)}x
                  </option>
                ))}
              </select>
              <span className="text-slate-600 text-[10px]">/ {position.maxFaktor.toFixed(1)}x max.</span>
            </div>

            {/* Punkte */}
            <div className="flex items-center gap-1.5 bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-700/50">
              <span className="text-slate-500 text-[11px]">Punkte:</span>
              <span className="text-slate-200 text-[13px] font-bold">{position.punkte}</span>
            </div>

            {/* Euro/Pkt */}
            <div className="flex items-center gap-1.5 bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-700/50">
              <span className="text-slate-500 text-[11px]">Punktwert:</span>
              <span className="text-slate-200 text-[13px] font-bold">
                {(position.euroProPunkt * 100).toFixed(2)} ct
              </span>
            </div>
          </div>

          {/* Begründung */}
          <div className="rounded-lg border border-slate-700/60 overflow-hidden">
            <div className="flex items-center justify-between bg-slate-900/60 px-3 py-2 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Info size={12} className="text-emerald-400" />
                <span className="text-slate-300 text-[11px] font-semibold">
                  Medizinische Begründung nach § 5 Abs. 2 {position.system}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditingBegruendung) {
                    handleBegruendungSave();
                  } else {
                    setIsEditingBegruendung(true);
                  }
                }}
                className="flex items-center gap-1 text-slate-500 hover:text-emerald-400 transition-colors text-[11px]"
              >
                {isEditingBegruendung ? (
                  <>
                    <Check size={12} />
                    Speichern
                  </>
                ) : (
                  <>
                    <Edit3 size={12} />
                    Bearbeiten
                  </>
                )}
              </button>
            </div>
            <div className="p-3">
              {isEditingBegruendung ? (
                <textarea
                  value={begruendungText}
                  onChange={(e) => setBegruendungText(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full text-[12px] text-slate-300 leading-relaxed bg-slate-800 border border-emerald-500/30 rounded-lg p-2 outline-none resize-none focus:border-emerald-500/60 transition-colors"
                  rows={4}
                  autoFocus
                />
              ) : (
                <p className="text-slate-400 text-[12px] leading-relaxed italic">
                  „{position.begruendung}"
                </p>
              )}
            </div>
          </div>

          {/* Additional info badge */}
          {position.additionalInfo && (
            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2">
              <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
              <span className="text-amber-300 text-[11px] leading-relaxed">
                {position.additionalInfo}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
