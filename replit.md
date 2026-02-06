# AI PrepPulse

## Overview

AI PrepPulse is an AI-powered interview readiness assessment tool built for a hackathon. It helps students objectively measure their interview preparation in under 2 minutes by evaluating four dimensions: Technical Skills (40%), Resume (20%), Communication (20%), and Portfolio (20%). Users complete a short wizard-style questionnaire and receive a scored readiness level (0-100), personalized strengths/gaps analysis, actionable AI-generated feedback, and a 7-14 day improvement plan.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter (lightweight client-side router) with three main pages: Landing (`/`), Assessment (`/assessment`), Results (`/results/:id`)
- **Styling**: Tailwind CSS with custom CSS variables for theming, using an Apple-esque clean design palette with electric violet/blue as primary color
- **UI Components**: Shadcn UI (new-york style) with Radix UI primitives — components live in `client/src/components/ui/`
- **Animations**: Framer Motion for wizard step transitions and results page animations
- **State Management**: React Query (`@tanstack/react-query`) for server state, React Hook Form with Zod resolver for form handling
- **Special Effects**: `canvas-confetti` for celebration on high scores, `react-circular-progressbar` for score visualization
- **Fonts**: Inter (body) and Space Grotesk (display headings)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express.js running on Node.js with TypeScript (tsx for dev, esbuild for production)
- **API Pattern**: REST API with routes defined in `server/routes.ts`, shared route definitions in `shared/routes.ts`
- **Key Endpoints**:
  - `POST /api/assessments` — Submit assessment form data, calculates scores server-side, generates AI feedback, stores results
  - `GET /api/assessments/:id` — Retrieve assessment results by ID
- **Scoring Logic**: Server-side weighted scoring — MCQ correctness (15%), technical self-rating (25%), resume presence (20%), communication rating (20%), portfolio (20%). Correct MCQ answers are hardcoded per role.
- **AI Integration**: OpenAI SDK (GPT-5.1 via Replit AI Integrations) for generating personalized feedback, strengths/gaps analysis, and improvement plans. Uses environment variables `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`.
- **Dev Server**: Vite middleware is used in development for HMR; in production, static files are served from `dist/public`

### Database
- **Database**: PostgreSQL (required, connection via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` — the `assessments` table stores all user inputs, calculated scores, readiness level, strengths/gaps (JSONB), improvement plan (JSONB), and AI feedback
- **Additional Tables**: `conversations` and `messages` tables exist in `shared/models/chat.ts` for the Replit AI integrations (chat/audio features) but are not core to the assessment flow
- **Migrations**: Generated to `./migrations/` directory, pushed via `drizzle-kit push`

### Shared Code
- `shared/schema.ts` — Database schema and Zod validation schemas (used by both client and server)
- `shared/routes.ts` — API route definitions with method, path, and response schemas for type-safe API calls

### Build System
- **Development**: `tsx server/index.ts` runs the Express server with Vite middleware
- **Production Build**: `script/build.ts` runs Vite build for client (outputs to `dist/public`) and esbuild for server (bundles to `dist/index.cjs`), with an allowlist of dependencies to bundle for faster cold starts
- **Type Checking**: `tsc --noEmit` via `npm run check`

### Replit Integrations (Pre-built)
The `server/replit_integrations/` and `client/replit_integrations/` directories contain pre-built modules for audio/voice chat, text chat, image generation, and batch processing. These are utility modules provided by the Replit platform and are not central to the assessment feature but are available for use.

## External Dependencies

- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable. Required for the application to start.
- **OpenAI API (via Replit AI Integrations)**: Used for generating personalized AI feedback on assessment results. Configured via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` environment variables. Uses model `gpt-5.1`.
- **Key npm packages**: `drizzle-orm` + `drizzle-kit` (ORM), `express` (server), `react` + `vite` (frontend), `openai` (AI client), `zod` (validation), `framer-motion` (animations), `react-circular-progressbar` (score gauge), `canvas-confetti` (celebrations), `wouter` (routing), `@tanstack/react-query` (data fetching)