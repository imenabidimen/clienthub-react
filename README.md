# ClientHub

![CI](https://github.com/imenabidimen/clienthub-react/actions/workflows/ci.yml/badge.svg)

**Portfolio role:** a React 18 + TypeScript frontend for tracking deliverables. It consumes the shared [TaskForge API](https://github.com/imenabidimen/taskforge-api), keeping authentication and persistence in the backend.

Related work: [WorkBoard (Vue)](https://github.com/imenabidimen/workboard-vue) demonstrates the same API contract from a Vue perspective. ClientHub currently stores tasks, not independent client/project entities; the UI presents a deliverables workflow without claiming a full CRM data model.


ClientHub is a React-based deliverables checklist. It presents tasks as items to track through a delivery cycle and uses TaskForge for sign-in and persistence.

The current API stores tasks, not separate client or project records. The project labels in the interface are presentation context; they are not a multi-client/project management model.

## Stack

- React 18 and TypeScript
- Vite
- Vitest and Testing Library
- TaskForge API (NestJS, PostgreSQL)

## Current features

- Account creation and sign-in
- Authenticated workspace
- Add and complete deliverables
- Completion percentage and open/completed counts
- Loading, empty and error states
- Responsive layout
- Bearer-token API integration and expired-session handling

## Run locally

Start [TaskForge API](https://github.com/imenabidimen/taskforge-api) first, with its API available at `http://localhost:3000/api`. Then:

```bash
npm install
npm run dev
```

If the API uses a different address, copy `.env.example` to `.env.local` and set `VITE_API_URL` to the API base URL (include `/api`). Vite reads `.env.local` when starting the dev server.

```bash
npm test
npm run build
```

## Screenshots

These are browser captures from the CI workflow, using a fresh test account against TaskForge and PostgreSQL.

### Sign in
![ClientHub sign in](docs/screenshots/01-sign-in.png)

### Create an account
![ClientHub sign up](docs/screenshots/02-sign-up.png)

### Add a deliverable
![ClientHub deliverable added](docs/screenshots/03-deliverable-added.png)

### Complete a deliverable
![ClientHub deliverable completed](docs/screenshots/04-deliverable-completed.png)

## Why this version uses React

ClientHub uses the same small task API as WorkBoard but presents a different workflow and visual layout. This keeps the backend contract shared while the two frontends can be compared side by side.