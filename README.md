# Advanced CRM API

> A multi-tenant Customer Relationship Management backend powered by Node.js, TypeScript, Express, and Prisma.

## Highlights
- CRM resources scoped by company, keeping users, leads, and clients isolated per tenant.
- CRUD endpoints for companies, users, leads, and clients with relationship-aware operations.
- Request validation built with Zod and consistent error responses via typed application errors.
- Passwords stored with Argon2id hashing and safe credential verification utilities.
- Automated OpenAPI 3.0 documentation served through Swagger UI.

## Tech Stack

### Backend
- Node.js 20+ and TypeScript 5
- Express 5 HTTP server
- Prisma ORM with PostgreSQL
- Zod schema validation
- Swagger JSDoc + Swagger UI Express
- Argon2 for secure password hashing

### Frontend
- Next.js 15 (App Router) with React 19 and TypeScript
- Material UI 7 for ready-made UI components
- Axios for HTTP requests
- Zod for client-side validation and form safety
- Zustand/Context-agnostic architecture (React Context used here) for auth/data state

## Getting Started

This repository hosts both the backend API (in the `api/` folder) and the Next.js frontend (in the `frontend/` folder). You can run them independently or in parallel.

### Prerequisites
- Node.js 18 or newer (20 LTS recommended)
- npm 9+
- A PostgreSQL instance

### Installation
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/JoaoArnaud/advanced-crm-api.git
   cd advanced-crm-api
   npm install
   ```
2. Create a `.env` file at the project root and configure the database connection:
   ```ini
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/advanced_crm"
   PORT=3333
   ```
   Adjust the credentials, host, and database name to match your environment.
3. Apply the Prisma schema to your database:
   ```bash
   npx prisma migrate dev
   ```
   The command also generates the Prisma client under `src/generated/prisma`.

### Running Locally
- Start the development server with hot reload:
  ```bash
  npm run dev
  ```
- Build the TypeScript sources and run the compiled version:
  ```bash
  npm run build
  npm run start
  ```

Swagger UI becomes available at `http://localhost:3333/api/docs` (adjust the port if you changed it), and the raw OpenAPI spec is served at `/api/docs.json`.

---

## Frontend (Next.js)

### Folder Structure
```
frontend/
  src/
    app/                 # Next.js routes (auth, home dashboard, settings)
    components/          # Reusable dialogs, layout, UI helpers
    contexts/            # Authentication and CRM data providers
    hooks/               # Route protection and other shared hooks
    services/            # Axios wrappers for users, leads, clients
    types/               # Shared API/domain TypeScript definitions
```

### Environment Variables
Create `frontend/.env.local` (or export the variable) to point the UI to the backend:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333/api
```
If you leave it unset, the app falls back to the local URL above.

### Installation & Scripts
```bash
cd frontend
npm install          # install dependencies
npm run dev          # start Next.js with Turbopack (http://localhost:3000)
npm run build        # production build
npm run start        # serve the production build
npm run lint         # lint TypeScript/React files
```

### Core Pages & Features
- **Auth (/**): combined Register/Login tabs with Zod validation, error snackbars, and automatic redirect after success.
- **Home (/home)**: protected route showing two Material UI tables:
  - Leads table with status chips, CRUD dialogs, and delete confirmation.
  - Clients table with lead-origin badges, CRUD dialogs, and delete confirmation.
- **Settings (/settings)**: protected page that fetches the logged user, lets them edit name/company/role, and syncs the context state.

### State & Data Flow
- **AuthContext**: persists the authenticated user in `localStorage`, exposes register/login/logout/update helpers, and hydrates the session on page load.
- **CRMDataContext**: fetches leads/clients for the user’s company and provides create/update/delete helpers with optimistic state updates and error surfacing.
- **Route Protection**: `useProtectedRoute` pushes anonymous visitors back to `/` if they hit internal routes.
- **Services**: axios-based modules under `src/services/` keep the API calls centralized and typed.

### UI Notes
- Material UI Theme is defined once in `LayoutProviders`, so colors/typography are consistent.
- Dialog components (`LeadDialog`, `ClientDialog`, `ConfirmDialog`) encapsulate form logic + validation, keeping pages lean.
- Feedback is provided through MUI `Snackbar + Alert` pairs for success/error states.

## Database & Prisma
- Prisma models live in `prisma/schema.prisma` and target a PostgreSQL datasource.
- Entities:
  - `Company`: parent record for the multi-tenant structure.
  - `User`: belongs to a company and has a role (`ADMIN` or `USER`).
  - `Leads`: potential customers linked to a company with a `LeadStatus` (`HOT`, `WARM`, `COLD`).
  - `Clients`: active customers, optionally referencing their originating lead.
- Generate, migrate, and inspect the database with the standard Prisma CLI commands:
  ```bash
  npx prisma generate
  npx prisma migrate dev
  npx prisma studio
  ```

## API Overview
Every route is prefixed with `/api` (see `src/index.ts`). The key resources are:

| Resource | Base Path | Notes |
|----------|-----------|-------|
| Users | `/users` | Includes authentication via `/users/login`.
| Companies | `/companies` | Supports full CRUD operations.
| Leads | `/companies/{companyId}/leads` | Scoped to a company; uses integer lead IDs.
| Clients | `/companies/{companyId}/clients` | Scoped to a company; can be linked to a lead origin.

Detailed request/response shapes and status codes are documented in Swagger UI and enforced via Zod validators under `src/validators`.

## Error Handling & Validation
- Validation failures emit structured `400` responses produced by Zod.
- Domain errors (conflict, not found, authentication) extend a custom `ApplicationError` base class to ensure consistent HTTP status codes.
- Unexpected issues are logged and returned as `500` errors.

## Project Structure
```
api/
  src/
    controllers/     # Express route handlers coordinating validation and services
    services/        # Business logic layers integrating with Prisma
    routes/          # Resource routing mounted under /api
    validators/      # Zod schemas for bodies and params
    errors/          # Custom error hierarchy for predictable HTTP responses
    docs/            # Swagger specification builder
    db/              # Prisma client bootstrap
  prisma/
    schema.prisma    # Database schema and generator configuration
frontend/
  src/
    app/             # Next.js routes (App Router)
    components/      # Shared UI components, dialogs, layout
    contexts/        # React context providers (auth + CRM data)
    hooks/           # Custom hooks (route protection, etc.)
    services/        # Axios instances and resource-specific calls
    types/           # Shared data contracts between frontend modules
```

## Available npm Scripts
- `npm run dev`: start the development server with `tsx watch`.
- `npm run build`: compile TypeScript sources to `dist/`.
- `npm run start`: run the compiled JavaScript with Node.js.

## Contributing
1. Fork the repository and create a feature branch.
2. Keep commits focused and document any behavioral changes.
3. Open a pull request describing the motivation and how you validated the change.
