import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import { MemobookPreset } from '../src/theme/memobookPreset';
import { replaceFetchWithMockApi, type MockApiOptions } from '../src/mocks/mockApi';

// The app loads styles.css from index.html, which Storybook doesn't use.
import '../src/styles.css';
import '../src/assets/main.scss';

setup((app) => {
  app.use(createPinia());
  app.use(PrimeVue, {
    theme: {
      preset: MemobookPreset,
      options: {
        darkModeSelector: '.dark',
      },
      cssLayer: {
        name: 'primevue',
        order: 'base, primevue',
      },
    },
  });
  app.use(ConfirmationService);
  app.directive('tooltip', Tooltip);
});

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Design System', ['Colours', 'Typography'], 'Components', 'Pages'],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
      parentSelector: 'html',
    }),
    (story, { parameters }) => {
      replaceFetchWithMockApi(parameters.mockApi as MockApiOptions | undefined);
      return story();
    },
  ],
};

export default preview;
