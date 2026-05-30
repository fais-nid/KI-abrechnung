import type {
  BillingPosition,
  ExclusionWarning,
  ParseResult,
  Abrechnungssystem,
  Fachgebiet,
} from '../types';

// Euro per point values
const EURO_PRO_PUNKT_GOZ = 0.0562;
const EURO_PRO_PUNKT_GOAE = 0.0582873;
const EURO_PRO_PUNKT_BEMA = 1.0; // BEMA uses fixed values

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function calcEuro(punkte: number, faktor: number, system: Abrechnungssystem): number {
  const rate =
    system === 'GOZ'
      ? EURO_PRO_PUNKT_GOZ
      : system === 'GOÄ'
      ? EURO_PRO_PUNKT_GOAE
      : EURO_PRO_PUNKT_BEMA;
  return punkte * faktor * rate;
}

// ─────────────────────────────────────────────
// GOZ: Zahnmedizin scenario
// ─────────────────────────────────────────────
function parseZahnmedizinGOZ(text: string): ParseResult {
  const lower = text.toLowerCase();
  const positionen: BillingPosition[] = [];
  const warnungen: ExclusionWarning[] = [];
  const erkannte: string[] = [];
  let optimierterMehrwert = 0;

  const hasMehrschicht =
    lower.includes('mehrschichtkompositfüllung') ||
    lower.includes('mehrschichtkomposit') ||
    lower.includes('schichttechnik') ||
    lower.includes('komposit');
  const hasSpeichelfluss =
    lower.includes('speichelfluss') ||
    lower.includes('trockenlegung') ||
    lower.includes('feuchtigkeit') ||
    lower.includes('nässe');
  const hasZahn24 =
    lower.includes('zahn 24') || lower.includes('24') || lower.includes('zahn24');
  const hasKofferdam =
    lower.includes('kofferdam') || lower.includes('trockenlegung');
  const hasBeratung =
    lower.includes('beratung') || lower.includes('aufklärung') || lower.includes('gespräch');
  const hasRöntgen =
    lower.includes('röntgen') || lower.includes('röntgenaufnahme') || lower.includes('opa') || lower.includes('dvt');
  const hasAnästhesie =
    lower.includes('anästhesie') || lower.includes('betäubung') || lower.includes('infiltration') ||
    lower.includes('leitungsanästhesie');
  const hasKaries =
    lower.includes('karies') || lower.includes('caries') || lower.includes('kavität');

  if (hasMehrschicht) {
    erkannte.push('Mehrschichtkompositfüllung');
    const faktor = hasSpeichelfluss ? 3.5 : hasZahn24 ? 2.3 : 1.8;
    const pos: BillingPosition = {
      id: generateId(),
      code: 'GOZ 2120',
      system: 'GOZ',
      beschreibung:
        'Anlegen einer dreiflächigen Füllung aus plastischem Material (Kompositfüllung in Mehrschichttechnik)',
      kurzBeschreibung: 'Mehrschichtkompositfüllung',
      punkte: 210,
      euroProPunkt: EURO_PRO_PUNKT_GOZ,
      faktor,
      maxFaktor: 3.5,
      begruendung:
        hasSpeichelfluss && hasZahn24
          ? `Erhöhter Zeitaufwand und extreme Schwierigkeit bei der adhäsiven Befestigung aufgrund von starkem Speichelfluss an Zahn 24. Die Isolation des Operationsfeldes erforderte mehrfache Maßnahmen und überstieg den Regelaufwand erheblich. Gemäß § 5 Abs. 2 GOZ ist eine Überschreitung des Schwellenwertes (2,3-fach) medizinisch und sachlich begründet.`
          : `Erhöhter technischer Aufwand bei der adhäsiven Mehrschichttechnik. Gemäß § 5 Abs. 2 GOZ ist der gewählte Steigerungssatz durch die Schwierigkeit des Eingriffs begründet.`,
      isHighlighted: faktor >= 3.0,
      kategorie: 'Füllungstherapie',
    };
    positionen.push(pos);
  }

  if (hasKaries && !hasMehrschicht) {
    erkannte.push('Kariesbehandlung');
    const pos: BillingPosition = {
      id: generateId(),
      code: 'GOZ 2080',
      system: 'GOZ',
      beschreibung:
        'Anlegen einer zweiflächigen Füllung aus plastischem Material (Kompositfüllung)',
      kurzBeschreibung: 'Zweiflächige Kompositfüllung',
      punkte: 175,
      euroProPunkt: EURO_PRO_PUNKT_GOZ,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Standardgemäße Versorgung der kariösen Läsion mit zweiflächiger Kompositfüllung. Regelsteigerungssatz gemäß GOZ.`,
      kategorie: 'Füllungstherapie',
    };
    positionen.push(pos);
  }

  if (hasKofferdam) {
    erkannte.push('Kofferdam');
    const alreadyCovered = positionen.some((p) => p.code === 'GOZ 2120');
    const extraValue = calcEuro(40, 2.3, 'GOZ');
    if (!alreadyCovered) {
      optimierterMehrwert += extraValue;
    }
    positionen.push({
      id: generateId(),
      code: 'GOZ 2040',
      system: 'GOZ',
      beschreibung: 'Anlegen von Kofferdam',
      kurzBeschreibung: 'Kofferdam anlegen',
      punkte: 40,
      euroProPunkt: EURO_PRO_PUNKT_GOZ,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Anlegen von Kofferdam zur Gewährleistung eines absolut trockenen Arbeitsfeldes, zwingend erforderlich für die adhäsive Befestigung des Kompositmaterials. Ohne diese Maßnahme wäre eine dauerhafte Restauration nicht möglich.`,
      additionalInfo: '⭐ KI-Erkennung: Diese Ziffer wird häufig vergessen!',
      kategorie: 'Hilfsmassnahmen',
    });
  }

  if (hasBeratung) {
    erkannte.push('Beratung/Aufklärung');
    positionen.push({
      id: generateId(),
      code: 'GOZ 0010',
      system: 'GOZ',
      beschreibung: 'Eingehende Untersuchung und Beratung',
      kurzBeschreibung: 'Eingehende Untersuchung',
      punkte: 75,
      euroProPunkt: EURO_PRO_PUNKT_GOZ,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Eingehende Beratung über Therapiealternativen, Vor- und Nachteile der gewählten Methode sowie mögliche Komplikationen. Aufklärungsgespräch entsprechend § 630e BGB dokumentiert.`,
      kategorie: 'Untersuchung & Beratung',
    });
  }

  if (hasAnästhesie) {
    erkannte.push('Leitungsanästhesie');
    positionen.push({
      id: generateId(),
      code: 'GOZ 0080',
      system: 'GOZ',
      beschreibung: 'Leitungsanästhesie (Infiltrationsanästhesie)',
      kurzBeschreibung: 'Leitungsanästhesie',
      punkte: 30,
      euroProPunkt: EURO_PRO_PUNKT_GOZ,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Leitungsanästhesie zur Schmerzfreiheit während der invasiven Behandlung. Indikation gemäß klinischem Befund zweifellos gegeben.`,
      kategorie: 'Anästhesie',
    });
  }

  if (hasRöntgen) {
    erkannte.push('Röntgendiagnostik');
    positionen.push({
      id: generateId(),
      code: 'GOZ 5000',
      system: 'GOZ',
      beschreibung: 'Intraorale Röntgenaufnahme (Einzelzahnfilm)',
      kurzBeschreibung: 'Intraorales Röntgenbild',
      punkte: 25,
      euroProPunkt: EURO_PRO_PUNKT_GOZ,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Röntgenaufnahme zur Diagnosestellung und Therapieplanung indiziert. Strahlenexposition gemäß ALARA-Prinzip minimiert.`,
      kategorie: 'Röntgendiagnostik',
    });
  }

  const gesamtEuro = positionen.reduce(
    (sum, p) => sum + calcEuro(p.punkte, p.faktor, p.system),
    0
  );

  return {
    positionen,
    warnungen,
    erkannteSchluesselbegriffe: erkannte,
    gesamtEuro,
    optimierterMehrwert,
  };
}

// ─────────────────────────────────────────────
// GOÄ: Allgemeinmedizin scenario
// ─────────────────────────────────────────────
function parseAllgemeinGOAE(text: string): ParseResult {
  const lower = text.toLowerCase();
  const positionen: BillingPosition[] = [];
  const warnungen: ExclusionWarning[] = [];
  const erkannte: string[] = [];
  let optimierterMehrwert = 0;

  const hasBeratung =
    lower.includes('beratung') || lower.includes('aufklärung') || lower.includes('besprechung');
  const hasGanzkörper =
    lower.includes('ganzkörperuntersuchung') ||
    lower.includes('vollständige körperliche untersuchung') ||
    lower.includes('körperliche untersuchung') ||
    lower.includes('alle organsysteme') ||
    lower.includes('organsysteme');
  const hasBlutdruck =
    lower.includes('blutdruck') || lower.includes('rr-messung') || lower.includes('bdm');
  const hasEKG =
    lower.includes('ekg') || lower.includes('elektrokardiogramm');
  const _hasLungeHerz =
    lower.includes('lunge') || lower.includes('herz') || lower.includes('auskultiert') || lower.includes('perkussion');
  void _hasLungeHerz;
  const hasLabor =
    lower.includes('labor') || lower.includes('blutabnahme') || lower.includes('laboranforderung');
  const hasRezept =
    lower.includes('rezept') || lower.includes('schmerzmittel') || lower.includes('medikament');

  if (hasBeratung) {
    erkannte.push('Eingehende Beratung');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 3',
      system: 'GOÄ',
      beschreibung: 'Eingehende Beratung, auch mittels Fernsprecher, Dauer mindestens 10 Minuten',
      kurzBeschreibung: 'Eingehende Beratung (>10 Min.)',
      punkte: 150,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Eingehende Beratung des Patienten über Befunde, Diagnose, Therapiemöglichkeiten und prognostische Einschätzung. Dauer der Beratung überstieg 10 Minuten erheblich, was den Regelsteigerungssatz rechtfertigt. Gemäß § 5 Abs. 2 GOÄ ist der Faktor 2,3 angemessen.`,
      kategorie: 'Beratung & Gespräch',
    });
  }

  if (hasGanzkörper) {
    erkannte.push('Ganzkörperuntersuchung');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 7',
      system: 'GOÄ',
      beschreibung:
        'Vollständige körperliche Untersuchung mit Dokumentation des Ganzkörperstatus',
      kurzBeschreibung: 'Vollständige körperliche Untersuchung',
      punkte: 280,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Vollständige körperliche Untersuchung aller Organsysteme einschließlich Inspektion, Palpation, Perkussion und Auskultation. Die Komplexität des Krankheitsbildes erforderte eine umfassende Erhebung des Ganzkörperstatus. Befunddokumentation erfolgt.`,
      kategorie: 'Untersuchung',
    });
  }

  if (hasBeratung && hasGanzkörper) {
    warnungen.push({
      id: generateId(),
      codes: ['GOÄ 3', 'GOÄ 7'],
      nachricht:
        '⚠️ Hinweis: GOÄ 3 und GOÄ 7 können nebeneinander abgerechnet werden, erfordern jedoch unterschiedliche Diagnosekomplexe oder zeitliche Trennung. Bitte stellen Sie sicher, dass Beratung und Untersuchung inhaltlich klar voneinander abgegrenzt und dokumentiert sind (§ 4 Abs. 2a GOÄ). Eine zeitgleiche Abrechnung ohne Begründung kann zur Beanstandung durch den PKV-Träger führen.',
      severity: 'warning',
    });
  }

  if (hasBlutdruck) {
    erkannte.push('Blutdruckmessung');
    const extra = calcEuro(40, 1.0, 'GOÄ');
    optimierterMehrwert += extra;
    positionen.push({
      id: generateId(),
      code: 'GOÄ 650',
      system: 'GOÄ',
      beschreibung: 'Blutdruckmessung (selbständige Leistung)',
      kurzBeschreibung: 'Blutdruckmessung',
      punkte: 40,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 1.15,
      maxFaktor: 1.15,
      begruendung: `Selbständige Blutdruckmessung als eigenständige diagnostische Maßnahme. Gemäß GOÄ-Systematik nur dann separat berechenbar, wenn nicht Bestandteil einer umfassenden körperlichen Untersuchung.`,
      additionalInfo: 'ℹ️ Nur zusätzlich abrechnbar, wenn nicht Bestandteil von GOÄ 7.',
      kategorie: 'Diagnostische Maßnahmen',
    });
  }

  if (hasEKG) {
    erkannte.push('EKG');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 651',
      system: 'GOÄ',
      beschreibung: 'EKG in Ruhe – Aufnahme und Auswertung mit Befundbericht',
      kurzBeschreibung: 'Ruhe-EKG',
      punkte: 120,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 1.15,
      maxFaktor: 1.15,
      begruendung: `EKG-Aufnahme in Ruhe mit anschließender Befundinterpretation und Arztbericht. Maximaler Multiplikator gemäß GOÄ-Anhang für technische Leistungen.`,
      kategorie: 'Kardiologie',
    });
  }

  if (hasLabor) {
    erkannte.push('Labordiagnostik');
    optimierterMehrwert += calcEuro(60, 1.15, 'GOÄ');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 250',
      system: 'GOÄ',
      beschreibung: 'Blutentnahme aus der Vene (Venenpunktion)',
      kurzBeschreibung: 'Venenpunktion',
      punkte: 60,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 1.15,
      maxFaktor: 1.15,
      begruendung: `Venenpunktion zur Blutentnahme für Laboruntersuchungen. Technik entspricht dem Standard, Steigerungsfaktor technisch gedeckelt.`,
      additionalInfo: '⭐ KI-Erkennung: Laborentnahme häufig nicht gesondert abgerechnet!',
      kategorie: 'Labor & Blutentnahme',
    });
  }

  if (hasRezept && !hasBeratung) {
    optimierterMehrwert += calcEuro(80, 2.3, 'GOÄ');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 1',
      system: 'GOÄ',
      beschreibung: 'Beratung (auch mittels Fernsprecher)',
      kurzBeschreibung: 'Kurze Beratung',
      punkte: 80,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Kurze ärztliche Beratung im Zusammenhang mit der Rezeptausstellung und Medikamenteninformation. Gemäß § 5 GOÄ angemessener Steigerungssatz.`,
      kategorie: 'Beratung & Gespräch',
    });
  }

  const gesamtEuro = positionen.reduce(
    (sum, p) => sum + calcEuro(p.punkte, p.faktor, p.system),
    0
  );

  return { positionen, warnungen, erkannteSchluesselbegriffe: erkannte, gesamtEuro, optimierterMehrwert };
}

// ─────────────────────────────────────────────
// GOÄ: Orthopädie scenario
// ─────────────────────────────────────────────
function parseOrthopaedieGOAE(text: string): ParseResult {
  const lower = text.toLowerCase();
  const positionen: BillingPosition[] = [];
  const warnungen: ExclusionWarning[] = [];
  const erkannte: string[] = [];
  let optimierterMehrwert = 0;

  const hasBeratung = lower.includes('beratung') || lower.includes('aufklärung');
  const hasInjektion =
    lower.includes('injektion') || lower.includes('infiltration') || lower.includes('spritze');
  const hasNeurologisch =
    lower.includes('neurologisch') || lower.includes('nerven') || lower.includes('reflexe') || lower.includes('wirbelsäule');
  const hasFunktionsanalyse =
    lower.includes('funktionsanalyse') || lower.includes('hwz') || lower.includes('hwz') || lower.includes('hwz');
  const _hasPhysio =
    lower.includes('physiotherapie') || lower.includes('physio') || lower.includes('krankengymnastik');
  void _hasPhysio;

  if (hasBeratung) {
    erkannte.push('Eingehende Beratung');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 3',
      system: 'GOÄ',
      beschreibung: 'Eingehende Beratung, auch mittels Fernsprecher, Dauer mindestens 10 Minuten',
      kurzBeschreibung: 'Eingehende Beratung (>10 Min.)',
      punkte: 150,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Eingehende Beratung über orthopädische Befunde, Therapiealternativen (konservativ vs. operativ) und prognostische Einschätzung. Aufwand überstieg 10 Minuten erheblich.`,
      kategorie: 'Beratung & Gespräch',
    });
  }

  if (hasNeurologisch) {
    erkannte.push('Neurologische Untersuchung');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 800',
      system: 'GOÄ',
      beschreibung: 'Neurologische Untersuchung – eingehende Untersuchung des Nervensystems',
      kurzBeschreibung: 'Neurologische Untersuchung',
      punkte: 250,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Eingehende neurologische Untersuchung der Wirbelsäule mit Prüfung der Reflexe, Sensibilität und Motorik zur Differenzialdiagnose einer radikulären Symptomatik.`,
      kategorie: 'Neurologische Diagnostik',
    });
  }

  if (hasInjektion) {
    erkannte.push('Intraartikuläre/perineurale Injektion');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 255',
      system: 'GOÄ',
      beschreibung: 'Injektion, intraartikulär oder perineural',
      kurzBeschreibung: 'Injektion intraartikulär/perineural',
      punkte: 100,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Intraartikuläre/perineurale Injektion an der Lendenwirbelsäule zur gezielten Schmerztherapie. Technisch anspruchsvolle Maßnahme, Steigerungssatz sachlich gerechtfertigt.`,
      kategorie: 'Injektionen & Infusionen',
    });
  }

  if (hasFunktionsanalyse) {
    erkannte.push('Funktionsanalyse HWS');
    optimierterMehrwert += calcEuro(180, 2.3, 'GOÄ');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 5',
      system: 'GOÄ',
      beschreibung: 'Symptombezogene Untersuchung – Wirbelsäule/Gelenke',
      kurzBeschreibung: 'Symptombezogene Untersuchung (HWS)',
      punkte: 180,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Symptombezogene Funktionsuntersuchung der Halswirbelsäule mit Bewegungsanalyse, Palpation der paravertebralen Muskulatur und neurologischer Testung. Aufwand übersteigt eine Routineuntersuchung.`,
      additionalInfo: '⭐ KI-Erkennung: HWS-Funktionsanalyse häufig nicht gesondert kodiert!',
      kategorie: 'Orthopädische Untersuchung',
    });
  }

  const gesamtEuro = positionen.reduce(
    (sum, p) => sum + calcEuro(p.punkte, p.faktor, p.system),
    0
  );

  return { positionen, warnungen, erkannteSchluesselbegriffe: erkannte, gesamtEuro, optimierterMehrwert };
}

// ─────────────────────────────────────────────
// GOÄ: Dermatologie scenario
// ─────────────────────────────────────────────
function parseDermatologieGOAE(text: string): ParseResult {
  const lower = text.toLowerCase();
  const positionen: BillingPosition[] = [];
  const warnungen: ExclusionWarning[] = [];
  const erkannte: string[] = [];
  let optimierterMehrwert = 0;

  const hasBeratung = lower.includes('beratung') || lower.includes('aufklärung');
  const hasBiopsie =
    lower.includes('biopsie') || lower.includes('gewebeentnahme') || lower.includes('histologie');
  const hasExzision =
    lower.includes('exzision') || lower.includes('entfernung') || lower.includes('resektion') || lower.includes('melanom');
  const hasDermatoskopie =
    lower.includes('dermatoskop') || lower.includes('auflichtmikroskop') || lower.includes('hautuntersuchung');
  const hasKryotherapie =
    lower.includes('kryotherapie') || lower.includes('vereisung') || lower.includes('flüssigstickstoff') || lower.includes('stickstoff');

  if (hasBeratung) {
    erkannte.push('Beratung');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 3',
      system: 'GOÄ',
      beschreibung: 'Eingehende Beratung, auch mittels Fernsprecher, Dauer mindestens 10 Minuten',
      kurzBeschreibung: 'Eingehende Beratung (>10 Min.)',
      punkte: 150,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Eingehende dermatologische Beratung über Befunde, Differenzialdiagnosen und Therapieoptionen. Psychologische Belastung des Patienten erhöhte Gesprächsbedarf.`,
      kategorie: 'Beratung & Gespräch',
    });
  }

  if (hasDermatoskopie) {
    erkannte.push('Dermatoskopie');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 612',
      system: 'GOÄ',
      beschreibung: 'Dermatoskopische Untersuchung (Auflichtmikroskopie)',
      kurzBeschreibung: 'Dermatoskopie',
      punkte: 190,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 2.3,
      maxFaktor: 2.5,
      begruendung: `Dermatoskopische Untersuchung zur Beurteilung von Pigmentläsionen auf maligne Transformation. Spezialuntersuchung mit Dokumentation des Befundes.`,
      kategorie: 'Dermatologische Diagnostik',
    });
  }

  if (hasBiopsie) {
    erkannte.push('Probeexzision/Biopsie');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 315',
      system: 'GOÄ',
      beschreibung: 'Entnahme einer Gewebeprobe (Biopsie) aus Haut/Schleimhaut',
      kurzBeschreibung: 'Biopsie Haut/Schleimhaut',
      punkte: 200,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Probeexzision aus suspekter Hautläsion zur histopathologischen Abklärung. Sorgfältige Schnittführung und Wundverschluss erforderten erhöhten Zeitaufwand.`,
      kategorie: 'Operative Eingriffe',
    });
  }

  if (hasExzision) {
    erkannte.push('Exzision/Tumorentfernung');
    optimierterMehrwert += calcEuro(350, 3.5, 'GOÄ');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 2403',
      system: 'GOÄ',
      beschreibung: 'Exzision eines Tumors der Haut oder Unterhaut bis 2 cm Durchmesser',
      kurzBeschreibung: 'Exzision Hauttumor',
      punkte: 350,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 3.5,
      maxFaktor: 3.5,
      begruendung: `Chirurgische Exzision eines suspekten/malignen Hauttumors mit Sicherheitsabstand gemäß Leitlinie. Erhöhte Schwierigkeit durch Lokalisation und Notwendigkeit des plastischen Wundverschlusses rechtfertigt den maximalen Steigerungssatz nach § 5 Abs. 2 GOÄ.`,
      isHighlighted: true,
      kategorie: 'Operative Eingriffe',
    });
  }

  if (hasKryotherapie) {
    erkannte.push('Kryotherapie');
    positionen.push({
      id: generateId(),
      code: 'GOÄ 740',
      system: 'GOÄ',
      beschreibung: 'Kryotherapie – Vereisung von bis zu 5 Bezirken',
      kurzBeschreibung: 'Kryotherapie (bis 5 Bezirke)',
      punkte: 120,
      euroProPunkt: EURO_PRO_PUNKT_GOAE,
      faktor: 2.3,
      maxFaktor: 3.5,
      begruendung: `Kryotherapie mit flüssigem Stickstoff zur Behandlung der Hautveränderungen. Standardtechnik, angemessener Steigerungssatz.`,
      kategorie: 'Physikalische Therapie',
    });
  }

  if (hasBiopsie && hasExzision) {
    warnungen.push({
      id: generateId(),
      codes: ['GOÄ 315', 'GOÄ 2403'],
      nachricht:
        '⚠️ Abrechnungshinweis: GOÄ 315 (Biopsie) und GOÄ 2403 (Exzision) sind grundsätzlich nebeneinander nicht abrechnebar, wenn beide Leistungen an derselben Läsion durchgeführt wurden. Eine Biopsie ist in der Exzisionsleistung eingeschlossen. Bitte prüfen Sie, ob es sich um unterschiedliche Läsionen handelt.',
      severity: 'error',
    });
  }

  const gesamtEuro = positionen.reduce(
    (sum, p) => sum + calcEuro(p.punkte, p.faktor, p.system),
    0
  );

  return { positionen, warnungen, erkannteSchluesselbegriffe: erkannte, gesamtEuro, optimierterMehrwert };
}

// ─────────────────────────────────────────────
// BEMA scenario (simplified)
// ─────────────────────────────────────────────
function parseBEMA(text: string): ParseResult {
  const lower = text.toLowerCase();
  const positionen: BillingPosition[] = [];
  const warnungen: ExclusionWarning[] = [];
  const erkannte: string[] = [];

  const hasFüllung = lower.includes('füllung') || lower.includes('kompositfüllung') || lower.includes('karies');
  const hasBeratung = lower.includes('beratung') || lower.includes('aufklärung');
  const hasRöntgen = lower.includes('röntgen');
  const hasKofferdam = lower.includes('kofferdam');

  if (hasBeratung) {
    erkannte.push('Eingehende Untersuchung (BEMA)');
    positionen.push({
      id: generateId(),
      code: 'BEMA 01',
      system: 'BEMA',
      beschreibung: 'Eingehende Untersuchung inklusive Befundaufnahme',
      kurzBeschreibung: 'Eingehende Untersuchung',
      punkte: 30,
      euroProPunkt: 1.05,
      faktor: 1.0,
      maxFaktor: 1.0,
      begruendung: 'Im BEMA-System sind feste Punktwerte vorgesehen. Keine Steigerungsmöglichkeit.',
      kategorie: 'Untersuchung',
      additionalInfo: 'ℹ️ BEMA: Festbetrag, kein Steigerungssatz möglich.',
    });
  }

  if (hasFüllung) {
    erkannte.push('Kunststofffüllung (BEMA)');
    positionen.push({
      id: generateId(),
      code: 'BEMA 13e',
      system: 'BEMA',
      beschreibung: 'Dreiflächige Kunststofffüllung (Seitenzahn)',
      kurzBeschreibung: 'Dreiflächige Kunststofffüllung',
      punkte: 57,
      euroProPunkt: 1.05,
      faktor: 1.0,
      maxFaktor: 1.0,
      begruendung: 'BEMA-Festwert für dreiflächige Kunststofffüllung im Seitenzahnbereich.',
      kategorie: 'Füllungstherapie',
    });
  }

  if (hasRöntgen) {
    erkannte.push('Röntgenaufnahme (BEMA)');
    positionen.push({
      id: generateId(),
      code: 'BEMA Röa2',
      system: 'BEMA',
      beschreibung: 'Einzelzahnröntgenaufnahme (Zahnfilm)',
      kurzBeschreibung: 'Zahnfilmaufnahme',
      punkte: 14,
      euroProPunkt: 1.05,
      faktor: 1.0,
      maxFaktor: 1.0,
      begruendung: 'BEMA-Festbetrag für Röntgendiagnostik.',
      kategorie: 'Röntgendiagnostik',
    });
  }

  if (hasKofferdam) {
    erkannte.push('Kofferdam (BEMA)');
    warnungen.push({
      id: generateId(),
      codes: ['BEMA Kofferdam'],
      nachricht:
        'ℹ️ Hinweis: Kofferdam ist im BEMA-System nicht als eigenständige Leistungsposition abrechenbar. Die Kosten sind ggf. als Material-Sonderleistung zu dokumentieren.',
      severity: 'info',
    });
  }

  const gesamtEuro = positionen.reduce((sum, p) => sum + p.punkte * p.euroProPunkt, 0);

  return { positionen, warnungen, erkannteSchluesselbegriffe: erkannte, gesamtEuro, optimierterMehrwert: 0 };
}

// ─────────────────────────────────────────────
// Main dispatcher
// ─────────────────────────────────────────────
export function parseDocumentation(
  text: string,
  fachgebiet: Fachgebiet,
  system: Abrechnungssystem
): ParseResult {
  if (text.trim().length < 10) {
    return {
      positionen: [],
      warnungen: [],
      erkannteSchluesselbegriffe: [],
      gesamtEuro: 0,
      optimierterMehrwert: 0,
    };
  }

  if (system === 'BEMA') {
    return parseBEMA(text);
  }

  switch (fachgebiet) {
    case 'Zahnmedizin':
      return parseZahnmedizinGOZ(text);
    case 'Orthopädie':
      return parseOrthopaedieGOAE(text);
    case 'Dermatologie':
      return parseDermatologieGOAE(text);
    case 'Allgemeinmedizin':
    default:
      return parseAllgemeinGOAE(text);
  }
}
