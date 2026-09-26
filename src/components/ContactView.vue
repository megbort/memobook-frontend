<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import {
  platformInfo,
  socialName,
  toHref,
  type Contact,
  type ContactDetail,
  type ContactFields,
  type CustomFieldInput,
  type CustomFieldSection,
  type SocialLinkInput,
} from '../models/contact';
import { contactApi } from '../services/contacts';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import DetailRow from './DetailRow.vue';
import SocialLinkForm from './SocialLinkForm.vue';

const props = defineProps<{
  contact: Contact;
}>();

const emit = defineEmits<{
  updated: [Contact];
  deleted: [string];
}>();

const confirm = useConfirm();

const SECTIONS: {
  key: CustomFieldSection;
  title: string;
  fields: { key: keyof ContactFields; label: string; type?: 'link' }[];
}[] = [
  {
    key: 'personal',
    title: 'Personal Information',
    fields: [
      { key: 'otherNames', label: 'Other Names' },
      { key: 'relation', label: 'Relation' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'website', label: 'Website', type: 'link' },
    ],
  },
  {
    key: 'address',
    title: 'Address Information',
    fields: [
      { key: 'address', label: 'Address' },
      { key: 'city', label: 'City' },
      { key: 'country', label: 'Country' },
      { key: 'postalCode', label: 'Postal/Zip Code' },
    ],
  },
];

const HEADER_FIELDS: {
  key: keyof ContactFields;
  label: string;
  placeholder?: string;
  required?: boolean;
  wide?: boolean;
}[] = [
  { key: 'firstName', label: 'First Name', required: true },
  { key: 'lastName', label: 'Last Name' },
  { key: 'description', label: 'Description', placeholder: 'A short line about them', wide: true },
  { key: 'avatar', label: 'Photo URL', placeholder: 'https://…', wide: true },
];

const HIDDEN_WHEN_EMPTY: (keyof ContactFields)[] = ['otherNames', 'website'];
const EDITABLE_FIELDS: (keyof ContactFields)[] = [
  'firstName',
  'lastName',
  'description',
  'avatar',
  'notes',
  ...SECTIONS.flatMap((section) => section.fields.map((field) => field.key)),
];

const activeTab = ref('0');
const detail = ref<ContactDetail | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const editing = ref(false);
const saving = ref(false);
const draft = ref<Partial<ContactFields>>({});
const fieldValues = ref<Record<string, string | null | undefined>>({});

const newField = ref<CustomFieldInput | null>(null);
const newSocial = ref<SocialLinkInput | null>(null);

const shown = computed<Partial<Contact>>(() =>
  editing.value ? draft.value : (detail.value ?? props.contact),
);

const initials = computed(() =>
  [shown.value.firstName, shown.value.lastName]
    .filter(Boolean)
    .map((part) => part![0]!.toUpperCase())
    .join(''),
);

const customFieldsFor = (section: CustomFieldSection) =>
  detail.value?.customFields.filter((field) => field.section === section) ?? [];

const isVisible = (key: keyof ContactFields) =>
  editing.value || !HIDDEN_WHEN_EMPTY.includes(key) || !!shown.value[key];

const run = async (action: () => Promise<void>) => {
  error.value = null;
  try {
    await action();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Something went wrong.';
  }
};

// The view is reused across selections, so drop responses for a contact that is no longer selected.
const load = async () => {
  const id = props.contact.id;
  const isCurrent = () => id === props.contact.id;
  detail.value = null;
  loading.value = true;
  editing.value = false;
  newField.value = null;
  newSocial.value = null;
  error.value = null;
  try {
    const result = await contactApi.getContactById(id);
    if (isCurrent()) detail.value = result;
  } catch (err) {
    if (isCurrent()) error.value = err instanceof Error ? err.message : 'Something went wrong.';
  } finally {
    if (isCurrent()) loading.value = false;
  }
};

watch(() => props.contact.id, load, { immediate: true });

const startEdit = () => {
  if (!detail.value) return;
  const current = detail.value;
  draft.value = Object.fromEntries(EDITABLE_FIELDS.map((key) => [key, current[key] ?? '']));
  fieldValues.value = Object.fromEntries(current.customFields.map((f) => [f.id, f.value ?? '']));
  editing.value = true;
};

const save = () =>
  run(async () => {
    if (!detail.value) return;
    if (!draft.value.firstName?.trim()) throw new Error('First name is required.');
    saving.value = true;
    try {
      const id = detail.value.id;
      const changedFields = detail.value.customFields.filter(
        (field) => (fieldValues.value[field.id] ?? '') !== (field.value ?? ''),
      );
      const current = detail.value;
      const changedCoreFields = Object.fromEntries(
        Object.entries(draft.value).filter(
          ([key, value]) => (value ?? '') !== (current[key as keyof ContactFields] ?? ''),
        ),
      );
      const updated = Object.keys(changedCoreFields).length
        ? await contactApi.updateContact(id, changedCoreFields)
        : current;
      const savedFields = await Promise.all(
        changedFields.map((field) =>
          contactApi.updateCustomField(id, field.id, { value: fieldValues.value[field.id] }),
        ),
      );
      detail.value = {
        ...updated,
        customFields: updated.customFields.map(
          (field) => savedFields.find((saved) => saved.id === field.id) ?? field,
        ),
      };
      editing.value = false;
      emit('updated', detail.value);
    } finally {
      saving.value = false;
    }
  });

const removeContact = () => {
  confirm.require({
    header: 'Delete contact',
    message: `Delete ${props.contact.name}? This removes their details and socials.`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'contrast', variant: 'outlined' },
    acceptProps: { label: 'Delete', severity: 'danger' },
    accept: () =>
      run(async () => {
        await contactApi.deleteContact(props.contact.id);
        emit('deleted', props.contact.id);
      }),
  });
};

const startAddField = (section: CustomFieldSection) => {
  newField.value = { section, label: '', value: '' };
};

const addField = () =>
  run(async () => {
    if (!detail.value || !newField.value?.label.trim()) return;
    const created = await contactApi.addCustomField(detail.value.id, newField.value);
    detail.value.customFields.push(created);
    fieldValues.value[created.id] = created.value ?? '';
    newField.value = null;
  });

const removeField = (fieldId: string) =>
  run(async () => {
    if (!detail.value) return;
    await contactApi.deleteCustomField(detail.value.id, fieldId);
    detail.value.customFields = detail.value.customFields.filter((f) => f.id !== fieldId);
  });

const addSocial = () =>
  run(async () => {
    if (!detail.value || !newSocial.value) return;
    const created = await contactApi.addSocial(detail.value.id, newSocial.value);
    detail.value.socials.push(created);
    newSocial.value = null;
  });

const removeSocial = (socialId: string) =>
  run(async () => {
    if (!detail.value) return;
    await contactApi.deleteSocial(detail.value.id, socialId);
    detail.value.socials = detail.value.socials.filter((s) => s.id !== socialId);
  });
</script>

<template>
  <div class="p-8 flex flex-col gap-4 h-full overflow-y-auto">
    <div class="flex flex-wrap gap-4 items-center">
      <div
        class="avatar rounded-full w-22 h-22 overflow-hidden relative flex-shrink-0 bg-memobook-light-green flex items-center justify-center"
      >
        <img
          v-if="shown.avatar"
          :src="shown.avatar"
          :alt="shown.name"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-2xl font-semibold text-memobook-dark-green">{{ initials }}</span>
      </div>
      <div
        v-if="editing"
        class="grid grid-cols-[auto_1fr_auto_1fr] gap-x-2 gap-y-2 items-center flex-1 min-w-64"
      >
        <template v-for="field in HEADER_FIELDS" :key="field.key">
          <label
            :for="`contact-${field.key}`"
            class="text-sm font-medium text-memobook-dark-grey whitespace-nowrap"
            >{{ field.label
            }}<span v-if="field.required" class="text-memobook-error">*</span>:</label
          >
          <InputText
            :id="`contact-${field.key}`"
            v-model="draft[field.key] as string"
            :placeholder="field.placeholder"
            size="small"
            :class="{ 'col-span-3': field.wide }"
          />
        </template>
      </div>
      <div v-else class="flex flex-col gap-1 flex-1">
        <h2 class="text-xl font-semibold text-memobook-black dark:text-memobook-white">
          {{ shown.name }}
        </h2>
        <p class="text-memobook-dark-grey">{{ shown.description }}</p>
      </div>
      <div class="flex gap-2 self-start">
        <template v-if="editing">
          <Button
            icon="pi pi-trash"
            severity="danger"
            aria-label="Delete contact"
            v-tooltip.bottom="'Delete contact'"
            @click="removeContact"
          />
          <Button label="Cancel" severity="contrast" variant="outlined" @click="editing = false" />
          <Button label="Save" :loading="saving" @click="save" />
        </template>
        <Button
          v-else
          icon="pi pi-pencil"
          aria-label="Edit contact"
          v-tooltip.bottom="'Edit'"
          :disabled="!detail"
          @click="startEdit"
        />
      </div>
    </div>

    <Message v-if="error" severity="error" closable @close="error = null">{{ error }}</Message>
    <div class="card flex-grow flex flex-col">
      <Tabs v-model:value="activeTab">
        <TabList>
          <Tab value="0">Details</Tab>
          <Tab value="1">Media</Tab>
          <Tab value="2">Timeline</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <div v-if="loading && !detail" class="flex justify-center p-8">
              <ProgressSpinner style="width: 3rem; height: 3rem" />
            </div>
            <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
              <div v-for="section in SECTIONS" :key="section.key" class="flex flex-col gap-8">
                <section class="flex flex-col gap-3">
                  <h3 class="text-lg font-semibold text-memobook-dark-green mb-2">
                    {{ section.title }}
                  </h3>

                  <template v-for="field in section.fields" :key="field.key">
                    <DetailRow
                      v-if="isVisible(field.key)"
                      :model-value="shown[field.key]"
                      @update:model-value="draft[field.key] = $event ?? ''"
                      :label="field.label"
                      :type="field.type"
                      :editing="editing"
                    />
                  </template>
                  <DetailRow
                    v-for="field in customFieldsFor(section.key)"
                    :key="field.id"
                    :label="field.label"
                    :editing="editing"
                    :model-value="editing ? fieldValues[field.id] : field.value"
                    @update:model-value="fieldValues[field.id] = $event"
                  >
                    <template #actions>
                      <Button
                        v-if="editing"
                        icon="pi pi-trash"
                        text
                        severity="secondary"
                        size="small"
                        :aria-label="`Remove ${field.label}`"
                        @click="removeField(field.id)"
                      />
                    </template>
                  </DetailRow>

                  <form
                    v-if="newField?.section === section.key"
                    class="flex gap-2 items-center"
                    @submit.prevent="addField"
                  >
                    <InputText
                      v-model="newField.label"
                      placeholder="Label"
                      size="small"
                      class="w-32"
                      autofocus
                      aria-label="Field label"
                    />
                    <InputText
                      v-model="newField.value as string"
                      placeholder="Value"
                      size="small"
                      class="flex-1 min-w-0"
                      aria-label="Field value"
                    />
                    <Button type="submit" icon="pi pi-check" size="small" aria-label="Add field" />
                    <Button
                      icon="pi pi-times"
                      text
                      severity="secondary"
                      size="small"
                      aria-label="Cancel"
                      @click="newField = null"
                    />
                  </form>
                  <Button
                    v-else
                    variant="link"
                    label="+ Add Field"
                    size="small"
                    class="self-start !px-0"
                    :disabled="!detail"
                    @click="startAddField(section.key)"
                  />
                </section>
                <section v-if="section.key === 'personal'" class="flex flex-col gap-3">
                  <h3 class="text-lg font-semibold text-memobook-dark-green mb-2">Socials</h3>
                  <p
                    v-if="!detail?.socials.length && !newSocial"
                    class="text-memobook-dark-grey m-0"
                  >
                    No socials yet.
                  </p>
                  <div
                    v-for="social in detail?.socials"
                    :key="social.id"
                    class="flex gap-2 items-center"
                  >
                    <i
                      :class="platformInfo(social.platform).icon"
                      class="text-memobook-dark-green"
                    />
                    <span class="text-sm font-medium text-memobook-dark-grey min-w-[100px]"
                      >{{ socialName(social) }}:</span
                    >
                    <a
                      v-if="social.url"
                      :href="toHref(social.url)"
                      target="_blank"
                      rel="noopener"
                      class="text-memobook-blue hover:text-memobook-dark-blue underline"
                      >{{ social.handle || social.url }}</a
                    >
                    <span v-else class="text-memobook-black dark:text-memobook-white">{{
                      social.handle
                    }}</span>
                    <Button
                      v-if="editing"
                      icon="pi pi-trash"
                      text
                      severity="secondary"
                      size="small"
                      :aria-label="`Remove ${socialName(social)}`"
                      @click="removeSocial(social.id)"
                    />
                  </div>
                  <form v-if="newSocial" class="flex flex-col gap-2" @submit.prevent="addSocial">
                    <SocialLinkForm v-model="newSocial">
                      <Button
                        type="submit"
                        icon="pi pi-check"
                        size="small"
                        aria-label="Add social"
                      />
                      <Button
                        icon="pi pi-times"
                        text
                        severity="secondary"
                        size="small"
                        aria-label="Cancel"
                        @click="newSocial = null"
                      />
                    </SocialLinkForm>
                  </form>
                  <Button
                    v-else
                    variant="link"
                    label="+ Add Social"
                    size="small"
                    class="self-start !px-0"
                    :disabled="!detail"
                    @click="newSocial = { platform: 'instagram', label: '', handle: '', url: '' }"
                  />
                </section>
                <section v-if="section.key === 'address'" class="flex flex-col gap-3">
                  <h3 class="text-lg font-semibold text-memobook-dark-green mb-2">Notes</h3>
                  <Textarea
                    v-if="editing"
                    v-model="draft.notes as string"
                    rows="4"
                    autoResize
                    aria-label="Notes"
                  />
                  <div
                    v-else-if="shown.notes"
                    class="p-3 rounded-lg border border-memobook-dark-grey/40"
                  >
                    <p class="text-memobook-black dark:text-memobook-white m-0 whitespace-pre-line">
                      {{ shown.notes }}
                    </p>
                  </div>
                  <p v-else class="text-memobook-dark-grey m-0">No notes yet.</p>
                </section>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="1">
            <p>Feature coming soon...</p>
          </TabPanel>
          <TabPanel value="2">
            <p>Feature coming soon...</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>
