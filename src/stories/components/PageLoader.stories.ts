import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PageLoader from '@/components/PageLoader.vue';

const meta = {
  title: 'Components/PageLoader',
  component: PageLoader,
  parameters: { layout: 'fullscreen' },
  args: { visible: true },
} satisfies Meta<typeof PageLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
