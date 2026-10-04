<script setup lang="ts">
// Eigene Input-Komponente, die sich per v-model einbinden lässt:
// v-model="x" ist Kurzform für :modelValue="x" @update:modelValue="x = $event"
defineProps<{ modelValue: string }>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <label class="search">
    <span class="visually-hidden">Notizen durchsuchen</span>
    <input
      type="search"
      :value="modelValue"
      placeholder="Suchen nach Titel, Text oder Tag …"
      @input="onInput"
    />
  </label>
</template>

<style scoped>
.search {
  display: block;
}

input {
  width: 100%;
  box-sizing: border-box;
  font-size: 1.25rem;
  padding: 14px 16px;
  border-width: 3px;
}
</style>
