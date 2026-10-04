<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { withCloudinaryTransformation } from '../utils/cloudinaryUrl';

import Button from 'primevue/button';
import Message from 'primevue/message';

const MAX_AVATAR_BYTES = 10 * 1024 * 1024;
const AVATAR_TRANSFORMATION = 'c_fill,g_face,w_176,h_176,f_auto,q_auto';

const props = defineProps<{
  avatar?: string | null;
  name?: string;
  initials: string;
  editable?: boolean;
}>();

const emit = defineEmits<{
  remove: [];
}>();

const pendingFile = defineModel<File | null>('file', { default: null });

const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const validationError = ref<string | null>(null);

watch(
  pendingFile,
  (file) => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = file ? URL.createObjectURL(file) : null;
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
});

const displayedAvatar = computed(() => {
  if (previewUrl.value) return previewUrl.value;
  return props.avatar ? withCloudinaryTransformation(props.avatar, AVATAR_TRANSFORMATION) : null;
});

const validateFile = (file: File) => {
  if (!file.type.startsWith('image/')) return 'Please choose an image file.';
  if (file.size > MAX_AVATAR_BYTES) return 'Image must be 10 MB or smaller.';
  return null;
};

const onFileSelected = () => {
  const input = fileInput.value;
  if (!input) return;
  const file = input.files?.[0];
  // Reset so choosing the same file again still fires a change event.
  input.value = '';
  if (!file) return;
  validationError.value = validateFile(file);
  if (!validationError.value) pendingFile.value = file;
};

const removePhoto = () => {
  pendingFile.value = null;
  validationError.value = null;
  emit('remove');
};
</script>

<template>
  <div class="relative shrink-0 w-22 h-22">
    <component
      :is="props.editable ? 'button' : 'div'"
      :type="props.editable ? 'button' : undefined"
      :aria-label="props.editable ? (displayedAvatar ? 'Change photo' : 'Upload photo') : undefined"
      class="group rounded-full w-full h-full overflow-hidden relative bg-memobook-light-green flex items-center justify-center"
      :class="{ 'cursor-pointer': props.editable }"
      @click="props.editable && fileInput?.click()"
    >
      <img
        v-if="displayedAvatar"
        :src="displayedAvatar"
        :alt="props.name"
        class="w-full h-full object-cover"
      />
      <span v-else-if="props.initials" class="text-2xl font-semibold text-memobook-dark-green">
        {{ props.initials }}
      </span>
      <i v-else class="pi pi-camera text-2xl text-memobook-dark-green"></i>
      <span
        v-if="props.editable"
        class="absolute inset-0 flex items-center justify-center bg-black/50 text-memobook-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
      >
        <i class="pi pi-camera text-xl"></i>
      </span>
    </component>

    <template v-if="props.editable">
      <Button
        v-if="displayedAvatar"
        type="button"
        icon="pi pi-trash"
        severity="danger"
        rounded
        aria-label="Remove photo"
        v-tooltip.bottom="'Remove photo'"
        class="!absolute bottom-0 right-0 !w-7 !h-7 !p-0 text-xs"
        @click="removePhoto"
      />
      <label for="avatar-file-input" class="sr-only">
        {{ displayedAvatar ? 'Change photo' : 'Upload photo' }}
      </label>
      <input
        id="avatar-file-input"
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        data-testid="avatar-file-input"
        @change="onFileSelected"
      />
      <Message
        v-if="validationError"
        class="absolute top-full left-0 mt-2 z-10 whitespace-nowrap"
        severity="error"
        size="small"
        closable
        @close="validationError = null"
      >
        {{ validationError }}
      </Message>
    </template>
  </div>
</template>
