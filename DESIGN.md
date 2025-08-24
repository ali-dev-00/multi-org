Architecture

- Models: `Organization`, `Contact`, `ContactNote`, `ContactMeta`, `User`
- Scoping: `BelongsToOrganization` trait adds global scope and sets `organization_id` on create via `CurrentOrganization` service (session-backed)
- Middleware: `SetCurrentOrganization` resolves org and sets Spatie team id
- AuthZ: spatie/laravel-permission roles per org (Admin, Member); `ContactPolicy`
- UI: Inertia + React TS pages: Organizations Index (switch/create), Contacts List/Create/Edit/Show

Duplicate Flow

1) POST /contacts checks existing contact by lower(email) in current org
2) If duplicate: 422 JSON { code: "DUPLICATE_EMAIL", existing_contact_id }
3) Frontend intercepts and redirects to Show with `duplicate=1` query showing banner

Routes

- /healthz
- /organizations [index, store, switch]
- /contacts [index, create, store, show, edit, update, destroy, duplicate]
- /contacts/{contact}/notes [store, update, destroy]

UI Outline

- Minimal black/white Tailwind; shadcn could be added for inputs/buttons if expanded


