import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, fn, within } from 'storybook/test';
import ContactFormDialog from '@/components/ContactFormDialog.vue';
import { waitUntilVisible } from '../playHelpers';

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

export const Default: Story = {
  // PrimeVue Dialog teleports to <body>, outside the story canvas.
  play: async ({ canvasElement }) => {
    const dialogElement = await within(canvasElement.ownerDocument.body).findByRole('dialog', {
      name: 'New Contact',
    });
    await waitUntilVisible(dialogElement);
    const dialog = within(dialogElement);
    await expect(dialog.getByRole('textbox', { name: 'First Name *' })).toBeVisible();
    for (const section of ['Personal Information', 'Address Information', 'Socials']) {
      await expect(dialog.getByRole('heading', { name: section })).toBeVisible();
    }
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Create Contact' })).toBeVisible();
  },
};
