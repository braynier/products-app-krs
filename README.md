# Products App (React + DummyJSON)

A small internal-style product management app built with React, TypeScript, Fluent UI, React Router, and React Query.

This implementation uses the public DummyJSON products API to simulate product operations (list/search/sort/filter/details/create/edit/delete), with role-based UI permissions.

## Tech Stack

- React 17 + TypeScript
- Vite
- React Router v6
- TanStack React Query v4
- Fluent UI React v9
- DummyJSON REST API (`https://dummyjson.com/products`)

## Run Locally

## Prerequisites

- Node.js 18+
- npm

## Commands

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173` by default.

Build for production:

```bash
npm run build
npm run preview
```

## What Is Implemented

- Product list page with API fetch
- Search by title (`/products/search`)
- Sorting by `price` or `stock`
- Client-side category filter
- Product details page
- Edit flow (update `price` and `stock` via `PUT /products/:id`)
- Delete flow via `DELETE /products/:id`
- Create flow via `POST /products/add`
- Loading, error, retry, and confirmation dialog states
- Cache updates after create/update/delete using React Query
- Simulated role permissions in UI (`Manager`, `Editor`, `Viewer`)

## Requirement Coverage

1. Product List View

- Implemented: fetch, search, sort, category filter.
- Note: list rows currently show title/price/category/stock; thumbnail is shown in details/edit pages.

2. Product Details / Edit

- Implemented: full details view, edit for price/stock, save through API.
- UI cache is updated after successful update response.

3. Delete Product

- Implemented with confirmation dialog and cache removal from list/detail queries.

4. State & UX

- Implemented loading, basic error handling, retry actions, and clean feature-based separation.

5. Permissions Logic

- Implemented in `src/auth/permissions.ts` and reflected in page actions/buttons.

## Role Permissions

Configured in `src/auth/permissions.ts`:

- `Manager`: create + edit + delete
- `Editor`: edit only
- `Viewer`: read-only

Current role is set via:

```ts
export const currentUserRole: UserRole = "Editor";
```

Change this value to simulate different users.

## Project Structure

```text
src/
  auth/
    permissions.ts
  features/products/
    components/
    hooks/
    pages/
    types.ts
  query/
    queryClient.ts
  services/
    http.ts
    productsApi.ts
  ui/
    AppLayout.tsx
```

## Architecture & Explanation

1. How would this app integrate with a SharePoint list?

- Replace DummyJSON API calls in `src/services/productsApi.ts` with a SharePoint-backed data service.
- In SPFx, use `SPHttpClient` or Microsoft Graph to read/write list items.
- Map list columns to the product model (`Title`, `Category`, `Price`, `Stock`, `Description`, `ThumbnailUrl`, etc.).
- Keep React Query hooks unchanged as much as possible by preserving service method contracts.

2. Where would Power Automate fit instead of direct PUT/DELETE?

- PUT/DELETE can call a custom API endpoint (or Azure Function) that triggers a Power Automate flow.
- Good fit for approval workflows, notifications, audit logging, enrichment, or multi-system writes.
- Frontend sends intent (e.g., "update product"), while flow executes business process and returns operation status.

3. Where should API calls live in a real application?

- In a dedicated data-access layer (`src/services/*`) behind typed functions and domain-focused hooks.
- UI components/pages should not call `fetch` directly.
- Keep transport concerns (headers, auth, retries, error shaping) centralized in `src/services/http.ts`.

4. How would permissions be handled with Microsoft 365?

- Use Entra ID + Microsoft 365 group membership / app roles from tokens.
- Enforce authorization both in UI (visibility/disabled state) and backend/API (source of truth).
- For SharePoint-specific security, align list/item permissions with the same role model.
- Avoid relying only on client-side role checks.

5. What would you refactor if the application grew?

- Introduce stricter feature boundaries and shared UI primitives.
- Add form schema validation (e.g., Zod + react-hook-form).
- Add automated tests (unit for hooks/services, integration for pages).
- Add API abstraction for environment switching (DummyJSON vs SharePoint backend).
- Introduce centralized logging/error telemetry.
- Add pagination/virtualization for large product sets.

## Notes

- DummyJSON is a demo API. Some mutations are simulated and may not persist permanently.
- The app updates local cache so UX still reflects successful operations immediately.
