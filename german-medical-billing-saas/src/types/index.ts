export type Fachgebiet = 'Zahnmedizin' | 'Allgemeinmedizin' | 'Orthopädie' | 'Dermatologie';
export type Abrechnungssystem = 'BEMA' | 'GOZ' | 'GOÄ';
export type NavTab = 'abrechnung' | 'analytics' | 'einstellungen';

export interface BillingPosition {
  id: string;
  code: string;
  system: Abrechnungssystem;
  beschreibung: string;
  kurzBeschreibung: string;
  punkte: number;
  euroProPunkt: number;
  faktor: number;
  maxFaktor: number;
  begruendung: string;
  isHighlighted?: boolean;
  isExclusion?: boolean;
  kategorie: string;
  additionalInfo?: string;
}

export interface ExclusionWarning {
  id: string;
  codes: string[];
  nachricht: string;
  severity: 'warning' | 'info' | 'error';
}

export interface AnalyticsData {
  dokumentierteFaelle: number;
  verhindeterHonorarverlust: number;
  vergesseneZiffern: { code: string; anzahl: number; beschreibung: string }[];
  monatlicheHistorie: { monat: string; faelle: number; optimierung: number }[];
  topLeistungen: { code: string; beschreibung: string; anzahl: number; umsatz: number }[];
  optimierungsRate: number;
}

export interface ParseResult {
  positionen: BillingPosition[];
  warnungen: ExclusionWarning[];
  erkannteSchluesselbegriffe: string[];
  gesamtEuro: number;
  optimierterMehrwert: number;
}
