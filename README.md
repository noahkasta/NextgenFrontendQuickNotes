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
Die Notizen liegen in `useNotes`. `NoteCard` bekommt eine Notiz nur als Prop, um sie anzuzeigen. Wenn `NoteCard` die Notiz selbst ändern würde, bekäme `useNotes` davon nichts mit. Dann würden die Liste und `localStorage` nicht mehr zusammenpassen. Vue zeigt in so einem Fall auch eine Warnung an.

Darum gibt `NoteCard` nur Bescheid: Beim Klick auf „Löschen“ schickt sie `emit('delete', note.id)` nach oben. `App.vue` reagiert darauf und ruft `deleteNote(id)` auf. Gelöscht wird also dort, wo die Liste liegt.

**2. Was passiert, wenn zwei Komponenten dasselbe `useNotes()` aufrufen? Teilen sie sich die Notizen?**
Nein. `notes` und `searchTerm` werden innerhalb von `useNotes()` mit `ref()` angelegt. Jeder Aufruf erzeugt also neue Refs. Am Anfang hätten beide Komponenten zwar dieselben Notizen, weil beide aus `localStorage` lesen. Wenn man aber in der einen Komponente eine Notiz anlegt, sieht die andere sie erst nach einem Reload.

In meiner App ruft deshalb nur `App.vue` `useNotes()` auf und gibt die Notizen per Props weiter. Wenn man den Zustand wirklich teilen will, legt man die Refs außerhalb der Funktion an.

**3. Wozu dient das Note-Interface, wenn der Code auch ohne liefe?**
Das Interface legt einmal fest, welche Felder eine Notiz hat: `id`, `title`, `content`, `tags` und `createdAt`. Alle Komponenten und `useNotes` richten sich danach.

Den Vorteil merkt man beim Programmieren. Wenn ich `note.text` statt `note.content` schreibe oder in `addNote` die Tags vergesse, zeigt der Editor sofort einen Fehler. Ohne TypeScript würde ich das erst merken, wenn im Browser etwas fehlt. Außerdem schlägt der Editor die Felder automatisch vor.

`NoteInput` ist eine Notiz ohne `id` und `createdAt`. Daran sieht man, dass das Formular diese zwei Felder nicht mitschicken muss, weil `useNotes` sie selbst setzt.
