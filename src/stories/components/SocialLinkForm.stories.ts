import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
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

export const Instagram: Story = {};

export const OtherWithLabel: Story = {
  args: {
    modelValue: {
      platform: 'other',
      label: 'Portfolio',
      handle: 'haroldsphotography',
      url: 'www.haroldsphotography.com',
    },
  },
};

export const Empty: Story = {
  args: {
    modelValue: { platform: 'instagram', label: '', handle: '', url: '' },
  },
};
