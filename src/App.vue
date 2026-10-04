<script setup lang="ts">
import NoteCard from './components/NoteCard.vue'
import NoteForm from './components/NoteForm.vue'
import SearchBar from './components/SearchBar.vue'
import { useNotes } from './composables/useNotes.js'

// App.vue ist die einzige Stelle, die useNotes() aufruft.
// Die Daten fließen per Props nach unten, Änderungen kommen per emit / v-model zurück.
const { notes, searchTerm, filteredNotes, addNote, deleteNote } = useNotes()
</script>

<template>
  <header class="app-header">
    <h1>Quick<br />Notes</h1>
    <p class="label">Notizen / Tags / Suche / localStorage</p>
  </header>

  <main class="layout">
    <section class="panel" aria-labelledby="new-note-heading">
      <h2 id="new-note-heading">Neue Notiz</h2>
      <NoteForm @add="addNote" />
    </section>

    <section class="notes" aria-labelledby="notes-heading">
      <div class="notes__top">
        <h2 id="notes-heading">Notizen</h2>
        <span class="count label">
          <template v-if="searchTerm.trim()">{{ filteredNotes.length }} von </template>
          {{ notes.length }}
        </span>
      </div>

      <SearchBar v-model="searchTerm" />

      <p v-if="notes.length === 0" class="empty">
        Noch keine Notizen. Leg links deine erste an.
      </p>
      <p v-else-if="filteredNotes.length === 0" class="empty">
        Keine Notiz passt zu „{{ searchTerm }}“.
      </p>

      <ul v-else class="note-list">
        <li v-for="note in filteredNotes" :key="note.id">
          <NoteCard :note="note" @delete="deleteNote" />
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.app-header {
  padding: 48px 0 20px;
  border-bottom: 6px solid var(--black);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.layout {
  display: grid;
  grid-template-columns: minmax(260px, 340px) 1fr;
  gap: 40px;
  align-items: start;
  padding: 40px 0 64px;
}

.panel {
  position: sticky;
  top: 24px;
  border: var(--line);
  padding: 20px;
  box-shadow: 8px 8px 0 var(--black);
}

.panel h2 {
  margin-bottom: 20px;
}

.notes {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.notes__top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.note-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty {
  padding: 48px 16px;
  text-align: center;
  border: 2px dashed var(--black);
}

@media (max-width: 760px) {
  .layout {
    grid-template-columns: 1fr;
    padding-top: 24px;
  }

  .panel {
    position: static;
  }
}
</style>
