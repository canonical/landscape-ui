# Landscape UI

[![Tests](https://github.com/canonical/landscape-ui/actions/workflows/run-tests.yml/badge.svg)](https://github.com/canonical/landscape-ui/actions/workflows/run-tests.yml)

The modern web interface for Canonical's Landscape, built with React and TypeScript.

---

- [About Landscape](#about-landscape)
- [About this Repository](#about-this-repository)
- [Getting Started with Local Development](#getting-started-with-local-development)
- [Technology Stack](#technology-stack)
- [Feedback & Support](#feedback--support)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

---

## About Landscape

**Canonical Landscape** is a comprehensive systems management tool designed to help you monitor, manage, and update your entire Ubuntu estate from a single interface. It provides administrators with a centralized platform for managing physical, virtual, and cloud-based Ubuntu servers.

Landscape is available as a SaaS solution at [landscape.canonical.com](https://landscape.canonical.com/) and as a self-hosted application.



---

## About this Repository

This repository contains the source code for the **new, modern web interface for Landscape**.

This new UI is currently under active development and is intended to eventually replace the legacy UI. For now, both user interfaces are available within the Landscape product, with the classic UI being the default. Our goal is to incrementally migrate all features to this new, improved dashboard.

---

## Getting Started with Local Development

Follow these instructions to set up the project on your local machine for development and testing purposes.

### Prerequisites

* **Node.js** (v22 or later recommended)
* **pnpm** package manager. If you don't have it, you can install it with `npm install -g pnpm`.

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/canonical/landscape-ui.git](https://github.com/canonical/landscape-ui.git)
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

---

## Technology Stack

This project is built with a modern, robust set of tools:

* **Framework/Library**: [React](https://reactjs.org/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Package Manager**: [PNPM](https://pnpm.io/)
* **Data Fetching**: [React Query](https://tanstack.com/query/latest)
* **Unit & Integration Testing**: [Vitest](https://vitest.dev/)
* **End-to-End Testing**: [Playwright](https://playwright.dev/)
* **API Mocking**: [MSW (Mock Service Worker)](https://mswjs.io/)
* **Containerization**: [Docker](https://www.docker.com/)

---

## Feedback & Support

We welcome your feedback! The best way to share your thoughts, report issues, or request features is through one of the following channels:

* **Create an issue** directly on our [GitHub Issues page](https://github.com/canonical/landscape-ui/issues).
* **Join the discussion** on our official [Discourse feedback topic](https://discourse.ubuntu.com/t/feedback-on-the-new-web-portal/50528).

---

## Contributing

Community contributions are what make open source great! We welcome any contributions to improve Landscape UI.

You can contribute by:

* Reporting bugs and suggesting features in [Issues](https://github.com/canonical/landscape-ui/issues).
* Submitting pull requests to fix bugs or add new functionality.

---

## Code of Conduct

This project adopts the [Ubuntu Code of Conduct](https://ubuntu.com/community/code-of-conduct).

With ♥ from Canonical