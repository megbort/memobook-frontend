import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, fn } from 'storybook/test';
import SidePanel from '@/components/SidePanel.vue';
import { Contacts } from '@/mocks/contacts';

const meta = {
  title: 'Components/SidePanel',
  component: SidePanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    contacts: Contacts,
    selected: Contacts[0],
    'onUpdate:selectedContact': fn(),
    onAdd: fn(),
  },
  decorators: [() => ({ template: '<div style="height: 100vh; width: 320px"><story /></div>' })],
} satisfies Meta<typeof SidePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Contacts' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Add contact' })).toBeVisible();
    await expect(canvas.getByPlaceholderText('Search')).toBeVisible();
    for (const contact of Contacts) {
      await expect(canvas.getByRole('option', { name: contact.name })).toBeVisible();
    }
  },
};

export const Empty: Story = {
  args: { contacts: [], selected: null },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Add contact' })).toBeVisible();
    await expect(canvas.queryByRole('option', { name: Contacts[0].name })).not.toBeInTheDocument();
  },
};
