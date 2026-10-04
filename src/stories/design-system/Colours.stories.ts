import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import ColourPalette from './ColourPalette.vue';

const meta = {
  title: 'Design System/Colours',
  component: ColourPalette,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ColourPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

const BRAND_COLOUR_COUNT = 14;

export const Palette: Story = {
  play: async ({ canvas }) => {
    for (const group of ['Greens', 'Blues', 'Neutrals', 'Feedback', 'PrimeVue primary scale']) {
      await expect(canvas.getByRole('heading', { name: group })).toBeVisible();
    }
    await expect(canvas.getAllByRole('article')).toHaveLength(BRAND_COLOUR_COUNT);
    await expect(canvas.getByText('#81DE76', { exact: false })).toBeVisible();
  },
};
