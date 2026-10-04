import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
import ConfirmDialog from 'primevue/confirmdialog';
import ContactView from '@/components/ContactView.vue';
import { Contacts } from '@/mocks/contacts';

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

export const Default: Story = {};

export const WithoutSocialsOrCustomFields: Story = {
  args: { contact: Contacts[4] },
};

export const LoadError: Story = {
  parameters: { mockApi: { failWithStatus: 500 } },
};
