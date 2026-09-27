import type {
  Contact,
  ContactDetail,
  ContactFields,
  CustomField,
  CustomFieldInput,
  Media,
  NewContact,
  SocialLink,
  SocialLinkInput,
  TimelineEvent,
} from '../models/contact';
import { request, send } from './apiClient';

export const contactApi = {
  getAllContacts: () => request<Contact[]>('/contacts'),

  getContactById: (id: string) => request<ContactDetail>(`/contacts/${id}`),

  createContact: (contact: NewContact) => send<ContactDetail>('POST', '/contacts', contact),

  updateContact: (id: string, contact: Partial<ContactFields>) =>
    send<ContactDetail>('PUT', `/contacts/${id}`, contact),

  deleteContact: (id: string) => send<{ deleted: number }>('DELETE', `/contacts/${id}`),

  addSocial: (contactId: string, social: SocialLinkInput) =>
    send<SocialLink>('POST', `/contacts/${contactId}/socials`, social),

  updateSocial: (contactId: string, socialId: string, social: Partial<SocialLinkInput>) =>
    send<SocialLink>('PUT', `/contacts/${contactId}/socials/${socialId}`, social),

  deleteSocial: (contactId: string, socialId: string) =>
    send<{ deleted: number }>('DELETE', `/contacts/${contactId}/socials/${socialId}`),

  addCustomField: (contactId: string, field: CustomFieldInput) =>
    send<CustomField>('POST', `/contacts/${contactId}/fields`, field),

  updateCustomField: (contactId: string, fieldId: string, field: Partial<CustomFieldInput>) =>
    send<CustomField>('PUT', `/contacts/${contactId}/fields/${fieldId}`, field),

  deleteCustomField: (contactId: string, fieldId: string) =>
    send<{ deleted: number }>('DELETE', `/contacts/${contactId}/fields/${fieldId}`),

  getTimeline: (contactId: string) => request<TimelineEvent[]>(`/contacts/${contactId}/timeline`),

  getMedia: (contactId: string) => request<Media[]>(`/contacts/${contactId}/media`),
};
