# Food App Next

A full-stack Next.js project focused on authentication, route protection, meal sharing, and production-ready flow design.

This project is built to demonstrate:
- clean architecture choices
- practical auth/security logic
- UX flow decisions
- testable business rules

## Why This Project

This project was built to explore modern full-stack patterns with Next.js, focusing on authentication, route protection, and scalable application design.
It emphasizes clean architecture, practical security considerations, and maintainable, testable code.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Supabase
  - Auth (signup/login/session)
  - Postgres (meals data)
  - Storage (meal images)
- Next.js Middleware (route protection + redirects)
- Server Actions (auth flows)
- Zod (form validation)
- Vitest (unit tests)
- ESLint

## Main Features

- Authentication
  - Signup
  - Login
  - Logout
- Route protection with middleware
  - unauthenticated users are redirected to auth flow
  - authenticated users are redirected away from auth pages
- Meals
  - list meals
  - meal details
  - create meal
  - edit/delete actions (owner-oriented flow)
- Image upload/storage
  - migrated from S3 links to Supabase Storage public bucket

## Key Technical Decisions

- Authentication handled via Supabase with server-side session validation
- Route protection implemented using Next.js middleware instead of client-side guards
- Business logic extracted into testable utility functions (auth-routing)
- Server Actions used for secure auth flows instead of client-heavy logic
- Validation isolated with Zod schemas for consistency and reusability
- Storage strategy migrated from external URLs to Supabase Storage for better control

## User Experience Flow (Verified)

### Visitor flow
1. Open app root
2. Access auth entry page
3. Choose Login or Signup
4. After authentication, redirect to home page
5. Navigate to meals/community

### Authenticated flow
1. Access home page and protected content
2. Open meals list and meal details
3. Logout from header
4. Session cleared and user returns to auth flow

### Edge-case handling
- repeated slashes in URL (example: //auth) are normalized
- protected pages redirect safely when no session exists
- auth pages redirect safely when session exists

## Tests

Unit tests are implemented using Vitest to validate core business logic:

- Authentication validation (Zod schemas)
- Route protection and redirect logic

Current status:
- 2 test suites
- 8 tests passing

The testing approach focuses on isolating critical logic to ensure reliability and maintainability.

## Quality Checks

Commands executed successfully:

- npm run lint
- npm run build
- npm run test:run

## Project Structure (Core)

- app/
  - auth/ (landing, login, signup)
  - meals/ (list, details, actions)
  - actions/auth.js (server actions)
- components/
  - main-header/
  - meals/
- utils/
  - supabase/ (server/client/admin/middleware)
  - validation/
  - auth-routing.js (testable routing decisions)
- lib/
  - auth.js
  - meals.js

## Environment Variables

Required in .env.local:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

## Run Locally

1. Install dependencies

npm install

2. Start development server

npm run dev

3. Run tests

npm run test:run

4. Build for production

npm run build

## Technical Highlights (Mots-clés utilisés)

- Next.js App Router
- Server Actions
- Middleware
- Supabase Auth
- Supabase Storage
- PostgreSQL
- Session management
- Route guarding
- Zod validation
- Vitest unit testing
- ESLint
- UX flow design
- Clean code
- Full-stack JavaScript
- 
## Development Approach

This project was built using AI-assisted coding tools as a productivity aid.
All system design decisions, feature implementation choices, debugging, and test strategy were defined, reviewed, and validated independently.
AI was used to accelerate iteration, not to replace engineering reasoning.

## Notes

- This project intentionally focuses on real-world auth and routing logic rather than only UI.
- The architecture was adjusted to keep logic testable (routing decisions extracted into helper functions).
