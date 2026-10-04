# QuickNotes

Eine kleine Notiz-App mit Vue 3, Vite und TypeScript. Man kann Notizen mit Titel, Text und Tags anlegen, löschen und live durchsuchen. Die Notizen werden in `localStorage` gespeichert und sind nach einem Reload noch da.

## Setup

Voraussetzung: Node.js (ab Version 20).

```bash
npm install     # Abhängigkeiten installieren
npm run dev     # Dev-Server starten -> http://localhost:5173
npm run build   # Typprüfung (vue-tsc) + Production-Build nach dist/
```

## Struktur

```
src/
  App.vue                     ruft useNotes() auf, verbindet alles
  components/
    BaseCard.vue              generische Card mit #header-Slot + Default-Slot
    NoteCard.vue              eine Notiz, nutzt BaseCard, meldet "delete" per emit
    NoteForm.vue              Formular, meldet neue Notiz per emit "add"
    SearchBar.vue             Input mit modelValue / update:modelValue (v-model)
  composables/
    useNotes.js               Notiz-Liste, addNote, deleteNote, gefilterte Ansicht
    useLocalStorage.js        einziger Ort mit localStorage-Zugriffen
  types/
    note.ts                   Note-Interface (+ NoteInput)
```

**Warum liegt die Logik im Composable?**
Die Komponenten sollen nur anzeigen und Eingaben melden. Liste, Filter und Speichern stecken deshalb in `useNotes` bzw. `useLocalStorage`. So ist die Logik an einer Stelle, lässt sich ohne UI verstehen und testen, und die Komponenten bleiben klein und austauschbar. `BaseCard` weiß zum Beispiel gar nichts von Notizen und könnte überall verwendet werden.

Die Composables sind laut Vorgabe `.js`-Dateien. Mit `allowJs` und `checkJs` in der `tsconfig.app.json` und mit JSDoc-Kommentaren prüft TypeScript sie trotzdem gegen das `Note`-Interface.

## Reflexion

**1. Warum darf NoteCard die Notiz-Prop nicht selbst verändern, und wie löst ihr das stattdessen?**
Props gehören der Elternkomponente, und Daten fließen nur in eine Richtung (nach unten). Würde `NoteCard` die Notiz selbst ändern oder löschen, wüsste `App.vue` bzw. `useNotes` nichts davon. Dann wären die Liste, der Filter und `localStorage` nicht mehr synchron. Vue warnt außerdem bei Prop-Mutationen. Deshalb sendet `NoteCard` nur `emit('delete', note.id)`, und `App.vue` ruft darauf `deleteNote(id)` aus `useNotes` auf. Die Änderung passiert also dort, wo die Daten liegen.

**2. Was passiert, wenn zwei Komponenten dasselbe `useNotes()` aufrufen? Teilen sie sich die Notizen?**
Nein. Die Refs (`notes`, `searchTerm`) werden *innerhalb* der Funktion erzeugt, also bekommt jeder Aufruf eigene, unabhängige Refs. Beide würden beim Start dieselben Daten aus `localStorage` lesen, danach aber auseinanderlaufen: Eine neue Notiz in der einen Instanz sieht die andere erst nach einem Reload. Deshalb ruft bei uns nur `App.vue` `useNotes()` auf und gibt die Daten per Props weiter. Wollte man den Zustand teilen, müsste man die Refs *außerhalb* der Funktion auf Modulebene anlegen (oder einen Store wie Pinia verwenden).

**3. Wozu dient das Note-Interface, wenn der Code auch ohne liefe?**
Es legt fest, wie eine Notiz aussieht. Das ist der „Vertrag“ zwischen `NoteForm`, `useNotes`, `App.vue` und `NoteCard`. Schreibt man z. B. `note.text` statt `note.content` oder vergisst man `tags` in `addNote`, meldet das der Editor bzw. `vue-tsc` schon beim Schreiben und nicht erst als leere Stelle im Browser. Dazu kommen Autovervollständigung und eine eingebaute Dokumentation der Datenstruktur. `NoteInput` (= `Note` ohne `id`/`createdAt`) zeigt außerdem, dass das Formular diese beiden Felder nicht liefern muss, weil `useNotes` sie vergibt.
