import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import DemoBanner from '@/components/DemoBanner.vue';

const meta = {
  title: 'Components/DemoBanner',
  component: DemoBanner,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DemoBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/demo purposes only/)).toBeVisible();
  },
};
