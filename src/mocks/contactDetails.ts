import type { ContactDetail, CustomField, SocialLink } from '@/models/contact';
import { Contacts } from './contacts';

const MOCK_TIMESTAMP = '2026-01-15T10:30:00.000Z';

const mockSocial = (
  contactId: string,
  sortOrder: number,
  social: Pick<SocialLink, 'platform' | 'label' | 'handle' | 'url'>,
): SocialLink => ({
  id: `${contactId}-social-${sortOrder}`,
  contactId,
  sortOrder,
  createdAt: MOCK_TIMESTAMP,
  updatedAt: MOCK_TIMESTAMP,
  ...social,
});

const mockCustomField = (
  contactId: string,
  sortOrder: number,
  field: Pick<CustomField, 'section' | 'label' | 'value'>,
): CustomField => ({
  id: `${contactId}-field-${sortOrder}`,
  contactId,
  sortOrder,
  createdAt: MOCK_TIMESTAMP,
  updatedAt: MOCK_TIMESTAMP,
  ...field,
});

const SOCIALS_BY_CONTACT_ID: Record<string, SocialLink[]> = {
  '01': [
    mockSocial('01', 0, {
      platform: 'instagram',
      label: null,
      handle: '@haroldsmiles',
      url: 'https://instagram.com/haroldsmiles',
    }),
    mockSocial('01', 1, {
      platform: 'linkedin',
      label: null,
      handle: 'harold-hidethepain',
      url: 'https://linkedin.com/in/harold-hidethepain',
    }),
    mockSocial('01', 2, {
      platform: 'other',
      label: 'Portfolio',
      handle: 'haroldsphotography',
      url: 'www.haroldsphotography.com',
    }),
  ],
  '02': [
    mockSocial('02', 0, {
      platform: 'github',
      label: null,
      handle: 'bobsmith',
      url: 'https://github.com/bobsmith',
    }),
    mockSocial('02', 1, {
      platform: 'x',
      label: null,
      handle: '@bobgames',
      url: 'https://x.com/bobgames',
    }),
  ],
  '03': [
    mockSocial('03', 0, {
      platform: 'facebook',
      label: null,
      handle: 'charlie.davis',
      url: 'https://facebook.com/charlie.davis',
    }),
  ],
  '04': [
    mockSocial('04', 0, {
      platform: 'tiktok',
      label: null,
      handle: '@dianacooks',
      url: 'https://tiktok.com/@dianacooks',
    }),
  ],
};

const CUSTOM_FIELDS_BY_CONTACT_ID: Record<string, CustomField[]> = {
  '01': [
    mockCustomField('01', 0, { section: 'personal', label: 'Birthday', value: '14 March' }),
    mockCustomField('01', 1, { section: 'personal', label: 'Favourite Food', value: 'Lasagne' }),
    mockCustomField('01', 2, { section: 'address', label: 'Apartment', value: '4B' }),
  ],
  '02': [mockCustomField('02', 0, { section: 'personal', label: 'Gamertag', value: 'BobTheBold' })],
};

export const ContactDetails: ContactDetail[] = Contacts.map((contact) => ({
  ...contact,
  createdAt: contact.createdAt ?? MOCK_TIMESTAMP,
  updatedAt: contact.updatedAt ?? MOCK_TIMESTAMP,
  socials: SOCIALS_BY_CONTACT_ID[contact.id] ?? [],
  customFields: CUSTOM_FIELDS_BY_CONTACT_ID[contact.id] ?? [],
}));
