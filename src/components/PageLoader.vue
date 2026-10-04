<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';

defineProps<{
  visible: boolean;
}>();
</script>

<template>
  <Teleport to="body">
    <output
      v-if="visible"
      aria-label="Saving"
      class="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30"
    >
      <ProgressSpinner />
    </output>
  </Teleport>
</template>
