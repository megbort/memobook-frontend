import type { StorybookConfig } from '@storybook/vue3-vite';
import type { PluginOption } from 'vite';

// Vue DevTools and its inspector inject into the page and clash with the Storybook iframe.
const isDevtoolsPlugin = (plugin: PluginOption) =>
  !!plugin && 'name' in plugin && /devtools|inspect/i.test(plugin.name);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
  framework: '@storybook/vue3-vite',
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    plugins: (viteConfig.plugins ?? [])
      .flat(Infinity as 1)
      .filter((plugin) => !isDevtoolsPlugin(plugin)),
  }),
};

export default config;
