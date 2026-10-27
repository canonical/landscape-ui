# Landscape UI

[![Integration Tests](https://github.com/canonical/landscape-ui/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/canonical/landscape-ui/actions/workflows/integration-tests.yml)

The modern web interface for Canonical's Landscape, built with React and TypeScript.

---

- [About Landscape](#about-landscape)
- [About this Repository](#about-this-repository)
- [Documentation Map](#documentation-map)
- [Getting Started with Local Development](#getting-started-with-local-development)
- [Technology Stack](#technology-stack)
- [Feedback & Support](#feedback--support)

---

## About Landscape

**Canonical Landscape** is a comprehensive systems management tool designed to help you monitor, manage, and update your entire Ubuntu estate from a single interface. It provides administrators with a centralized platform for managing physical, virtual, and cloud-based Ubuntu servers.

Landscape is available as a SaaS solution at [landscape.canonical.com](https://landscape.canonical.com/) and as a self-hosted application.

---

## About this Repository

This repository contains the source code for the **new, modern web interface for Landscape**.

This new UI is currently under active development and is intended to replace the legacy UI. Today, both user interfaces still exist within the Landscape product, but the goal of this repository is to incrementally migrate Landscape workflows into this dashboard until the classic interface can be removed.

---

## Documentation Map

The repository now includes a small agent- and contributor-facing knowledge base:

- [AGENTS.md](AGENTS.md) is the top-level map for agent tooling and quick repo orientation.
- [docs/index.md](docs/index.md) is the index for architecture, frontend conventions, and planning docs.
- [docs/testing/index.md](docs/testing/index.md) defines the repository test layers and test strategy.
- [docs/verification/index.md](docs/verification/index.md) defines the broader verification workflow, including TDD expectations and closed-loop validation.
- Existing root docs such as [SECURITY.md](SECURITY.md), [RELEASES.md](RELEASES.md), and [CONTRIBUTING.md](CONTRIBUTING.md) remain authoritative for their current subjects.

---

## Getting Started with Local Development

Follow these instructions to set up the project on your local machine for development and testing purposes.

### Prerequisites

- **Node.js** (v24 or later recommended)
- **pnpm** package manager. If you don't have it, you can install it with `npm install -g pnpm`.

### Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/canonical/landscape-ui.git
    cd landscape-ui
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Configure your environment:**
    Make a copy of the example environment file and rename it to `.env.local`.

    ```bash
    cp .env.local.example .env.local
    ```

    Now, edit `.env.local` to match your local Landscape setup, providing the necessary API endpoints and credentials.

    With `VITE_MSW_ENABLED=true` the app runs against the mocks in `src/tests/`: sign in with any credentials, and the session survives reloads. To use the app as Canonical staff (super admin mode), run `window.msw.setGlobalRoles(["SupportProvider", "AccountManager"])` in the browser console and reload.

### Activity demo data (MSW)

With `VITE_MSW_ENABLED=true`, browser-only activity fixtures cover the activity
table, details panels, and local links without changing the unit-test fixtures.
For Compose, set the flag in the UI environment file used by your stack and
recreate the UI service so Vite receives the new value. TSV export controls also
require `VITE_TSV_EXPORTS_ENABLED=true`.

| Where                                           | What to inspect                                                                                                                                    |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Overview, both activity tabs, **View all**      | More than 20 matching children; large local list, Instance column, status chip, search/filter controls, pagination and selection                   |
| Overview activity row or list row               | Small child details; closing nested details preserves the list's search, page and selection                                                        |
| Activities                                      | More than 20 groups; group-only table without an Instance column or mutation actions                                                               |
| Group `id:10000`                                | Large group with Activities/Output tabs and more than 20 children                                                                                  |
| Group `id:10001`                                | Activities block without tabs (no group output)                                                                                                    |
| Groups `id:10027` and `id:10028`                | Empty groups, without and with output respectively                                                                                                 |
| Group `id:10002`                                | Children covering every status, output/no output, creator/no creator, no actions, long summaries and applicable Approve/Cancel/Redo actions        |
| Instances, **Application Server 1**, Activities | Child-only table without an Instance column; small details                                                                                         |
| Instances, **Application Server 1**, Users      | `user1`/`user2` pending lock/unlock links, `user3` pending deletion in details/edit, and pending-field links in Edit user                          |
| Edit `user1`                                    | Change a field and additional groups to queue multiple operations; **View activities** searches for the returned group IDs without opening details |
| Scripts, Profiles                               | Last run timestamps and run-history rows open real group details locally                                                                           |
| Profiles, USG profiles                          | Run an audit or remediation profile, then **View details** in the notification to open a real group locally                                        |

Search accepts structured terms, for example `id:10000`, `computer:id:1`,
`type:ExecuteScriptRequest`, and `creator:john@example.com`; an unmatched ID
shows a filtered-empty result. Unsupported plain-text searches return a 400
rather than silently pretending to match descriptions.

Browser console controls let you inspect request states:

```js
window.msw.setActivityScenario("empty"); // Empty Overview and activity collections
window.msw.setActivityScenario("loading"); // Pending activity requests
window.msw.setActivityScenario("error"); // Activity API errors
window.msw.setActivityScenario("default"); // Restore populated data
```

Reload after setting a scenario. It persists for the browser tab's session.
Approve, Cancel and Redo update the in-memory child data; reload restores it.
The demo intercepts activity APIs and their user/profile entry points; it also
uses the existing computer/profile/export mocks so related links remain local.

### Running the Development Server

Once the setup is complete, you can start the Vite development server:

```bash
pnpm dev
```

Open the URL provided in your terminal (usually http://localhost:5173) to view the application. The app will automatically reload if you change any of the source files.

### Building for Production

To create a production-ready build of the application, run:

```bash
pnpm build
```

This command bundles the app into static files for production in the `dist/` directory.

---

## Technology Stack

This project is built with a modern, robust set of tools:

- **Framework/Library**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Package Manager**: [PNPM](https://pnpm.io/)
- **Data Fetching**: [React Query](https://tanstack.com/query/latest)
- **Unit & Integration Testing**: [Vitest](https://vitest.dev/)
- **End-to-End Testing**: [Playwright](https://playwright.dev/)
- **API Mocking**: [MSW (Mock Service Worker)](https://mswjs.io/)
- **Containerization**: [Docker](https://www.docker.com/)

---

## Feedback & Support

We welcome your feedback! The best way to share your thoughts, report issues, or request features is through one of the following channels:

- **Create an issue** directly on our [GitHub Issues page](https://github.com/canonical/landscape-ui/issues).
- **Report a bug** on our [Launchpad project](https://bugs.launchpad.net/landscape).

---

With ♥ from Canonical
