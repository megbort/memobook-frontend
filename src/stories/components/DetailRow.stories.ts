import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import DetailRow from '@/components/DetailRow.vue';

const meta = {
  title: 'Components/DetailRow',
  component: DetailRow,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'inline-radio', options: ['text', 'link', 'textarea'] },
  },
  args: {
    label: 'Phone',
    modelValue: '+1 (555) 123-4567',
    type: 'text',
    editing: false,
    'onUpdate:modelValue': fn(),
  },
  decorators: [() => ({ template: '<div style="width: 420px"><story /></div>' })],
} satisfies Meta<typeof DetailRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};

export const Link: Story = {
  args: { label: 'Website', type: 'link', modelValue: 'www.haroldsphotography.com' },
};

export const Textarea: Story = {
  args: {
    label: 'Notes',
    type: 'textarea',
    modelValue: 'Always available for deep conversations. Great listener and gives amazing advice.',
  },
};

export const Empty: Story = {
  args: { modelValue: null },
};

export const EditingText: Story = {
  args: { editing: true },
};

export const EditingTextarea: Story = {
  args: { ...Textarea.args, editing: true },
};
