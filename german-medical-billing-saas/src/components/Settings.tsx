import React, { useState } from 'react';
import { Shield, User, Building2, Key, Check, ChevronRight, Zap, Lock } from 'lucide-react';

interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = () => {
  const [praxisName, setPraxisName] = useState('Zahnarztpraxis Dr. Mustermann');
  const [arztName, setArztName] = useState('Dr. Max Mustermann');
  const [fachrichtung, setFachrichtung] = useState('Zahnmedizin');
  const [bsnr, setBsnr] = useState('123456789');
  const [lanr, setLanr] = useState('987654321');
  const [notifications, setNotifications] = useState(true);
  const [autoBegruendung, setAutoBegruendung] = useState(true);
  const [highFaktorAlert, setHighFaktorAlert] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (v: boolean) => void }> = ({
    enabled,
    onChange,
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
        enabled ? 'bg-emerald-500' : 'bg-slate-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200`}
        style={{ transform: enabled ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  );

  const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({
    icon,
    title,
    desc,
  }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-white font-bold text-[14px]">{title}</h3>
        <p className="text-slate-500 text-[11px]">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div>
        <h2 className="text-white font-bold text-[22px]">Einstellungen</h2>
        <p className="text-slate-500 text-[13px] mt-0.5">
          Praxis- und Nutzerkonfiguration für die MedBill KI
        </p>
      </div>

      {/* Praxis Info */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
        <SectionHeader
          icon={<Building2 size={16} className="text-blue-400" />}
          title="Praxisinformationen"
          desc="Stammdaten Ihrer Praxis für Dokumentation und Abrechnung"
        />
        <div className="space-y-3">
          <div>
            <label className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider block mb-1.5">
              Praxisname
            </label>
            <input
              type="text"
              value={praxisName}
              onChange={(e) => setPraxisName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-[13px] rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider block mb-1.5">
                BSNR
              </label>
              <input
                type="text"
                value={bsnr}
                onChange={(e) => setBsnr(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-[13px] rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500/50 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider block mb-1.5">
                Fachrichtung
              </label>
              <select
                value={fachrichtung}
                onChange={(e) => setFachrichtung(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-[13px] rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500/50 transition-colors"
              >
                {['Zahnmedizin', 'Allgemeinmedizin', 'Orthopädie', 'Dermatologie'].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Arzt Info */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
        <SectionHeader
          icon={<User size={16} className="text-violet-400" />}
          title="Behandlerinformationen"
          desc="Daten des behandelnden Arztes / der behandelnden Ärztin"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider block mb-1.5">
              Name & Titel
            </label>
            <input
              type="text"
              value={arztName}
              onChange={(e) => setArztName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-[13px] rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider block mb-1.5">
              LANR
            </label>
            <input
              type="text"
              value={lanr}
              onChange={(e) => setLanr(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-[13px] rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500/50 transition-colors font-mono"
            />
          </div>
        </div>
      </div>

      {/* KI Settings */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
        <SectionHeader
          icon={<Zap size={16} className="text-emerald-400" />}
          title="KI-Abrechnungseinstellungen"
          desc="Verhalten der KI-Extraktionsfunktion konfigurieren"
        />
        <div className="space-y-4">
          {[
            {
              label: 'Automatische Begründungsentwürfe',
              desc: 'KI generiert automatisch § 5 GOZ/GOÄ-Begründungstexte für erhöhte Steigerungssätze.',
              value: autoBegruendung,
              onChange: setAutoBegruendung,
            },
            {
              label: 'Warnung bei hohem Steigerungssatz (>2,3x)',
              desc: 'Hinweis, wenn ein Steigerungssatz über dem Regelsteigerungssatz liegt und eine explizite Begründung erforderlich ist.',
              value: highFaktorAlert,
              onChange: setHighFaktorAlert,
            },
            {
              label: 'Benachrichtigungen & Hinweise',
              desc: 'Interaktive Tipps zur Optimierung der Abrechnung und zu häufig vergessenen Positionen.',
              value: notifications,
              onChange: setNotifications,
            },
          ].map((setting) => (
            <div key={setting.label} className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-slate-300 text-[13px] font-medium">{setting.label}</p>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{setting.desc}</p>
              </div>
              <ToggleSwitch enabled={setting.value} onChange={setting.onChange} />
            </div>
          ))}
        </div>
      </div>

      {/* DSGVO & Security */}
      <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-5">
        <SectionHeader
          icon={<Shield size={16} className="text-emerald-400" />}
          title="Datenschutz & DSGVO"
          desc="Alle Daten werden ausschließlich lokal verarbeitet"
        />
        <div className="space-y-3">
          {[
            {
              icon: <Lock size={13} className="text-emerald-400" />,
              label: 'Client-Side-Verarbeitung',
              desc: 'Alle Texteingaben verbleiben ausschließlich in Ihrem Browser.',
            },
            {
              icon: <Shield size={13} className="text-emerald-400" />,
              label: 'Automatische PII-Filterung',
              desc: 'Namen, Geburtsdaten und Versicherungsnummern werden vor der Verarbeitung erkannt und entfernt.',
            },
            {
              icon: <Key size={13} className="text-emerald-400" />,
              label: 'Keine externe API-Kommunikation',
              desc: 'Es werden keine Patientendaten an externe Server oder KI-Dienste übertragen.',
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div>
                <p className="text-emerald-300 text-[12px] font-semibold">{item.label}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-[12px] font-semibold">MedBill KI · Version 2.1.0</p>
          <p className="text-slate-600 text-[11px]">Unterstützt: BEMA 2024, GOZ 2012, GOÄ 1996 (i.d.F. 2024)</p>
        </div>
        <ChevronRight size={16} className="text-slate-600" />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`w-full py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all duration-200 ${
          saved
            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
            : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/25'
        }`}
      >
        {saved ? (
          <>
            <Check size={16} />
            Einstellungen gespeichert
          </>
        ) : (
          'Einstellungen speichern'
        )}
      </button>
    </div>
  );
};
