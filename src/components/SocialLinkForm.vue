<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { SOCIAL_PLATFORMS, type SocialLinkInput } from '../models/contact';

const social = defineModel<SocialLinkInput>({ required: true });
</script>

<template>
  <div class="flex flex-wrap gap-2 items-center">
    <Select
      v-model="social.platform"
      :options="SOCIAL_PLATFORMS"
      optionLabel="label"
      optionValue="value"
      size="small"
      class="w-36"
      aria-label="Platform"
    >
      <template #option="{ option }">
        <span class="flex items-center gap-2">
          <i :class="option.icon" />
          <span>{{ option.label }}</span>
        </span>
      </template>
    </Select>
    <InputText
      v-if="social.platform === 'other'"
      v-model="social.label"
      placeholder="Name (e.g. Twitch)"
      size="small"
      class="w-36"
      aria-label="Social name"
    />
    <InputText
      v-model="social.handle"
      placeholder="@handle"
      size="small"
      class="w-28"
      aria-label="Handle"
    />
    <InputText
      v-model="social.url"
      placeholder="https://…"
      size="small"
      class="flex-1 min-w-24"
      aria-label="URL"
    />
    <slot />
  </div>
</template>
