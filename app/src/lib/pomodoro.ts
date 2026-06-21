// Pomodoro-Intervalldauern in Minuten. Bewusst fix (Entscheidung siehe
// docs/entscheidungen.md) und an EINER Stelle definiert, damit Server Action,
// Page, Timer-Anzeige und Dashboard dieselbe Quelle nutzen. Die gespeicherte
// Dauer wird serverseitig aus diesen Konstanten gesetzt — der Client kann sie
// nicht beeinflussen.
export const WORK_DURATION_MINUTES = 25;
export const BREAK_DURATION_MINUTES = 5;

// Alias: Die in der DB gespeicherte Session-Dauer entspricht der Arbeitslänge
// (nur abgeschlossene Arbeits-Sessions werden als Pomodoro gezählt, Pausen nicht).
export const DEFAULT_DURATION_MINUTES = WORK_DURATION_MINUTES;
