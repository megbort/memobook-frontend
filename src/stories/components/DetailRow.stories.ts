import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, fn } from 'storybook/test';
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

export const Text: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Phone:')).toBeVisible();
    await expect(canvas.getByText('+1 (555) 123-4567')).toBeVisible();
  },
};

export const Link: Story = {
  args: { label: 'Website', type: 'link', modelValue: 'www.haroldsphotography.com' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'www.haroldsphotography.com' })).toHaveAttribute(
      'href',
      'https://www.haroldsphotography.com',
    );
  },
};

export const Textarea: Story = {
  args: {
    label: 'Notes',
    type: 'textarea',
    modelValue: 'Always available for deep conversations. Great listener and gives amazing advice.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Notes:')).toBeVisible();
    await expect(canvas.getByText(/Always available for deep conversations/)).toBeVisible();
  },
};

export const Empty: Story = {
  args: { modelValue: null },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Phone:')).toBeVisible();
    await expect(canvas.queryByText('+1 (555) 123-4567')).not.toBeInTheDocument();
  },
};

export const EditingText: Story = {
  args: { editing: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Phone' })).toHaveValue('+1 (555) 123-4567');
  },
};

export const EditingTextarea: Story = {
  args: { ...Textarea.args, editing: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Notes' })).toHaveValue(
      Textarea.args?.modelValue,
    );
  },
};
