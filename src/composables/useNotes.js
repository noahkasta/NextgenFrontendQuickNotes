import { computed, ref } from 'vue'
import { useLocalStorage } from './useLocalStorage.js'

/** @typedef {import('../types/note').Note} Note */
/** @typedef {import('../types/note').NoteInput} NoteInput */

const STORAGE_KEY = 'quicknotes.notes'

/**
 * Die gesamte Notiz-Logik: Liste, Hinzufügen, Löschen und gefilterte Ansicht.
 * Komponenten verwalten die Liste nicht selbst, sondern nutzen nur diese Funktionen.
 */
export function useNotes() {
  /** @type {import('vue').Ref<Note[]>} */
  const notes = useLocalStorage(STORAGE_KEY, /** @type {Note[]} */ ([]))

  // Suchbegriff, wird in App.vue per v-model an die SearchBar gebunden
  const searchTerm = ref('')

  // Gefilterte Ansicht: sucht in Titel, Text und Tags (Groß-/Kleinschreibung egal)
  const filteredNotes = computed(() => {
    const query = searchTerm.value.trim().toLowerCase()
    if (query === '') return notes.value

    return notes.value.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  })

  /** @param {NoteInput} input */
  function addNote(input) {
    /** @type {Note} */
    const note = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...input,
    }
    notes.value.unshift(note) // neueste Notiz oben
  }

  /** @param {string} id */
  function deleteNote(id) {
    notes.value = notes.value.filter((note) => note.id !== id)
  }

  return { notes, searchTerm, filteredNotes, addNote, deleteNote }
}
