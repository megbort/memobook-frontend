import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import ContactFormDialog from '@/components/ContactFormDialog.vue';

const meta = {
  title: 'Components/ContactFormDialog',
  component: ContactFormDialog,
  parameters: { layout: 'fullscreen' },
  args: {
    visible: true,
    'onUpdate:visible': fn(),
    onCreated: fn(),
  },
  decorators: [() => ({ template: '<div style="height: 100vh"><story /></div>' })],
} satisfies Meta<typeof ContactFormDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
