<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Contact } from '../models/contact';
import { appVersion } from '../version';

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Listbox from 'primevue/listbox';
import Button from 'primevue/button';

const props = defineProps<{
  contacts: Contact[];
  selected: Contact | null;
}>();

const emit = defineEmits<{
  'update:selectedContact': [Contact];
  add: [];
}>();

const searchValue = ref('');
const selectedContact = ref<Contact | null>(props.selected ?? props.contacts[0] ?? null);

const filteredContacts = computed(() => {
  if (!searchValue.value) {
    return props.contacts;
  }
  return props.contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchValue.value.toLowerCase()),
  );
});

watch(selectedContact, (newContact) => {
  if (newContact && newContact !== props.selected) {
    emit('update:selectedContact', newContact);
  }
});

watch(
  () => props.selected,
  (contact) => {
    selectedContact.value = contact;
  },
);
</script>

<template>
  <div class="bg-memobook-green text-memobook-white flex flex-col h-full">
    <div class="flex flex-col gap-2 p-4 flex-1 min-h-0">
      <div class="flex justify-between">
        <h2>Contacts</h2>
        <Button icon="pi pi-plus" aria-label="Add contact" @click="emit('add')" />
      </div>

      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="searchValue" placeholder="Search" />
      </IconField>
      <div class="flex-1 min-h-0 overflow-y-auto">
        <Listbox
          v-model="selectedContact"
          :options="filteredContacts"
          optionLabel="name"
          dataKey="id"
        />
      </div>
    </div>

    <div class="px-4 py-3 text-left text-xs bg-memobook-dark-green">
      <p class="side-panel-footer-text m-0">Designed and built by Megan Krenbrink</p>
      <p class="side-panel-footer-text m-0">
        v{{ appVersion.build }} &middot; {{ appVersion.sha }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.side-panel-footer-text {
  color: var(--memobook-light-green);
  opacity: 0.8;
}
</style>
