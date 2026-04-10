# Carlo

A full-stack, multi-tenant project management platform built with **Next.js 16**, **React 19**, and **Supabase**. Organizations can create Kanban boards, manage tasks with drag-and-drop, invite team members by email, and collaborate in real time -- all behind passwordless magic-link authentication.

> **Live demo:** _coming soon_ &nbsp;|&nbsp; **Built by:** Cahrl Louize Loyloy

---

## Highlights

- **Multi-tenant architecture** -- users create and switch between organizations, each with isolated boards, members, and permissions.
- **Kanban boards with drag-and-drop** -- powered by dnd-kit with optimistic UI updates and server-side persistence.
- **Passwordless auth** -- Supabase magic-link OTP flow with automatic session refresh and profile gating via Next.js proxy middleware.
- **Server Actions everywhere** -- zero REST API routes; all mutations go through type-safe, Zod-validated server actions with `revalidatePath`.
- **Role-based invitation system** -- invite members by email (admin/member roles), accept invitations, with duplicate prevention and atomic acceptance via Postgres RPC.
- **Optimistic UI** -- React 19 `useOptimistic` for instant section creation; local state for instant task creation with automatic rollback on failure.
- **Dark mode** -- system-aware theme toggle with `next-themes`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions, Proxy) |
| **UI** | [React 19](https://react.dev/) with `useOptimistic`, `useTransition` |
| **Language** | TypeScript 5 (strict) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (New York theme) |
| **Components** | [Radix UI](https://www.radix-ui.com/) primitives, [Lucide](https://lucide.dev/) icons, CVA variants |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod 4](https://zod.dev/) schema validation |
| **Drag & Drop** | [@dnd-kit](https://dndkit.com/) (core + sortable) |
| **Backend / DB** | [Supabase](https://supabase.com/) (PostgreSQL, Auth, Row-Level Security, RPC) |
| **Auth** | Supabase Auth -- email magic-link OTP, cookie-based SSR sessions |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) (class strategy) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│  React 19 · shadcn/ui · dnd-kit · React Hook Form       │
└────────────────────────┬────────────────────────────────┘
                         │  Server Actions (mutations)
                         │  Server Components (queries)
┌────────────────────────▼────────────────────────────────┐
│                   Next.js 16 Server                     │
│  Proxy (session refresh + auth redirect)                │
│  Server Actions (Zod validation → Supabase mutations)   │
│  Server Components (data fetching → RSC streaming)      │
└────────────────────────┬────────────────────────────────┘
                         │  PostgREST / Auth / RPC
┌────────────────────────▼────────────────────────────────┐
│                      Supabase                           │
│  PostgreSQL · Row-Level Security · Auth · Edge Functions │
└─────────────────────────────────────────────────────────┘
```

### Key architectural decisions

1. **Proxy-based middleware** -- Next.js 16 replaces traditional middleware with a `proxy.ts` entry point. Session refresh and auth gating (unauthenticated redirect, profile-setup gate) are handled here before any page renders.

2. **No API routes** -- The entire mutation surface uses Server Actions (`'use server'`), keeping the network boundary thin and type-safe. The only Route Handler is `/auth/confirm` for OTP token verification.

3. **Service layer separation** -- `lib/services/` cleanly splits into `queries/` (read-only server fetchers) and `actions/` (write mutations), with `getCurrentUser()` as a shared auth guard.

4. **Optimistic updates with rollback** -- The `useSectionGrid` hook uses React 19's `useOptimistic` for sections and manual optimistic state for tasks. Failed mutations automatically roll back the UI to the server state.

5. **Atomic invitation acceptance** -- Invitation acceptance is delegated to a Postgres RPC (`accept_organization_invitation`) to guarantee atomicity and enforce security constraints at the database level.

---

## Project Structure

```
carlo-app/
├── app/
│   ├── (non-sidebar)/            # Pages without sidebar (home, profile, invites)
│   │   ├── page.tsx              # Home -- organization list
│   │   ├── create/               # Create new organization
│   │   ├── profile/              # Edit user profile
│   │   └── invites/              # Pending invitations for current user
│   ├── (sidebar)/                # Pages with sidebar + org context
│   │   └── organization/[orgId]/
│   │       ├── page.tsx          # Boards list
│   │       ├── board/[boardId]/  # Kanban board (sections + tasks)
│   │       ├── members/          # Member management + invitations
│   │       ├── settings/         # Organization settings
│   │       └── inbox/            # Messaging (UI prototype)
│   ├── auth/
│   │   ├── login/                # Magic-link login
│   │   ├── setup/                # Profile name setup (first-time)
│   │   └── confirm/route.ts      # OTP verification endpoint
│   └── layout.tsx                # Root layout (fonts, providers, metadata)
├── components/
│   ├── auth/                     # Login form, profile setup form
│   ├── board/                    # Board list, board header, CRUD forms
│   ├── section/                  # Section grid, droppable sections, CRUD forms
│   ├── task/                     # Task items, sortable tasks, overlay, CRUD forms
│   ├── organization/             # Org list, settings form, invite dialog
│   ├── inbox/                    # Chat view, conversation list, mock data
│   ├── invitation/               # Accept/decline invitation actions
│   ├── profile/                  # Profile edit form
│   ├── sidebar/                  # App sidebar, nav, org switcher, user button
│   └── ui/                       # shadcn/ui primitives (button, dialog, card, etc.)
├── context/
│   ├── auth-context.tsx          # Current user + profile provider
│   └── org-context.tsx           # Active organization context
├── hooks/
│   ├── use-section-grid.ts       # DnD + optimistic state for Kanban boards
│   └── use-mobile.ts             # Responsive breakpoint hook
├── lib/
│   ├── client.ts                 # Supabase browser client
│   ├── server.ts                 # Supabase server client (cookie-aware)
│   ├── middleware.ts              # Session refresh + auth redirect logic
│   ├── types.ts                  # Domain type definitions
│   ├── utils.ts                  # cn() utility
│   ├── schemas/                  # Zod validation schemas per domain
│   └── services/
│       ├── getCurrentUser.ts     # Auth guard (shared by actions + queries)
│       ├── actions/              # Server Actions (create, update, move, delete)
│       └── queries/              # Server-only data fetchers
└── proxy.ts                      # Next.js 16 proxy entry (calls updateSession)
```

---

## Features in Detail

### Organizations
Create, rename, and switch between organizations. Each org is an isolated workspace with its own boards, members, and settings. The sidebar provides an org switcher for quick navigation.

### Kanban Boards
Each organization can have multiple boards. Boards are initialized with default sections (To Do, In Progress, Testing, Done) and support custom sections. Tasks within sections can be dragged and dropped to reorder or move across sections, with changes persisted to the database.

### Task Management
Tasks support:
- **Title and description**
- **Assignee** -- assign to any org member
- **Due date** -- date picker integration
- **Priority levels** -- visual priority indicators
- **Drag-and-drop reordering** -- within and across sections

### Team Collaboration
- Invite members by email with role selection (admin or member)
- Duplicate invite prevention at the application level
- Accept invitations from a dedicated invitations page
- Member list with profile details

### Authentication Flow
1. User enters email on the login page
2. Supabase sends a magic-link OTP
3. User clicks the link, hitting `/auth/confirm` which verifies the token
4. Proxy middleware checks if the user has a profile name set
5. First-time users are redirected to `/auth/setup` to complete their profile
6. Subsequent visits are automatically authenticated via cookie-based sessions

---

## Data Model

```
user_profile
├── id (PK, matches auth.users.id)
├── name
├── email
├── image_url
└── timestamps

organization
├── id (PK)
├── name
├── owner_id → user_profile.id
└── timestamps

organization_member
├── org_id → organization.id
├── member_id → user_profile.id
├── role (owner | admin | member)
├── status
└── created_at

organization_invitation
├── id (PK)
├── org_id → organization.id
├── email
├── role
├── status (pending | accepted)
├── invited_by → user_profile.id
├── expires_at
└── timestamps

board
├── id (PK)
├── title
├── description
├── org_id → organization.id
├── creator_id → user_profile.id
└── timestamps

section
├── id (PK)
├── title
├── sort_order
├── board_id → board.id
├── creator_id → user_profile.id
└── created_at

task
├── id (PK)
├── title
├── description
├── section_id → section.id
├── sort_order
├── creator_id → user_profile.id
├── assignee_id → user_profile.id
├── due_date
├── priority
└── timestamps
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Supabase](https://supabase.com/) project (free tier works)

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/carlo-app.git
   cd carlo-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Set up the database**

   In your Supabase dashboard, create the tables described in the [Data Model](#data-model) section and enable Row-Level Security. Create the `accept_organization_invitation` RPC function to handle atomic invitation acceptance.

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Roadmap

- [ ] Real-time messaging (replace mock data with Supabase Realtime)
- [ ] Decline invitation flow
- [ ] Real-time board updates (Supabase Realtime subscriptions)
