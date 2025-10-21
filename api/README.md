# Advanced CRM API

> A multi-tenant Customer Relationship Management backend powered by Node.js, TypeScript, Express, and Prisma.

## Highlights
- CRM resources scoped by company, keeping users, leads, and clients isolated per tenant.
- CRUD endpoints for companies, users, leads, and clients with relationship-aware operations.
- Request validation built with Zod and consistent error responses via typed application errors.
- Passwords stored with Argon2id hashing and safe credential verification utilities.
- Automated OpenAPI 3.0 documentation served through Swagger UI.

## Tech Stack
- Node.js 20+ and TypeScript 5
- Express 5 HTTP server
- Prisma ORM with PostgreSQL
- Zod schema validation
- Swagger JSDoc + Swagger UI Express
- Argon2 for secure password hashing

## Getting Started

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
```

## Available npm Scripts
- `npm run dev`: start the development server with `tsx watch`.
- `npm run build`: compile TypeScript sources to `dist/`.
- `npm run start`: run the compiled JavaScript with Node.js.

## Contributing
1. Fork the repository and create a feature branch.
2. Keep commits focused and document any behavioral changes.
3. Open a pull request describing the motivation and how you validated the change.