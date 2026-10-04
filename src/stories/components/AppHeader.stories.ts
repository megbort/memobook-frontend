import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AppHeader from '@/components/AppHeader.vue';

const meta = {
  title: 'Components/AppHeader',
  component: AppHeader,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
