<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface ColourToken {
  name: string;
  usage: string;
}

const COLOUR_GROUPS: { title: string; tokens: ColourToken[] }[] = [
  {
    title: 'Greens',
    tokens: [
      { name: 'light-green', usage: 'Highlights, selected list items' },
      { name: 'green', usage: 'Primary brand colour, side panel' },
      { name: 'dark-green', usage: 'Header, hover text, active tab' },
    ],
  },
  {
    title: 'Blues',
    tokens: [
      { name: 'light-blue', usage: 'Accents' },
      { name: 'blue', usage: 'Filled buttons, links' },
      { name: 'dark-blue', usage: 'Secondary buttons, demo banner, link hover' },
    ],
  },
  {
    title: 'Neutrals',
    tokens: [
      { name: 'black', usage: 'Body text (light), background (dark)' },
      { name: 'dark-grey', usage: 'Labels, neutral outlines' },
      { name: 'light-grey', usage: 'Body text (dark)' },
      { name: 'white', usage: 'Background (light), text on colour' },
    ],
  },
  {
    title: 'Feedback',
    tokens: [
      { name: 'error', usage: 'Danger buttons, required markers' },
      { name: 'error-dark', usage: 'Danger hover' },
      { name: 'warning', usage: 'Warnings' },
      { name: 'warning-dark', usage: 'Warning hover' },
    ],
  },
];

const PRIMARY_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const resolvedHex = ref<Record<string, string>>({});

onMounted(() => {
  const rootStyle = getComputedStyle(document.documentElement);
  resolvedHex.value = Object.fromEntries(
    COLOUR_GROUPS.flatMap((group) => group.tokens).map(({ name }) => [
      name,
      rootStyle.getPropertyValue(`--memobook-${name}`).trim(),
    ]),
  );
});
</script>

<template>
  <div class="colour-palette flex flex-col gap-10 p-8">
    <header class="flex flex-col gap-2">
      <h1>Colours</h1>
      <p class="text-body-1">
        Brand palette from Figma. Defined as Tailwind tokens in <code>src/styles.css</code> and as
        CSS variables in <code>src/assets/base.scss</code>; keep both in sync.
      </p>
    </header>

    <section v-for="group in COLOUR_GROUPS" :key="group.title" class="flex flex-col gap-4">
      <h2>{{ group.title }}</h2>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        <article
          v-for="token in group.tokens"
          :key="token.name"
          class="rounded-lg overflow-hidden border border-memobook-dark-grey/40"
        >
          <div class="h-24" :style="{ background: `var(--memobook-${token.name})` }" />
          <div class="flex flex-col gap-1 p-3">
            <p class="subtitle-2">{{ token.name }}</p>
            <p class="text-body-2 uppercase">{{ resolvedHex[token.name] }}</p>
            <code class="text-caption">bg-memobook-{{ token.name }}</code>
            <code class="text-caption">--memobook-{{ token.name }}</code>
            <span class="text-caption text-memobook-dark-grey">{{ token.usage }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2>PrimeVue primary scale</h2>
      <p class="text-body-2">
        Generated in <code>src/theme/memobookPreset.ts</code> from the greens; used by PrimeVue
        components via <code>--p-primary-*</code>.
      </p>
      <div class="flex rounded-lg overflow-hidden">
        <div
          v-for="shade in PRIMARY_SHADES"
          :key="shade"
          class="flex-1 h-20 flex items-end justify-center pb-2"
          :style="{ background: `var(--p-primary-${shade})` }"
        >
          <span
            class="text-caption"
            :class="shade >= 600 ? 'shade-label-light' : 'shade-label-dark'"
          >
            {{ shade }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.shade-label-light {
  color: var(--memobook-white);
}

.shade-label-dark {
  color: var(--memobook-black);
}
</style>
