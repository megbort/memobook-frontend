# AGENTS.md

This file provides guidance to AI coding agents working with code in this repository. `CLAUDE.md` holds the same content; keep them in sync.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Type-check + build for production
npm run preview      # Preview production build at http://localhost:4173
npm run lint         # ESLint with auto-fix
npm run format       # Prettier format src/
npm run type-check   # TypeScript check only
npm run test:unit    # Vitest unit tests
npm run test:e2e     # Cypress e2e (requires preview server)
npm run test:e2e:dev # Cypress e2e against dev server (interactive)
npm run storybook    # Storybook at http://localhost:6006
npm run build-storybook # Static Storybook build into storybook-static/
```

## Architecture

MemoBook is a single-page Vue 3 + TypeScript contact management app. There is currently only one route (`/` → `DashboardView`).

**Data flow:** `DashboardView` fetches the contact list via `src/services/contacts.ts`, holds it in a `ref<Contact[]>`, and passes it down as props. `SidePanel` renders the list with search filtering, emits `update:selectedContact` and `add`, and follows the parent's `selected` prop. `ContactView` fetches the full `ContactDetail` (socials + custom fields) for the selected id, handles edit/save, adding/removing custom fields and socials, and delete (PrimeVue `ConfirmDialog` via `ConfirmationService` in `main.ts`). It emits `updated` / `deleted` so the dashboard list stays in sync. `ContactFormDialog` creates a new contact (core fields, socials, custom fields) in one POST.

**Components:** `DetailRow` (label/value row, switches to inputs when editing), `SocialLinkForm` (inputs for one social link), `ContactTimeline` (PrimeVue `Timeline` over timeline events). `AvatarPicker` (when `editable`, click the avatar to pick an image and use the trash icon to remove it; there is no URL field, uploads set the Cloudinary URL. It only picks a file. `ContactView` uploads it on Save and `ContactFormDialog` uploads it after the contact is created, since uploads are stored under the contact id. `services/uploads.ts` asks the backend for a signed Cloudinary upload and sends the file straight to Cloudinary; `uploadApi.uploadFile(contactId, 'media', file)` is ready for the Media tab). `PageLoader` (full-screen spinner shown while saving). Shared fetch helpers (`API_BASE_URL`, `request`, `send`) live in `services/apiClient.ts`. The Media tab is a placeholder. The Timeline tab is also a "coming soon" placeholder for now; `ContactTimeline.vue` and `contactApi.getTimeline` are kept for when it's built (the backend already logs every change).

**Backend:** JSON REST API (see backend README for the ERD and endpoints). The base URL comes from `VITE_API_BASE_URL` in `.env`, which has a prod and a local line to comment in/out (restart Vite after switching). `.env` is gitignored and CI has none, so the service falls back to the production Railway URL. Without a reachable backend the app shows an error state with a retry button. `src/mocks/` holds sample API data (`contacts.ts`, `contactDetails.ts`, `timeline.ts`) and `mockApi.ts`, an in-memory fake of the REST API that replaces `fetch`. It is only installed by Storybook, never by the app.

**Styling:** Tailwind CSS v4 (imported via `@import 'tailwindcss'` in `src/styles.css`) with a custom design token palette defined under `@theme` (mirrored as CSS variables in `src/assets/base.scss`; keep both in sync with the Figma palette). All brand colours use the `memobook-` prefix (e.g. `text-memobook-green`, `bg-memobook-dark-grey`). `tailwindcss-primeui` bridges Tailwind and PrimeVue theming. SCSS is used for component-scoped styles.

**PrimeVue:** Configured in `src/main.ts` with `MemobookPreset` (`src/theme/memobookPreset.ts`: Aura plus the Figma button styles; see the mapping at the top of that file). Dark mode follows the `.dark` class set by `useTheme`. `ConfirmationService` and the `v-tooltip` directive are registered globally; components are imported per file. Cancel buttons use `severity="contrast" variant="outlined"` (grey).

**Storybook:** Config in `.storybook/`; `preview.ts` mirrors the PrimeVue/Pinia setup from `main.ts`, adds a light/dark toolbar (`.dark` class) and installs the mock API for every story (`parameters.mockApi: { failWithStatus }` simulates errors). Stories live in `src/stories/` (`design-system/`, `components/`, `pages/`), mirroring the sidebar. Component files stay story-free. Cloudinary uploads are not mocked.

**State:** Pinia is set up but not yet used — component state lives in `ref`s within `DashboardView`.

## Code style

- Write self-descriptive code: names of variables, functions, constants and components should say what they are and do. Prefer renaming, or extracting a well-named helper, over adding a comment.
- Comment only where really needed: to explain *why* something non-obvious is done (a constraint, a workaround, a gotcha). Never restate *what* the code does.
- No section-banner or divider comments, no commented-out code.
