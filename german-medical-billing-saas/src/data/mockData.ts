import type { AnalyticsData } from '../types';

export const analyticsData: AnalyticsData = {
  dokumentierteFaelle: 127,
  verhindeterHonorarverlust: 4320.80,
  vergesseneZiffern: [
    { code: 'GOZ 2040', anzahl: 34, beschreibung: 'Kofferdam anlegen' },
    { code: 'GOÄ 5', anzahl: 28, beschreibung: 'Symptombezogene Untersuchung' },
    { code: 'GOZ 0010', anzahl: 19, beschreibung: 'Eingehende Untersuchung' },
    { code: 'GOÄ 34', anzahl: 15, beschreibung: 'Erörterung Krankheitsverlauf' },
  ],
  monatlicheHistorie: [
    { monat: 'Jan', faelle: 89, optimierung: 2100 },
    { monat: 'Feb', faelle: 95, optimierung: 2450 },
    { monat: 'Mär', faelle: 103, optimierung: 2890 },
    { monat: 'Apr', faelle: 98, optimierung: 2670 },
    { monat: 'Mai', faelle: 112, optimierung: 3200 },
    { monat: 'Jun', faelle: 119, optimierung: 3750 },
    { monat: 'Jul', faelle: 127, optimierung: 4320 },
  ],
  topLeistungen: [
    { code: 'GOZ 2120', beschreibung: 'Mehrschichtkompositfüllung', anzahl: 42, umsatz: 8940 },
    { code: 'GOZ 2040', beschreibung: 'Anlegen von Kofferdam', anzahl: 38, umsatz: 1520 },
    { code: 'GOÄ 3', beschreibung: 'Eingehende Beratung', anzahl: 31, umsatz: 2170 },
    { code: 'GOÄ 7', beschreibung: 'Vollständige körperliche Untersuchung', anzahl: 28, umsatz: 3360 },
    { code: 'GOZ 4130', beschreibung: 'Wurzelkanalbehandlung', anzahl: 24, umsatz: 5280 },
  ],
  optimierungsRate: 23.4,
};

export const exampleTexts = [
  {
    label: 'Zahnfüllung (GOZ)',
    text: `Patient stellt sich vor mit Karies an Zahn 24 (distal). Aufgrund von starkem Speichelfluss war die Trockenlegung äußerst schwierig und zeitaufwendig. Es wurde eine Mehrschichtkompositfüllung in aufwendiger Schichttechnik gelegt. Kofferdam wurde angelegt. Vorher ausführliche Beratung über Behandlungsalternativen. Schmerzmittel verschrieben.`,
  },
  {
    label: 'Allgemeinuntersuchung (GOÄ)',
    text: `Eingehende Beratung des Patienten über Befunde und weiteres Vorgehen, Dauer ca. 18 Minuten. Anschließend Ganzkörperuntersuchung aller Organsysteme durchgeführt. Blutdruck gemessen, Lunge und Herz auskultiert. Laboranforderung veranlasst. Folgetermin in 4 Wochen.`,
  },
  {
    label: 'Orthopädie (GOÄ)',
    text: `Patient klagt über chronische Rückenschmerzen. Eingehende Beratung über Behandlungsoptionen. Neurologische Untersuchung der Wirbelsäule. Injektion an der Lendenwirbelsäule. Funktionsanalyse der HWS. Rezept für Physiotherapie ausgestellt.`,
  },
];
