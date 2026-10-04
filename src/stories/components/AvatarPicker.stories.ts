import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
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

export const WithAvatar: Story = {};

export const InitialsOnly: Story = {
  args: { avatar: null },
};

export const Editable: Story = {
  args: { editable: true },
};

export const EditableWithoutAvatar: Story = {
  args: { avatar: null, editable: true },
};
