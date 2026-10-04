import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, fn } from 'storybook/test';
import AvatarPicker from '@/components/AvatarPicker.vue';
import { Contacts } from '@/mocks/contacts';

const [harold] = Contacts;

const meta = {
  title: 'Components/AvatarPicker',
  component: AvatarPicker,
  tags: ['autodocs'],
  args: {
    avatar: harold.avatar,
    name: harold.name,
    initials: 'HH',
    editable: false,
    onRemove: fn(),
    'onUpdate:file': fn(),
  },
} satisfies Meta<typeof AvatarPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAvatar: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: harold.name })).toBeInTheDocument();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

export const InitialsOnly: Story = {
  args: { avatar: null },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('HH')).toBeVisible();
    await expect(canvas.queryByRole('img')).not.toBeInTheDocument();
  },
};

export const Editable: Story = {
  args: { editable: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Change photo' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Remove photo' })).toBeVisible();
  },
};

export const EditableWithoutAvatar: Story = {
  args: { avatar: null, editable: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Upload photo' })).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Remove photo' })).not.toBeInTheDocument();
  },
};
