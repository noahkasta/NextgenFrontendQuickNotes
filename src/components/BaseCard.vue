<script setup lang="ts">
// Generische Card: weiß nichts von Notizen, stellt nur Rahmen + Slots bereit.
</script>

<template>
  <article class="card">
    <header v-if="$slots.header" class="card__header">
      <slot name="header" />
    </header>
    <div class="card__body">
      <slot />
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--white);
  border: var(--line);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
  transition: box-shadow 0.12s, transform 0.12s;
}

.card:hover {
  box-shadow: 6px 6px 0 var(--black);
  transform: translate(-3px, -3px);
}

.card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 14px;
  border-bottom: var(--line);
}

.card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
