import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ColourPalette from './ColourPalette.vue';

const meta = {
  title: 'Design System/Colours',
  component: ColourPalette,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ColourPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {};
