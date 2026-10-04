<script setup lang="ts">
import BaseCard from './BaseCard.vue'
import type { Note } from '../types/note'

const props = defineProps<{ note: Note }>()

// NoteCard löscht nicht selbst, sondern meldet nur nach oben, welche Notiz weg soll.
const emit = defineEmits<{ delete: [id: string] }>()

const formattedDate = new Date(props.note.createdAt).toLocaleString('de-AT', {
  dateStyle: 'medium',
  timeStyle: 'short',
})
</script>

<template>
  <BaseCard>
    <template #header>
      <h2 class="note__title">{{ note.title }}</h2>
      <button
        type="button"
        class="note__delete"
        :aria-label="`Notiz „${note.title}“ löschen`"
        @click="emit('delete', note.id)"
      >
        Löschen
      </button>
    </template>

    <p v-if="note.content" class="note__content">{{ note.content }}</p>

    <ul v-if="note.tags.length" class="tags">
      <li v-for="tag in note.tags" :key="tag" class="tag">#{{ tag }}</li>
    </ul>

    <time class="note__date label" :datetime="new Date(note.createdAt).toISOString()">
      {{ formattedDate }}
    </time>
  </BaseCard>
</template>

<style scoped>
.note__title {
  font-size: 1.4rem;
  overflow-wrap: anywhere;
}

.note__content {
  white-space: pre-wrap; /* Zeilenumbrüche aus der Eingabe beibehalten */
  overflow-wrap: anywhere;
}

.note__delete {
  flex-shrink: 0;
  padding: 6px 10px;
}

.note__date {
  color: var(--grey);
}
</style>
