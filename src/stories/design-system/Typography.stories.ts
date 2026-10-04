import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TypographyScale from './TypographyScale.vue';

const meta = {
  title: 'Design System/Typography',
  component: TypographyScale,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TypographyScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeScale: Story = {};
