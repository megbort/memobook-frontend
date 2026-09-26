<template>
  <div class="bg-memobook-dark-green text-memobook-white p-8 flex items-center justify-between">
    <h1 class="logo">MemoBook</h1>
    <Button
      :icon="theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
      rounded
      text
      severity="secondary"
      aria-label="Toggle theme"
      class="!text-memobook-light-green opacity-80 hover:opacity-100"
      @click="toggleTheme"
    />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { useTheme } from '../composables/useTheme';

const { theme, toggleTheme } = useTheme();
</script>
