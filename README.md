# Aprende+ — Frontend

Learning platform for children with learning difficulties.

Built with **React 19 + TypeScript + Vite**.

## Getting started

```bash
npm install
cp .env.example .env       # configure VITE_API_URL if needed
npm run dev                # start dev server (port 5173)
npm run build              # production build
npm run preview            # preview the production build
npm run lint               # run oxlint
npm run typecheck          # tsc -b
```

## Environment

| Variable       | Default                     | Notes                                        |
| -------------- | --------------------------- | -------------------------------------------- |
| `VITE_API_URL` | `http://localhost:3001`     | Backend base URL. Used by the axios client.  |

In dev, the Vite proxy also forwards `/api/*` to that URL, so relative paths work too.

## Stack

- React 19 + TypeScript
- Vite 8 (HMR via Oxc)
- React Router v7 (client-side routing)
- TanStack Query v5 (configured; not consumed yet — see below)
- Axios (typed API client)
- CSS Modules not used; single global stylesheet at `src/styles.css`

### Why no design framework yet?

Plain CSS for now. Light theme, blue/white palette, Duolingo-inspired cards.
When design decisions are made, swap to Tailwind / shadcn / etc.

### Why is the data mock?

The teacher area renders against in-memory mock data so the client can see
something concrete while the backend is still in flux. Real API calls aren't
wired up — the typed wrappers in `src/api/teaching.ts` exist but are unused.
Migration plan: replace `getRelationshipsForTeacher(teacherId)` with
`useQuery({ queryKey: ['relationships', teacherId], queryFn: () => listRelationships({ teacherId }) })`.

## Routes

| Path                                                | Description                                    |
| --------------------------------------------------- | ---------------------------------------------- |
| `/`                                                 | Home — list teachers and students in the system |
| `/teacher/:teacherId`                               | Teacher dashboard (Active / Pending / Past tabs) |
| `/teacher/:teacherId/students/:studentId`            | Student profile (learning prefs + relationship)  |
| `/teacher/:teacherId/invite`                        | Search for a student and send an invite          |

## Project structure

```
src/
  api/
    teaching.ts                  # typed wrappers for the backend endpoints (unused yet)
  components/
    Layout.tsx                   # app shell — header + main + footer
    Avatar.tsx                   # initials avatar
    StatusPill.tsx               # PENDING/ACCEPTED/DECLINED/REVOKED_BY_* pill
  lib/
    api.ts                       # axios instance (baseURL from VITE_API_URL)
  mocks/
    index.ts                     # in-memory users + relationships
  pages/
    HomePage.tsx
    TeacherDashboard.tsx
    StudentProfilePage.tsx
    InviteStudentPage.tsx
  types/
    index.ts                     # shared types — mirrored from backend responses
  styles.css                     # global theme
  App.tsx                        # router
  main.tsx                       # entry — QueryClientProvider + BrowserRouter
```

## Backlog

- Wire real API calls (swap mock helpers for `useQuery`)
- Auth (replace hardcoded teacher picker)
- Lesson authoring UI + assignment flow
- Student-side dashboard (accept/decline/revoke invites)
- Accessibility audit (children with learning difficulties — this is non-negotiable)
