import React, { useState } from 'react';
import { cn } from '../utils/cn';
import type { ParseResult, BillingPosition } from '../types';
import { BillingPositionCard } from './BillingPositionCard';
import { ExclusionWarningCard } from './ExclusionWarning';
import {
  ClipboardCopy,
  Check,
  Brain,
  TrendingUp,
  Tag,
  Euro,
  Sparkles,
  FileSearch,
  AlertCircle,
} from 'lucide-react';

interface RightPanelProps {
  result: ParseResult | null;
  isLoading: boolean;
  onUpdate: (id: string, updates: Partial<BillingPosition>) => void;
  onDismissWarning: (id: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  result,
  isLoading,
  onUpdate,
  onDismissWarning,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;

    const lines: string[] = [
      '═══════════════════════════════════════════',
      '  ABRECHNUNGSVORSCHLAG – MedBill KI',
      `  Generiert am: ${new Date().toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      '═══════════════════════════════════════════',
      '',
    ];

    result.positionen.forEach((p, i) => {
      const euro = (p.punkte * p.faktor * p.euroProPunkt).toFixed(2).replace('.', ',');
      lines.push(`[${i + 1}] ${p.code} – ${p.kurzBeschreibung}`);
      lines.push(`    System: ${p.system} | Punkte: ${p.punkte} | Steigerungssatz: ${p.faktor.toFixed(1)}x | Betrag: ${euro} €`);
      lines.push(`    Beschreibung: ${p.beschreibung}`);
      lines.push(`    Begründung nach § 5 Abs. 2 ${p.system}:`);
      lines.push(`    ${p.begruendung}`);
      lines.push('');
    });

    if (result.warnungen.length > 0) {
      lines.push('─── HINWEISE & AUSSCHLÜSSE ─────────────────');
      result.warnungen.forEach((w) => {
        lines.push(`⚠️  ${w.nachricht}`);
        lines.push('');
      });
    }

    lines.push('─── ZUSAMMENFASSUNG ───────────────────────');
    lines.push(`Gesamtbetrag: ${result.gesamtEuro.toFixed(2).replace('.', ',')} €`);
    lines.push(`Positionen:   ${result.positionen.length}`);
    lines.push('═══════════════════════════════════════════');

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const totalEuro = result
    ? result.positionen.reduce(
        (sum, p) => sum + p.punkte * p.faktor * p.euroProPunkt,
        0
      )
    : 0;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <Brain size={16} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-[15px]">Der KI-Abrechnungsvorschlag</h2>
            <p className="text-slate-500 text-[11px]">
              {result
                ? `${result.positionen.length} Leistungsziffern extrahiert`
                : 'Warten auf Dokumentation…'}
            </p>
          </div>
        </div>

        {/* Copy Button */}
        {result && result.positionen.length > 0 && (
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200 border',
              copied
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/30 hover:text-emerald-300 hover:bg-emerald-500/5'
            )}
          >
            {copied ? <Check size={13} /> : <ClipboardCopy size={13} />}
            {copied ? 'Kopiert!' : '📋 Codes & Begründungen kopieren'}
          </button>
        )}
      </div>

      {/* Summary Bar */}
      {result && result.positionen.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Tag size={11} className="text-slate-500" />
              <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wide">Positionen</span>
            </div>
            <span className="text-white font-bold text-[20px]">{result.positionen.length}</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Euro size={11} className="text-emerald-400" />
              <span className="text-emerald-400/70 text-[10px] font-medium uppercase tracking-wide">Gesamtbetrag</span>
            </div>
            <span className="text-emerald-300 font-bold text-[20px]">
              {totalEuro.toFixed(2).replace('.', ',')} €
            </span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={11} className="text-slate-500" />
              <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wide">KI-Mehrwert</span>
            </div>
            <span className="text-amber-300 font-bold text-[20px]">
              +{result.optimierterMehrwert.toFixed(2).replace('.', ',')} €
            </span>
          </div>
        </div>
      )}

      {/* Erkannte Schlüsselbegriffe */}
      {result && result.erkannteSchluesselbegriffe.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 shrink-0">
            <Sparkles size={11} className="text-emerald-400" />
            <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
              Erkannte Schlüsselbegriffe:
            </span>
          </div>
          {result.erkannteSchluesselbegriffe.map((kw) => (
            <span
              key={kw}
              className="text-[10px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Warnungen */}
      {result && result.warnungen.length > 0 && (
        <div className="space-y-2">
          {result.warnungen.map((w) => (
            <ExclusionWarningCard key={w.id} warning={w} onDismiss={onDismissWarning} />
          ))}
        </div>
      )}

      {/* Positions List */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 min-h-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <Brain size={24} className="text-emerald-400 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
            </div>
            <div className="text-center">
              <p className="text-slate-300 text-[14px] font-semibold mb-1">KI analysiert Dokumentation…</p>
              <p className="text-slate-600 text-[12px]">
                Erkennung von Leistungsziffern, Ausschlüssen und Steigerungssätzen
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        ) : result && result.positionen.length > 0 ? (
          <div className="space-y-3">
            {result.positionen.map((pos, index) => (
              <div
                key={pos.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 80}ms`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <BillingPositionCard
                  position={pos}
                  index={index}
                  onUpdate={onUpdate}
                />
              </div>
            ))}
          </div>
        ) : result && result.positionen.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <AlertCircle size={24} className="text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-[14px] font-semibold mb-1">
                Keine Leistungsziffern erkannt
              </p>
              <p className="text-slate-600 text-[12px] max-w-xs">
                Die Dokumentation enthält möglicherweise keine eindeutig erkennbaren medizinischen
                Leistungsbeschreibungen. Bitte erweitern Sie den Text.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-5 py-16">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
              <FileSearch size={28} className="text-slate-600" />
            </div>
            <div className="text-center max-w-sm">
              <p className="text-slate-400 text-[14px] font-semibold mb-2">
                Bereit zur KI-Analyse
              </p>
              <p className="text-slate-600 text-[12px] leading-relaxed">
                Fügen Sie Ihre ärztliche Dokumentation links ein und klicken Sie auf{' '}
                <span className="text-emerald-400 font-semibold">
                  „Abrechnungspositionen per KI extrahieren"
                </span>{' '}
                um automatisch Leistungsziffern, Steigerungssätze und gesetzliche Begründungen zu
                generieren.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
              {[
                { label: 'GOZ-Ziffern', icon: '🦷', desc: 'Zahnmedizin' },
                { label: 'GOÄ-Ziffern', icon: '🩺', desc: 'Ärzte (PKV)' },
                { label: 'BEMA-Ziffern', icon: '📋', desc: 'GKV' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center"
                >
                  <div className="text-[20px] mb-1">{item.icon}</div>
                  <p className="text-slate-400 text-[11px] font-semibold">{item.label}</p>
                  <p className="text-slate-600 text-[10px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
