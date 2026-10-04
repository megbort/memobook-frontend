import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { expect } from 'storybook/test';
import DashboardView from '@/views/DashboardView.vue';
import { Contacts } from '@/mocks/contacts';
import { waitForTabActiveBar } from '../playHelpers';

const meta = {
  title: 'Pages/Dashboard',
  component: DashboardView,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DashboardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { name: 'MemoBook' })).toBeVisible();
    await expect(await canvas.findByRole('heading', { name: 'Contacts' })).toBeVisible();
    await expect(canvas.getAllByRole('option', { name: /.+/ })).toHaveLength(Contacts.length);
    await expect(await canvas.findByRole('heading', { name: Contacts[0].name })).toBeVisible();
    await waitForTabActiveBar(canvasElement);
  },
};

export const LoadError: Story = {
  parameters: { mockApi: { failWithStatus: 500 } },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText(/Failed to load contacts/)).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Retry' })).toBeVisible();
  },
};
