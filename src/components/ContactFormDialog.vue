<script setup lang="ts">
import { computed, ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Message from 'primevue/message';
import SocialLinkForm from './SocialLinkForm.vue';
import AvatarPicker from './AvatarPicker.vue';
import PageLoader from './PageLoader.vue';
import { contactApi } from '../services/contacts';
import { uploadApi } from '../services/uploads';
import type {
  ContactDetail,
  ContactFields,
  CustomFieldInput,
  CustomFieldSection,
  SocialLinkInput,
} from '../models/contact';

const visible = defineModel<boolean>('visible', { required: true });

const emit = defineEmits<{
  created: [ContactDetail];
}>();

const PERSONAL_FIELDS: { key: keyof ContactFields; label: string }[] = [
  { key: 'otherNames', label: 'Other Names' },
  { key: 'relation', label: 'Relation' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'website', label: 'Website' },
];

const ADDRESS_FIELDS: { key: keyof ContactFields; label: string }[] = [
  { key: 'address', label: 'Address' },
  { key: 'city', label: 'City' },
  { key: 'country', label: 'Country' },
  { key: 'postalCode', label: 'Postal/Zip Code' },
];

const emptySocial = (): SocialLinkInput => ({
  platform: 'instagram',
  label: '',
  handle: '',
  url: '',
});

const form = ref<ContactFields>({ firstName: '' });
const socials = ref<SocialLinkInput[]>([]);
const customFields = ref<CustomFieldInput[]>([]);
const avatarFile = ref<File | null>(null);
const createdContact = ref<ContactDetail | null>(null);
const saving = ref(false);
const error = ref<string | null>(null);

const initials = computed(() =>
  [form.value.firstName, form.value.lastName]
    .map((part) => part?.trim()[0]?.toUpperCase())
    .filter(Boolean)
    .join(''),
);

const reset = () => {
  form.value = { firstName: '' };
  socials.value = [];
  customFields.value = [];
  avatarFile.value = null;
  createdContact.value = null;
  error.value = null;
};

const onHide = () => {
  if (createdContact.value) emit('created', createdContact.value);
  reset();
};

const uploadAvatarFor = async (contact: ContactDetail) => {
  if (!avatarFile.value) return contact;
  const avatar = await uploadApi.uploadAvatar(contact.id, avatarFile.value);
  return contactApi.updateContact(contact.id, { avatar });
};

const addCustomField = (section: CustomFieldSection) => {
  customFields.value.push({ section, label: '', value: '' });
};

const removeCustomField = (field: CustomFieldInput) => {
  customFields.value = customFields.value.filter((f) => f !== field);
};

const hasLink = (social: SocialLinkInput) => !!(social.handle?.trim() || social.url?.trim());
const hasLabel = (field: CustomFieldInput) => !!field.label.trim();

const fieldsFor = (section: CustomFieldSection) =>
  customFields.value.filter((field) => field.section === section);

const save = async () => {
  if (!form.value.firstName?.trim()) {
    error.value = 'First name is required.';
    return;
  }
  saving.value = true;
  error.value = null;
  try {
    createdContact.value ??= await contactApi.createContact({
      ...form.value,
      socials: socials.value.filter(hasLink),
      customFields: customFields.value.filter(hasLabel),
    });
    const contact = await uploadAvatarFor(createdContact.value);
    createdContact.value = null;
    emit('created', contact);
    visible.value = false;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not create contact.';
    error.value = createdContact.value
      ? `Contact saved, but the photo upload failed: ${message}. Retry, or cancel to keep the contact without a photo.`
      : message;
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="New Contact"
    :style="{ width: '48rem' }"
    :breakpoints="{ '768px': '95vw' }"
    @hide="onHide"
  >
    <PageLoader :visible="saving" />
    <form id="new-contact-form" class="flex flex-col gap-6" @submit.prevent="save">
      <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

      <div class="flex flex-col sm:flex-row gap-4 sm:items-center">
        <AvatarPicker
          v-model:file="avatarFile"
          :avatar="form.avatar"
          :initials="initials"
          editable
          @remove="form.avatar = ''"
        />
        <div class="flex flex-col gap-3 flex-1">
          <div class="flex gap-3">
            <div class="flex flex-col gap-1 flex-1">
              <label for="contact-first-name" class="text-sm font-medium text-memobook-dark-grey"
                >First Name *</label
              >
              <InputText id="contact-first-name" v-model="form.firstName" autofocus />
            </div>
            <div class="flex flex-col gap-1 flex-1">
              <label for="contact-last-name" class="text-sm font-medium text-memobook-dark-grey"
                >Last Name</label
              >
              <InputText id="contact-last-name" v-model="form.lastName" />
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label for="contact-description" class="text-sm font-medium text-memobook-dark-grey"
              >Description</label
            >
            <InputText
              id="contact-description"
              v-model="form.description"
              placeholder="How do you know them?"
            />
          </div>
        </div>
      </div>

      <div class="flex gap-6 flex-col md:flex-row">
        <section class="flex flex-col gap-3 basis-1/2">
          <h3 class="text-lg font-semibold text-memobook-dark-green">Personal Information</h3>
          <div v-for="field in PERSONAL_FIELDS" :key="field.key" class="flex flex-col gap-1">
            <label
              :for="`contact-personal-${String(field.key)}`"
              class="text-sm font-medium text-memobook-dark-grey"
              >{{ field.label }}</label
            >
            <InputText
              :id="`contact-personal-${String(field.key)}`"
              v-model="form[field.key]"
              size="small"
            />
          </div>
          <div v-for="(field, index) in fieldsFor('personal')" :key="index" class="flex gap-2">
            <InputText
              v-model="field.label"
              placeholder="Label"
              size="small"
              class="w-32"
              :aria-label="`Personal custom field ${index + 1} label`"
            />
            <InputText
              v-model="field.value"
              placeholder="Value"
              size="small"
              class="flex-1"
              :aria-label="`Personal custom field ${index + 1} value`"
            />
            <Button
              icon="pi pi-times"
              text
              severity="secondary"
              aria-label="Remove field"
              @click="removeCustomField(field)"
            />
          </div>
          <Button
            type="button"
            variant="link"
            label="+ Add Field"
            size="small"
            class="self-start !px-0"
            @click="addCustomField('personal')"
          />
        </section>
        <section class="flex flex-col gap-3 basis-1/2">
          <h3 class="text-lg font-semibold text-memobook-dark-green">Address Information</h3>
          <div v-for="field in ADDRESS_FIELDS" :key="field.key" class="flex flex-col gap-1">
            <label
              :for="`contact-address-${String(field.key)}`"
              class="text-sm font-medium text-memobook-dark-grey"
              >{{ field.label }}</label
            >
            <InputText
              :id="`contact-address-${String(field.key)}`"
              v-model="form[field.key]"
              size="small"
            />
          </div>
          <div v-for="(field, index) in fieldsFor('address')" :key="index" class="flex gap-2">
            <InputText
              v-model="field.label"
              placeholder="Label"
              size="small"
              class="w-32"
              :aria-label="`Address custom field ${index + 1} label`"
            />
            <InputText
              v-model="field.value"
              placeholder="Value"
              size="small"
              class="flex-1"
              :aria-label="`Address custom field ${index + 1} value`"
            />
            <Button
              icon="pi pi-times"
              text
              severity="secondary"
              aria-label="Remove field"
              @click="removeCustomField(field)"
            />
          </div>
          <Button
            type="button"
            variant="link"
            label="+ Add Field"
            size="small"
            class="self-start !px-0"
            @click="addCustomField('address')"
          />
          <div class="flex flex-col gap-1">
            <label for="contact-notes" class="text-sm font-medium text-memobook-dark-grey"
              >Notes</label
            >
            <Textarea id="contact-notes" v-model="form.notes" rows="3" autoResize />
          </div>
        </section>
      </div>
      <section class="flex flex-col gap-3">
        <h3 class="text-lg font-semibold text-memobook-dark-green">Socials</h3>
        <SocialLinkForm v-for="(social, index) in socials" :key="index" v-model="socials[index]">
          <Button
            icon="pi pi-times"
            text
            severity="secondary"
            aria-label="Remove social"
            @click="socials.splice(index, 1)"
          />
        </SocialLinkForm>
        <Button
          type="button"
          variant="link"
          label="+ Add Social"
          size="small"
          class="self-start !px-0"
          @click="socials.push(emptySocial())"
        />
      </section>
    </form>

    <template #footer>
      <Button
        type="button"
        label="Cancel"
        severity="contrast"
        variant="outlined"
        @click="visible = false"
      />
      <Button
        type="submit"
        form="new-contact-form"
        :label="createdContact ? 'Retry photo upload' : 'Create Contact'"
        :loading="saving"
      />
    </template>
  </Dialog>
</template>
