import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect, fn, within } from 'storybook/test';
import ConfirmDialog from 'primevue/confirmdialog';
import ContactView from '@/components/ContactView.vue';
import { Contacts } from '@/mocks/contacts';
import { waitForTabActiveBar, waitUntilVisible } from '../playHelpers';

const meta = {
  title: 'Components/ContactView',
  component: ContactView,
  parameters: { layout: 'fullscreen' },
  args: {
    contact: Contacts[0],
    onUpdated: fn(),
    onDeleted: fn(),
  },
  decorators: [
    () => ({
      components: { ConfirmDialog },
      template: '<div style="height: 100vh"><ConfirmDialog /><story /></div>',
    }),
  ],
} satisfies Meta<typeof ContactView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(await canvas.findByRole('link', { name: '@haroldsmiles' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: Contacts[0].name })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Edit contact' })).toBeVisible();
    for (const tab of ['Details', 'Media', 'Timeline']) {
      await expect(canvas.getByRole('tab', { name: tab })).toBeVisible();
    }
    for (const section of ['Personal Information', 'Address Information', 'Socials', 'Notes']) {
      await expect(canvas.getByRole('heading', { name: section })).toBeVisible();
    }
    await waitForTabActiveBar(canvasElement);
  },
};

export const WithoutSocialsOrCustomFields: Story = {
  args: { contact: Contacts[4] },
  play: async ({ canvas, canvasElement }) => {
    const socialsHeading = await canvas.findByRole('heading', { name: 'Socials' });
    const socialsSection = within(socialsHeading.parentElement!);
    await expect(socialsSection.getByRole('button', { name: '+ Add Social' })).toBeVisible();
    await expect(socialsSection.queryAllByRole('link')).toHaveLength(0);
    await waitForTabActiveBar(canvasElement);
  },
};

export const LoadError: Story = {
  parameters: { mockApi: { failWithStatus: 500 } },
  play: async ({ canvas }) => {
    await waitUntilVisible(await canvas.findByText('Mock API error'));
  },
};
