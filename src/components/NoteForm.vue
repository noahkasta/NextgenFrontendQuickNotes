<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NoteInput } from '../types/note'

// Das Formular speichert nichts selbst, sondern meldet die neue Notiz an App.vue.
const emit = defineEmits<{ add: [note: NoteInput] }>()

const title = ref('')
const content = ref('')
const tagInput = ref('')

// "vue, Uni ,#vue" -> ["vue", "uni"]  (getrimmt, ohne #, klein, ohne Duplikate)
const tags = computed(() => {
  const parsed = tagInput.value
    .split(',')
    .map((tag) => tag.trim().replace(/^#/, '').toLowerCase())
    .filter((tag) => tag !== '')
  return [...new Set(parsed)]
})

const canSubmit = computed(() => title.value.trim() !== '')

function submit() {
  if (!canSubmit.value) return

  emit('add', {
    title: title.value.trim(),
    content: content.value.trim(),
    tags: tags.value,
  })

  title.value = ''
  content.value = ''
  tagInput.value = ''
}
</script>

<template>
  <form class="note-form" @submit.prevent="submit">
    <label class="label">
      Titel
      <input v-model="title" type="text" required placeholder="z. B. Einkaufsliste" />
    </label>

    <label class="label">
      Text
      <textarea v-model="content" rows="4" placeholder="Worum geht's?" />
    </label>

    <label class="label">
      Tags <span class="hint">(mit Komma trennen)</span>
      <input v-model="tagInput" type="text" placeholder="z. B. uni, vue, wichtig" />
    </label>

    <ul v-if="tags.length" class="tags" aria-label="Vorschau der Tags">
      <li v-for="tag in tags" :key="tag" class="tag">#{{ tag }}</li>
    </ul>

    <button type="submit" class="primary" :disabled="!canSubmit">Notiz anlegen</button>
  </form>
</template>

<style scoped>
.note-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hint {
  color: var(--grey);
  text-transform: none;
}

/* Eingabefelder sollen nicht die Label-Schrift (Mono, Großbuchstaben) erben */
input,
textarea {
  font: 1rem/1.5 var(--sans);
  text-transform: none;
  letter-spacing: normal;
}

textarea {
  resize: vertical;
}
</style>
