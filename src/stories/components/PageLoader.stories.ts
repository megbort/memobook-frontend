import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, within } from 'storybook/test';
import PageLoader from '@/components/PageLoader.vue';

const meta = {
  title: 'Components/PageLoader',
  component: PageLoader,
  parameters: { layout: 'fullscreen' },
  args: { visible: true },
} satisfies Meta<typeof PageLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // The loader teleports to <body>, outside the story canvas.
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await expect(page.getByRole('status', { name: 'Saving' })).toBeVisible();
  },
};
