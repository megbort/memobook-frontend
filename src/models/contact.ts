export interface Contact {
  id: string;
  name: string;
  description?: string | null;
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  otherNames?: string | null;
  relation?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  notes?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type SocialPlatform =
  | 'instagram'
  | 'x'
  | 'linkedin'
  | 'facebook'
  | 'tiktok'
  | 'github'
  | 'other';

export interface SocialLink {
  id: string;
  contactId: string;
  platform: SocialPlatform;
  label?: string | null;
  handle?: string | null;
  url?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type CustomFieldSection = 'personal' | 'address';

export interface CustomField {
  id: string;
  contactId: string;
  section: CustomFieldSection;
  label: string;
  value?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactDetail extends Contact {
  socials: SocialLink[];
  customFields: CustomField[];
}

export type TimelineEventType =
  | 'contact_created'
  | 'contact_updated'
  | 'social_added'
  | 'social_updated'
  | 'social_removed'
  | 'field_added'
  | 'field_updated'
  | 'field_removed'
  | 'media_added';

export interface TimelineEvent {
  id: string;
  contactId: string;
  type: TimelineEventType;
  entityType: 'contact' | 'social' | 'custom_field' | 'media';
  entityId: string | null;
  summary: string;
  changes: Record<string, { from: unknown; to: unknown }> | null;
  occurredAt: string;
}

export interface Media {
  id: string;
  contactId: string;
  type: 'image' | 'video';
  url: string;
  caption?: string | null;
  takenAt?: string | null;
  createdAt: string;
}

// Excludes name: the API builds it from firstName + lastName.
export type ContactFields = Omit<Contact, 'id' | 'name' | 'createdAt' | 'updatedAt'>;
export type SocialLinkInput = Pick<SocialLink, 'platform' | 'label' | 'handle' | 'url'>;
export type CustomFieldInput = Pick<CustomField, 'section' | 'label' | 'value'>;

export interface NewContact extends ContactFields {
  socials?: SocialLinkInput[];
  customFields?: CustomFieldInput[];
}

export const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string; icon: string }[] = [
  { value: 'instagram', label: 'Instagram', icon: 'pi pi-instagram' },
  { value: 'x', label: 'X', icon: 'pi pi-twitter' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'pi pi-linkedin' },
  { value: 'facebook', label: 'Facebook', icon: 'pi pi-facebook' },
  { value: 'tiktok', label: 'TikTok', icon: 'pi pi-tiktok' },
  { value: 'github', label: 'GitHub', icon: 'pi pi-github' },
  { value: 'other', label: 'Other', icon: 'pi pi-link' },
];

export const platformInfo = (platform: SocialPlatform) =>
  SOCIAL_PLATFORMS.find((p) => p.value === platform) ??
  SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];

export const socialName = (social: Pick<SocialLink, 'platform' | 'label'>) =>
  social.platform === 'other' ? (social.label ?? 'Link') : platformInfo(social.platform).label;

// Stored links are often "www.example.com"; without a scheme the browser treats them as relative.
export const toHref = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);
