<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { toHref } from '../models/contact';

const props = defineProps<{
  label: string;
  editing?: boolean;
  type?: 'text' | 'link' | 'textarea';
}>();

const model = defineModel<string | null | undefined>();
</script>

<template>
  <div v-if="props.type === 'textarea'" class="flex flex-col gap-2">
    <span class="text-sm font-medium text-memobook-dark-grey">{{ props.label }}:</span>
    <Textarea v-if="props.editing" v-model="model" rows="3" autoResize :aria-label="props.label" />
    <div v-else-if="model" class="p-3 rounded-lg border border-memobook-dark-grey/40">
      <p class="text-memobook-black dark:text-memobook-white m-0">{{ model }}</p>
    </div>
  </div>

  <div v-else class="flex gap-2 items-baseline flex-wrap">
    <span class="text-sm font-medium text-memobook-dark-grey min-w-[100px] flex-shrink-0"
      >{{ props.label }}:</span
    >
    <InputText
      v-if="props.editing"
      v-model="model"
      size="small"
      class="flex-1 min-w-0"
      :aria-label="props.label"
    />
    <a
      v-else-if="props.type === 'link' && model"
      :href="toHref(model)"
      class="text-memobook-blue hover:text-memobook-dark-blue underline"
      target="_blank"
      rel="noopener"
      >{{ model }}</a
    >
    <p v-else class="contact-value text-memobook-black dark:text-memobook-white m-0">
      {{ model ?? '' }}
    </p>
    <slot name="actions" />
  </div>
</template>
