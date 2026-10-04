import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, fn } from 'storybook/test';
import SocialLinkForm from '@/components/SocialLinkForm.vue';

const meta = {
  title: 'Components/SocialLinkForm',
  component: SocialLinkForm,
  tags: ['autodocs'],
  args: {
    modelValue: {
      platform: 'instagram',
      label: null,
      handle: '@haroldsmiles',
      url: 'https://instagram.com/haroldsmiles',
    },
    'onUpdate:modelValue': fn(),
  },
  decorators: [() => ({ template: '<div style="width: 640px"><story /></div>' })],
} satisfies Meta<typeof SocialLinkForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Instagram: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: 'Platform' })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Handle' })).toHaveValue('@haroldsmiles');
    await expect(canvas.getByRole('textbox', { name: 'URL' })).toHaveValue(
      'https://instagram.com/haroldsmiles',
    );
    await expect(canvas.queryByRole('textbox', { name: 'Social name' })).not.toBeInTheDocument();
  },
};

export const OtherWithLabel: Story = {
  args: {
    modelValue: {
      platform: 'other',
      label: 'Portfolio',
      handle: 'haroldsphotography',
      url: 'www.haroldsphotography.com',
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Social name' })).toHaveValue('Portfolio');
  },
};

export const Empty: Story = {
  args: {
    modelValue: { platform: 'instagram', label: '', handle: '', url: '' },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Handle' })).toHaveValue('');
    await expect(canvas.getByRole('textbox', { name: 'URL' })).toHaveValue('');
  },
};
