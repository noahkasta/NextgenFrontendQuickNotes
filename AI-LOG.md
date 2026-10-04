# AI-LOG

<!-- "Geändert/verstanden" bitte selbst ausfüllen: was du angepasst hast bzw. was du jetzt erklären kannst. -->

- Prompt: "Kannst du mir helfen, die Hausübung 2 (PDF) in Code umzusetzen und dabei alles beachten, was in der PDF steht?" (Claude Code)
  Übernommen: Grundgerüst aller vorgegebenen Dateien (BaseCard, NoteCard, NoteForm, SearchBar, useNotes, useLocalStorage, note.ts)
  Geändert/verstanden: …

- Prompt: (Teil desselben Auftrags) Persistenz über localStorage
  Übernommen: `useLocalStorage` mit `watch(..., { deep: true })` und try/catch um `JSON.parse`
  Geändert/verstanden: …

- Prompt: (Teil desselben Auftrags) v-model auf eigener Komponente
  Übernommen: `modelValue`-Prop + `emit('update:modelValue', ...)` in SearchBar
  Geändert/verstanden: …

- Prompt: (Teil desselben Auftrags) Composables sollen laut Vorgabe `.js` sein, Projekt ist aber TypeScript
  Übernommen: `allowJs` + `checkJs` in tsconfig, JSDoc-Typen (`@typedef {import('../types/note').Note}`)
  Geändert/verstanden: …

- Prompt: (Teil desselben Auftrags) README-Reflexionsfragen
  Übernommen: Entwurf der Antworten
  Geändert/verstanden: …
- Prompt: „Styling minimalistisch, schwarz-weiß, brutalistisch“ – Übernommen: CSS-Stil.
