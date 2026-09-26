<script setup lang="ts">
import Timeline from 'primevue/timeline';
import type { TimelineEvent, TimelineEventType } from '../models/contact';

const props = defineProps<{
  events: TimelineEvent[];
}>();

const ICONS: Record<TimelineEventType, string> = {
  contact_created: 'pi pi-user-plus',
  contact_updated: 'pi pi-pencil',
  social_added: 'pi pi-share-alt',
  social_updated: 'pi pi-share-alt',
  social_removed: 'pi pi-trash',
  field_added: 'pi pi-plus',
  field_updated: 'pi pi-pencil',
  field_removed: 'pi pi-trash',
  media_added: 'pi pi-image',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const formatValue = (value: unknown) => (value === null || value === '' ? '—' : String(value));
</script>

<template>
  <p v-if="!props.events.length" class="text-memobook-dark-grey">No activity yet.</p>
  <Timeline v-else :value="props.events" class="contact-timeline">
    <template #opposite="{ item }">
      <small class="text-memobook-dark-grey whitespace-nowrap">{{
        formatDate(item.occurredAt)
      }}</small>
    </template>
    <template #marker="{ item }">
      <span
        class="flex w-8 h-8 items-center justify-center rounded-full bg-memobook-green text-memobook-white"
      >
        <i :class="ICONS[item.type as TimelineEventType] ?? 'pi pi-circle'" class="text-sm" />
      </span>
    </template>
    <template #content="{ item }">
      <div class="pb-4">
        <p class="m-0 font-medium text-memobook-black dark:text-memobook-white">
          {{ item.summary }}
        </p>
        <ul v-if="item.changes" class="m-0 mt-1 p-0 list-none text-sm text-memobook-dark-grey">
          <li v-for="(change, field) in item.changes" :key="field">
            <span class="font-medium">{{ field }}:</span>
            {{ formatValue(change.from) }} → {{ formatValue(change.to) }}
          </li>
        </ul>
      </div>
    </template>
  </Timeline>
</template>

<style scoped>
.contact-timeline :deep(.p-timeline-event-opposite) {
  flex: 0 0 11rem;
}
</style>
