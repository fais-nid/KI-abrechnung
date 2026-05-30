import React from 'react';
import { cn } from '../utils/cn';
import type { ExclusionWarning as ExclusionWarningType } from '../types';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ExclusionWarningProps {
  warning: ExclusionWarningType;
  onDismiss?: (id: string) => void;
}

export const ExclusionWarningCard: React.FC<ExclusionWarningProps> = ({ warning, onDismiss }) => {
  const config = {
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-300',
      textMuted: 'text-amber-400/70',
      icon: <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />,
      label: 'Abrechnungshinweis',
      labelColor: 'text-amber-400',
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-300',
      textMuted: 'text-red-400/70',
      icon: <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />,
      label: 'Ausschluss-Warnung',
      labelColor: 'text-red-400',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-300',
      textMuted: 'text-blue-400/70',
      icon: <Info size={15} className="text-blue-400 shrink-0 mt-0.5" />,
      label: 'Information',
      labelColor: 'text-blue-400',
    },
  };

  const c = config[warning.severity];

  return (
    <div
      className={cn(
        'rounded-xl border p-4 flex gap-3',
        c.bg,
        c.border
      )}
    >
      {c.icon}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className={cn('text-[10px] font-bold uppercase tracking-wider', c.labelColor)}>
              {c.label}
            </span>
            <div className="flex gap-1">
              {warning.codes.map((code) => (
                <span
                  key={code}
                  className={cn(
                    'text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border',
                    c.bg,
                    c.border,
                    c.text
                  )}
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={() => onDismiss(warning.id)}
              className="text-slate-600 hover:text-slate-400 transition-colors ml-2 shrink-0"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <p className={cn('text-[12px] leading-relaxed', c.text)}>{warning.nachricht}</p>
      </div>
    </div>
  );
};
