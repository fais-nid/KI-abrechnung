import React from 'react';
import { cn } from '../utils/cn';
import type { Fachgebiet, Abrechnungssystem } from '../types';
import { exampleTexts } from '../data/mockData';
import {
  Zap,
  Shield,
  FileText,
  Mic,
  ChevronDown,
  Lightbulb,
  Loader2,
} from 'lucide-react';

interface LeftPanelProps {
  fachgebiet: Fachgebiet;
  system: Abrechnungssystem;
  text: string;
  isLoading: boolean;
  onFachgebietChange: (f: Fachgebiet) => void;
  onSystemChange: (s: Abrechnungssystem) => void;
  onTextChange: (t: string) => void;
  onAnalyze: () => void;
}

const FACHGEBIETE: Fachgebiet[] = ['Zahnmedizin', 'Allgemeinmedizin', 'Orthopädie', 'Dermatologie'];

const FACHGEBIET_ICONS: Record<Fachgebiet, string> = {
  Zahnmedizin: '🦷',
  Allgemeinmedizin: '🩺',
  Orthopädie: '🦴',
  Dermatologie: '🔬',
};

const SYSTEM_DESCRIPTIONS: Record<Abrechnungssystem, string> = {
  BEMA: 'Gesetzlich versicherte Patienten (GKV)',
  GOZ: 'Privat versicherte Zahnpatienten (PKV)',
  GOÄ: 'Privatärztliche Abrechnung (PKV)',
};

export const LeftPanel: React.FC<LeftPanelProps> = ({
  fachgebiet,
  system,
  text,
  isLoading,
  onFachgebietChange,
  onSystemChange,
  onTextChange,
  onAnalyze,
}) => {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleExampleLoad = (exampleText: string) => {
    onTextChange(exampleText);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Panel Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-700/50">
        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
          <FileText size={16} className="text-slate-400" />
        </div>
        <div>
          <h2 className="text-white font-bold text-[15px]">Die Dokumentation</h2>
          <p className="text-slate-500 text-[11px]">Freitext · Diktat-Skript · Befundnotiz</p>
        </div>
      </div>

      {/* Fachgebiet Selector */}
      <div className="space-y-1.5">
        <label className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
          Fachgebiet / Spezialisierung
        </label>
        <div className="relative">
          <select
            value={fachgebiet}
            onChange={(e) => onFachgebietChange(e.target.value as Fachgebiet)}
            className="w-full bg-slate-800 border border-slate-700 text-white text-[13px] font-medium rounded-lg px-3 py-2.5 pr-8 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
          >
            {FACHGEBIETE.map((f) => (
              <option key={f} value={f}>
                {FACHGEBIET_ICONS[f]} {f}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
        </div>
      </div>

      {/* System Toggle */}
      <div className="space-y-1.5">
        <label className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
          Abrechnungssystem
        </label>
        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
          {(['BEMA', 'GOZ', 'GOÄ'] as Abrechnungssystem[]).map((s) => (
            <button
              key={s}
              onClick={() => onSystemChange(s)}
              className={cn(
                'flex-1 py-2 text-[12px] font-bold rounded-md transition-all duration-150',
                system === s
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-slate-600 text-[10px] text-center">{SYSTEM_DESCRIPTIONS[system]}</p>
      </div>

      {/* Example Texts */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Lightbulb size={11} className="text-amber-400" />
          <label className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            Beispiel-Szenarien laden
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {exampleTexts.map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleExampleLoad(ex.text)}
              className="text-[11px] text-slate-400 bg-slate-800 border border-slate-700 hover:border-emerald-500/40 hover:text-emerald-300 hover:bg-emerald-500/5 rounded-md px-2.5 py-1 transition-all duration-150"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Text Area */}
      <div className="flex-1 flex flex-col space-y-1.5 min-h-0">
        <div className="flex items-center justify-between">
          <label className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Mic size={11} className="text-emerald-400" />
            Ärztliche Dokumentation / Freitext / Diktat-Skript
          </label>
          <span className="text-slate-600 text-[10px]">
            {wordCount} Wörter · {charCount} Zeichen
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={`Hier ärztliche Befunde, Behandlungsnotizen oder Diktate einfügen…\n\nBeispiel: „Patient mit Karies an Zahn 24. Mehrschichtkompositfüllung geplant. Starker Speichelfluss erschwerte die Behandlung. Kofferdam angelegt. Leitungsanästhesie verabreicht…"`}
          className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-[13px] leading-relaxed rounded-xl p-4 resize-none outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 transition-all placeholder:text-slate-600 font-mono min-h-[220px]"
        />
      </div>

      {/* DSGVO Banner */}
      <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-3">
        <Shield size={15} className="text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-emerald-300 text-[11px] font-bold mb-0.5">
            🔒 100% DSGVO-konform: Client-Side-Verarbeitung
          </p>
          <p className="text-slate-500 text-[10px] leading-relaxed">
            Dieser Editor läuft vollständig in Ihrem Browser. Namen, Geburtsdaten oder PII werden
            vor der Verarbeitung automatisch gefiltert. Keine Speicherung von Patientendaten.
            Keine Datenübertragung an externe Server.
          </p>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={onAnalyze}
        disabled={isLoading || text.trim().length < 10}
        className={cn(
          'w-full py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg',
          isLoading || text.trim().length < 10
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-[0.98]'
        )}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            KI analysiert Dokumentation…
          </>
        ) : (
          <>
            <Zap size={16} />
            🚀 Abrechnungspositionen per KI extrahieren
          </>
        )}
      </button>
    </div>
  );
};
