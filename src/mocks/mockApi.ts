import type {
  Contact,
  ContactDetail,
  CustomFieldInput,
  NewContact,
  SocialLinkInput,
} from '@/models/contact';
import type { UploadSignature } from '@/services/uploads';
import { ContactDetails } from './contactDetails';
import { TimelineEvents } from './timeline';

export interface MockApiOptions {
  failWithStatus?: number;
  delayMs?: number;
}

type RouteParams = Record<string, string>;
type RouteHandler = (params: RouteParams, body: unknown) => unknown;

interface Route {
  method: string;
  pattern: RegExp;
  handle: RouteHandler;
}

const DEFAULT_DELAY_MS = 300;
const realFetch = globalThis.fetch.bind(globalThis);

let contacts: ContactDetail[] = [];

const now = () => new Date().toISOString();
const newId = () => crypto.randomUUID();
const fullName = (contact: Pick<Contact, 'firstName' | 'lastName'>) =>
  [contact.firstName, contact.lastName].filter(Boolean).join(' ');

const toListItem = (detail: ContactDetail): Contact => {
  const contact: Partial<ContactDetail> = { ...detail };
  delete contact.socials;
  delete contact.customFields;
  return contact as Contact;
};

const findContact = (id: string) => {
  const contact = contacts.find((c) => c.id === id);
  if (!contact) throw new MockHttpError(404, 'Contact not found');
  return contact;
};

const toStoredContactChild = <Input extends SocialLinkInput | CustomFieldInput>(
  contactId: string,
  input: Input,
  sortOrder: number,
) => ({
  id: newId(),
  contactId,
  sortOrder,
  createdAt: now(),
  updatedAt: now(),
  ...input,
});

class MockHttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const routes: Route[] = [
  {
    method: 'GET',
    pattern: /^\/contacts$/,
    handle: () => contacts.map(toListItem),
  },
  {
    method: 'POST',
    pattern: /^\/contacts$/,
    handle: (_, body) => {
      const { socials = [], customFields = [], ...fields } = body as NewContact;
      const id = newId();
      const created: ContactDetail = {
        ...fields,
        id,
        name: fullName(fields),
        createdAt: now(),
        updatedAt: now(),
        socials: socials.map((social, index) => toStoredContactChild(id, social, index)),
        customFields: customFields.map((field, index) => toStoredContactChild(id, field, index)),
      };
      contacts.push(created);
      return created;
    },
  },
  {
    method: 'GET',
    pattern: /^\/contacts\/(?<id>[^/]+)$/,
    handle: ({ id }) => findContact(id),
  },
  {
    method: 'PUT',
    pattern: /^\/contacts\/(?<id>[^/]+)$/,
    handle: ({ id }, body) => {
      const contact = findContact(id);
      Object.assign(contact, body, { updatedAt: now() });
      contact.name = fullName(contact);
      return contact;
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/contacts\/(?<id>[^/]+)$/,
    handle: ({ id }) => {
      findContact(id);
      contacts = contacts.filter((c) => c.id !== id);
      return { deleted: 1 };
    },
  },
  {
    method: 'POST',
    pattern: /^\/contacts\/(?<id>[^/]+)\/socials$/,
    handle: ({ id }, body) => {
      const contact = findContact(id);
      const social = toStoredContactChild(id, body as SocialLinkInput, contact.socials.length);
      contact.socials.push(social);
      return social;
    },
  },
  {
    method: 'PUT',
    pattern: /^\/contacts\/(?<id>[^/]+)\/socials\/(?<socialId>[^/]+)$/,
    handle: ({ id, socialId }, body) => {
      const social = findContact(id).socials.find((s) => s.id === socialId);
      if (!social) throw new MockHttpError(404, 'Social link not found');
      return Object.assign(social, body, { updatedAt: now() });
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/contacts\/(?<id>[^/]+)\/socials\/(?<socialId>[^/]+)$/,
    handle: ({ id, socialId }) => {
      const contact = findContact(id);
      contact.socials = contact.socials.filter((s) => s.id !== socialId);
      return { deleted: 1 };
    },
  },
  {
    method: 'POST',
    pattern: /^\/contacts\/(?<id>[^/]+)\/fields$/,
    handle: ({ id }, body) => {
      const contact = findContact(id);
      const field = toStoredContactChild(id, body as CustomFieldInput, contact.customFields.length);
      contact.customFields.push(field);
      return field;
    },
  },
  {
    method: 'PUT',
    pattern: /^\/contacts\/(?<id>[^/]+)\/fields\/(?<fieldId>[^/]+)$/,
    handle: ({ id, fieldId }, body) => {
      const field = findContact(id).customFields.find((f) => f.id === fieldId);
      if (!field) throw new MockHttpError(404, 'Custom field not found');
      return Object.assign(field, body, { updatedAt: now() });
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/contacts\/(?<id>[^/]+)\/fields\/(?<fieldId>[^/]+)$/,
    handle: ({ id, fieldId }) => {
      const contact = findContact(id);
      contact.customFields = contact.customFields.filter((f) => f.id !== fieldId);
      return { deleted: 1 };
    },
  },
  {
    method: 'GET',
    pattern: /^\/contacts\/(?<id>[^/]+)\/timeline$/,
    handle: ({ id }) => TimelineEvents.filter((event) => event.contactId === id),
  },
  {
    method: 'GET',
    pattern: /^\/contacts\/(?<id>[^/]+)\/media$/,
    handle: () => [],
  },
  {
    method: 'POST',
    pattern: /^\/contacts\/(?<id>[^/]+)\/uploads\/signature$/,
    handle: (): UploadSignature => ({
      uploadUrl: 'https://api.cloudinary.com/v1_1/mock/image/upload',
      apiKey: 'mock-api-key',
      signature: 'mock-signature',
      params: { timestamp: Date.now() },
    }),
  },
];

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const findRoute = (method: string, path: string) => {
  for (const route of routes) {
    if (route.method !== method) continue;
    const match = route.pattern.exec(path);
    if (match) return { route, params: match.groups ?? {} };
  }
  return null;
};

export function replaceFetchWithMockApi({
  failWithStatus,
  delayMs = DEFAULT_DELAY_MS,
}: MockApiOptions = {}) {
  contacts = structuredClone(ContactDetails);

  globalThis.fetch = async (input, init) => {
    const request = new Request(input, init);
    const { pathname } = new URL(request.url);
    const matched = findRoute(request.method, pathname);
    if (!matched) return realFetch(input, init);

    await wait(delayMs);
    if (failWithStatus) return jsonResponse(failWithStatus, { error: 'Mock API error' });

    const bodyText = await request.text();
    const body = bodyText ? JSON.parse(bodyText) : undefined;
    try {
      return jsonResponse(200, structuredClone(matched.route.handle(matched.params, body)));
    } catch (error) {
      if (error instanceof MockHttpError)
        return jsonResponse(error.status, { error: error.message });
      throw error;
    }
  };
}
