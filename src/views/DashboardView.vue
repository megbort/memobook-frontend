<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { contactApi } from '../services/contacts';
import type { Contact } from '../models/contact';

import DemoBanner from '../components/DemoBanner.vue';
import MainBanner from '../components/AppHeader.vue';
import SidePanel from '../components/SidePanel.vue';
import ContactView from '../components/ContactView.vue';
import ContactFormDialog from '../components/ContactFormDialog.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';

const contacts = ref<Contact[]>([]);
const selectedContact = ref<Contact | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);
const showNewContact = ref(false);

const fetchContacts = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const data = await contactApi.getAllContacts();
    contacts.value = data;
    if (data.length > 0) {
      selectedContact.value = data[0];
    }
  } catch (err) {
    error.value = 'Failed to load contacts. Please check your connection and try again.';
    console.error('Error loading contacts:', err);
  } finally {
    isLoading.value = false;
  }
};

const updateSelectedContact = (contact: Contact) => {
  selectedContact.value = contact;
};

const sortByName = (list: Contact[]) =>
  [...list].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

const onContactCreated = (contact: Contact) => {
  contacts.value = sortByName([...contacts.value, contact]);
  selectedContact.value = contact;
};

const onContactUpdated = (contact: Contact) => {
  contacts.value = sortByName(contacts.value.map((c) => (c.id === contact.id ? contact : c)));
  selectedContact.value = contact;
};

const onContactDeleted = (id: string) => {
  contacts.value = contacts.value.filter((c) => c.id !== id);
  selectedContact.value = contacts.value[0] ?? null;
};

onMounted(() => {
  fetchContacts();
});
</script>

<template>
  <div class="dashboard">
    <DemoBanner />
    <MainBanner />
    <main class="flex flex-1 min-h-0">
      <SidePanel
        v-if="!isLoading && !error"
        :contacts="contacts"
        :selected="selectedContact"
        @update:selectedContact="updateSelectedContact"
        @add="showNewContact = true"
      />
      <div v-if="selectedContact && !isLoading && !error" class="flex-grow flex flex-col h-full">
        <ContactView
          :contact="selectedContact"
          @updated="onContactUpdated"
          @deleted="onContactDeleted"
        />
      </div>
      <div
        v-if="!selectedContact && !isLoading && !error"
        class="flex flex-col items-center justify-center gap-4 grow text-memobook-dark-grey"
      >
        <p>No contacts yet.</p>
        <Button label="Add a contact" icon="pi pi-plus" @click="showNewContact = true" />
      </div>
      <div v-if="isLoading" class="flex items-center justify-center grow">
        <div class="flex flex-col items-center gap-4">
          <ProgressSpinner />
          <p class="text-memobook-dark-grey">Loading contacts...</p>
        </div>
      </div>
      <div v-if="error" class="flex items-center justify-center grow">
        <div class="flex flex-col items-center gap-4 p-8 text-center">
          <i class="pi pi-exclamation-triangle text-4xl text-memobook-dark-grey"></i>
          <p class="text-memobook-black dark:text-memobook-white">{{ error }}</p>
          <Button label="Retry" icon="pi pi-refresh" @click="fetchContacts" />
        </div>
      </div>
    </main>
    <ContactFormDialog v-model:visible="showNewContact" @created="onContactCreated" />
    <ConfirmDialog />
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
