/** Eine gespeicherte Notiz. */
export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: number // Zeitstempel in ms (Date.now())
}

/** Das, was NoteForm liefert – id und createdAt vergibt erst useNotes. */
export type NoteInput = Omit<Note, 'id' | 'createdAt'>
