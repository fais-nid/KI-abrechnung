import { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { parseDocumentation } from './logic/parser';
import { analyticsData } from './data/mockData';
import type {
  NavTab,
  Fachgebiet,
  Abrechnungssystem,
  ParseResult,
  BillingPosition,
  ExclusionWarning,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('abrechnung');
  const [fachgebiet, setFachgebiet] = useState<Fachgebiet>('Zahnmedizin');
  const [system, setSystem] = useState<Abrechnungssystem>('GOZ');
  const [dokumentText, setDokumentText] = useState('');
  const [result, setResult] = useState<ParseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCases, setTotalCases] = useState(analyticsData.dokumentierteFaelle);
  const [totalSavings, setTotalSavings] = useState(analyticsData.verhindeterHonorarverlust);

  const handleAnalyze = useCallback(async () => {
    if (dokumentText.trim().length < 10) return;

    setIsLoading(true);
    setResult(null);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));

    const parsed = parseDocumentation(dokumentText, fachgebiet, system);
    setResult(parsed);
    setIsLoading(false);

    // Update analytics counters
    setTotalCases((prev) => prev + 1);
    setTotalSavings((prev) => prev + parsed.optimierterMehrwert);
  }, [dokumentText, fachgebiet, system]);

  const handlePositionUpdate = useCallback(
    (id: string, updates: Partial<BillingPosition>) => {
      if (!result) return;
      setResult((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          positionen: prev.positionen.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        };
      });
    },
    [result]
  );

  const handleDismissWarning = useCallback((id: string) => {
    setResult((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        warnungen: prev.warnungen.filter((w: ExclusionWarning) => w.id !== id),
      };
    });
  }, []);

  const handleFachgebietChange = (f: Fachgebiet) => {
    setFachgebiet(f);
    // Auto-select appropriate system
    if (f === 'Zahnmedizin') setSystem('GOZ');
    else setSystem('GOÄ');
    setResult(null);
  };

  const handleSystemChange = (s: Abrechnungssystem) => {
    setSystem(s);
    setResult(null);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-['Inter',sans-serif]">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="shrink-0 bg-slate-900/60 border-b border-slate-800 px-6 py-3 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div>
              {activeTab === 'abrechnung' && (
                <>
                  <h1 className="text-white font-bold text-[16px]">
                    KI-Dokumentation & Abrechnung
                  </h1>
                  <p className="text-slate-500 text-[11px]">
                    Intelligente Extraktion von Leistungsziffern aus ärztlicher Freitextdokumentation
                  </p>
                </>
              )}
              {activeTab === 'analytics' && (
                <>
                  <h1 className="text-white font-bold text-[16px]">Monatliche Praxis-Analytics</h1>
                  <p className="text-slate-500 text-[11px]">
                    Übersicht Ihrer Abrechnungsoptimierung und erkannter Honoraroptimierungen
                  </p>
                </>
              )}
              {activeTab === 'einstellungen' && (
                <>
                  <h1 className="text-white font-bold text-[16px]">Einstellungen</h1>
                  <p className="text-slate-500 text-[11px]">
                    Praxis- und KI-Konfiguration verwalten
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-slate-400 text-[11px] font-medium">System aktiv</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-1.5">
              <span className="text-slate-500 text-[11px]">Fälle gesamt:</span>
              <span className="text-white text-[11px] font-bold">{totalCases}</span>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        {activeTab === 'abrechnung' && (
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Left Panel */}
            <div className="w-[44%] min-w-[360px] shrink-0 border-r border-slate-800 p-5 flex flex-col overflow-y-auto">
              <LeftPanel
                fachgebiet={fachgebiet}
                system={system}
                text={dokumentText}
                isLoading={isLoading}
                onFachgebietChange={handleFachgebietChange}
                onSystemChange={handleSystemChange}
                onTextChange={setDokumentText}
                onAnalyze={handleAnalyze}
              />
            </div>

            {/* Right Panel */}
            <div className="flex-1 p-5 flex flex-col overflow-hidden min-w-0">
              <RightPanel
                result={result}
                isLoading={isLoading}
                onUpdate={handlePositionUpdate}
                onDismissWarning={handleDismissWarning}
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <Analytics
            data={analyticsData}
            currentMonthCases={totalCases}
            currentMonthSavings={totalSavings}
          />
        )}

        {activeTab === 'einstellungen' && <Settings />}
      </main>
    </div>
  );
}
