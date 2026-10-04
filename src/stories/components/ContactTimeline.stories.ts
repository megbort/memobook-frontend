import type { Meta, StoryObj } from '@storybook/vue3-vite';
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

export const Default: Story = {};

export const Empty: Story = {
  args: { events: [] },
};
