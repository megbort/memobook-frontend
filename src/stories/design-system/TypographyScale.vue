<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

interface TypeStyle {
  name: string;
  mixin: string;
  tag: 'h1' | 'h2' | 'p';
  className?: string;
  sample: string;
}

const TYPE_STYLES: TypeStyle[] = [
  { name: 'Logo', mixin: 'h1 + font-logo', tag: 'h1', className: 'logo', sample: 'MemoBook' },
  { name: 'Heading 1', mixin: 'h1', tag: 'h1', sample: 'Harold Hidethepain' },
  { name: 'Heading 2', mixin: 'h2', tag: 'h2', sample: 'Personal Information' },
  {
    name: 'Subtitle 1',
    mixin: 'subtitle-1',
    tag: 'p',
    className: 'subtitle-1',
    sample: 'My childhood best friend',
  },
  {
    name: 'Subtitle 2',
    mixin: 'subtitle-2',
    tag: 'p',
    className: 'subtitle-2',
    sample: 'Socials',
  },
  {
    name: 'Body 1',
    mixin: 'text-body-1',
    tag: 'p',
    className: 'text-body-1',
    sample: 'Always available for deep conversations. Great listener and gives amazing advice.',
  },
  {
    name: 'Body 1 Bold',
    mixin: 'text-body-1 .bold',
    tag: 'p',
    className: 'text-body-1 bold',
    sample: 'Always available for deep conversations.',
  },
  {
    name: 'Body 2',
    mixin: 'text-body-2',
    tag: 'p',
    className: 'text-body-2',
    sample: 'Gaming enthusiast. Still plays our favorite MMO every weekend.',
  },
  {
    name: 'Body 2 Bold',
    mixin: 'text-body-2 .bold',
    tag: 'p',
    className: 'text-body-2 bold',
    sample: 'Gaming enthusiast.',
  },
  {
    name: 'Caption',
    mixin: 'text-caption',
    tag: 'p',
    className: 'text-caption',
    sample: 'Designed and built by Megan Krenbrink',
  },
];

const FONT_FAMILIES = [
  { name: 'Knewave', variable: '--font-logo', usage: 'Logo only', weights: [400] },
  { name: 'Ubuntu', variable: '--font-body', usage: 'Everything else', weights: [400, 500, 700] },
];

const sampleElements = ref<HTMLElement[]>([]);
const measuredStyles = ref<string[]>([]);

// Sizes change at the md/lg breakpoints, so they are measured rather than copied from the SCSS.
const measureStyles = () => {
  measuredStyles.value = sampleElements.value.map((element) => {
    const { fontSize, fontWeight, lineHeight, letterSpacing } = getComputedStyle(element);
    return `${fontSize} / ${lineHeight} · weight ${fontWeight} · tracking ${letterSpacing}`;
  });
};

onMounted(() => {
  measureStyles();
  window.addEventListener('resize', measureStyles);
});

onBeforeUnmount(() => window.removeEventListener('resize', measureStyles));
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <header class="flex flex-col gap-2">
      <h1>Typography</h1>
      <p class="text-body-1">
        Type styles are SCSS mixins in <code>src/assets/typographic.scss</code>, applied globally to
        <code>h1</code>, <code>h2</code> and the utility classes below.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2>Font families</h2>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        <article
          v-for="font in FONT_FAMILIES"
          :key="font.name"
          class="flex flex-col gap-2 p-4 rounded-lg border border-memobook-dark-grey/40"
        >
          <p class="font-sample" :style="{ fontFamily: `var(${font.variable})` }">Aa Bb Cc 123</p>
          <p class="subtitle-2">{{ font.name }}</p>
          <code class="text-caption">var({{ font.variable }})</code>
          <span class="text-caption text-memobook-dark-grey">
            {{ font.usage }} · weights {{ font.weights.join(', ') }}
          </span>
        </article>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2>Type scale</h2>
      <div
        v-for="(style, index) in TYPE_STYLES"
        :key="style.name"
        class="grid grid-cols-[260px_1fr] gap-6 items-baseline py-4 border-b border-memobook-dark-grey/30"
      >
        <div class="flex flex-col gap-1">
          <p class="subtitle-2">{{ style.name }}</p>
          <code class="text-caption">@include {{ style.mixin }}</code>
          <code class="text-caption">
            &lt;{{ style.tag }}{{ style.className ? ` class="${style.className}"` : '' }}&gt;
          </code>
          <span class="text-caption text-memobook-dark-grey">{{ measuredStyles[index] }}</span>
        </div>
        <component :is="style.tag" ref="sampleElements" :class="style.className">
          {{ style.sample }}
        </component>
      </div>
    </section>
  </div>
</template>

<style scoped>
.font-sample {
  font-size: 2rem;
  line-height: 2.5rem;
}
</style>
