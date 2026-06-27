# Ironclad Dashboard

Ironclad Dashboard is a premium, multi-tenant administrative interface built with **Next.js 15 (App Router)**, **Tailwind CSS v4**, and **shadcn/ui**. It provides a sleek, dark-mode first UI for managing applications, organizations, users, and roles/privileges.

## Features

- **Multi-tenant Organization Switcher:** Seamlessly switch between different organizations or view the global dashboard.
- **Access Control Management:** Manage Applications, Roles, and Privileges, including a Permission Matrix for easy RBAC assignments.
- **Directory Management:** View Users and their Memberships across different apps and orgs.
- **Premium Aesthetics:** Uses modern UI trends, micro-animations, and a sleek dark-mode layout powered by shadcn/ui.
- **Auth0 Integration:** Fully integrated with Auth0 for secure authentication using `@auth0/nextjs-auth0`.

## Tech Stack

- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS v4 + Base UI (shadcn/ui v4)
- **State Management:** Zustand
- **Data Fetching:** Custom mock API abstraction layer (ready to be swapped with a real backend)
- **Authentication:** Auth0

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Configure your environment variables by copying the example file:

```bash
cp .env.example .env.local
```
*(Ensure you fill in your Auth0 tenant details in `.env.local`)*

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result. Note that the dashboard runs on port `3001` by default to avoid conflicting with backend services on `3000`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
