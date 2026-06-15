// Standarddauer einer Pomodoro-Session in Minuten. Bewusst fix (Entscheidung
// siehe docs/entscheidungen.md) und an EINER Stelle definiert, damit Server
// Action, Page und Timer-Anzeige dieselbe Quelle nutzen. Die gespeicherte Dauer
// wird serverseitig aus dieser Konstante gesetzt — der Client kann sie nicht
// beeinflussen.
export const DEFAULT_DURATION_MINUTES = 25;
