import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DashboardView from '@/views/DashboardView.vue';

const meta = {
  title: 'Pages/Dashboard',
  component: DashboardView,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DashboardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LoadError: Story = {
  parameters: { mockApi: { failWithStatus: 500 } },
};
