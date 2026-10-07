# ClientHub

A React + TypeScript workspace for managing **client delivery work**. ClientHub uses the same TaskForge API as WorkBoard, but presents a different product experience: client context, delivery progress, project metrics and deliverables.

## What it demonstrates

- React + TypeScript + Vite
- Sign in and account creation
- Bearer-token API integration
- Client/project-oriented dashboard
- Deliverable creation and completion
- Progress and status metrics
- Loading, empty, validation and error states
- Responsive UI
- Vitest tests
- GitHub Actions browser verification with Playwright

## Architecture

```
React + TypeScript
        |
        | REST + Bearer token
        v
TaskForge API (NestJS)
        |
        v
PostgreSQL
```

The backend is intentionally shared with the other frontend client. This repository focuses on a distinct React product experience rather than duplicating backend logic.

## Run locally

```bash
npm install
npm run dev
npm test
npm run build
```

Set `VITE_API_URL` when the API is not available at `http://localhost:3000/api`.

## Real application walkthrough

These screenshots are captured from the **running React + NestJS + PostgreSQL stack in GitHub Actions using Playwright**. They are real browser captures, not generated product images.

### 1. Sign in

![ClientHub sign in](docs/screenshots/01-sign-in.png)

### 2. Create an account

![ClientHub sign up](docs/screenshots/02-sign-up.png)

### 3. Add a client deliverable

![ClientHub deliverable added](docs/screenshots/03-deliverable-added.png)

### 4. Complete the deliverable

![ClientHub deliverable completed](docs/screenshots/04-deliverable-completed.png)

The CI pipeline tests/builds the frontend, starts the real API and PostgreSQL database, executes this browser journey, and uploads the screenshots as an artifact.

## Why a separate React project?

ClientHub demonstrates that I can move between React and Vue while keeping a clean API boundary. The applications share a backend, but they are deliberately different products: **WorkBoard = personal task execution; ClientHub = client delivery management.**
