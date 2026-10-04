import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import ContactTimeline from '@/components/ContactTimeline.vue';
import { TimelineEvents } from '@/mocks/timeline';

const meta = {
  title: 'Components/ContactTimeline',
  component: ContactTimeline,
  tags: ['autodocs'],
  args: { events: TimelineEvents },
  decorators: [() => ({ template: '<div style="width: 640px"><story /></div>' })],
} satisfies Meta<typeof ContactTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    for (const event of TimelineEvents) {
      await expect(canvas.getByText(event.summary)).toBeVisible();
    }
  },
};

export const Empty: Story = {
  args: { events: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No activity yet.')).toBeVisible();
  },
};
