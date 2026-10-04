import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import TypographyScale from './TypographyScale.vue';

const meta = {
  title: 'Design System/Typography',
  component: TypographyScale,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TypographyScale>;

export default meta;
type Story = StoryObj<typeof meta>;

const TYPE_STYLE_NAMES = [
  'Logo',
  'Heading 1',
  'Heading 2',
  'Subtitle 1',
  'Subtitle 2',
  'Body 1',
  'Body 1 Bold',
  'Body 2',
  'Body 2 Bold',
  'Caption',
];

export const TypeScale: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Knewave')).toBeVisible();
    await expect(canvas.getByText('Ubuntu')).toBeVisible();
    for (const name of TYPE_STYLE_NAMES) {
      await expect(canvas.getByText(name, { selector: 'p' })).toBeVisible();
    }
  },
};
