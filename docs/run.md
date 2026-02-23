# How to run Mine-Performance-3

## Prerequisites

- Node.js 18+
- npm

## Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Typecheck
npm run typecheck

# Build
npm run build

# Start production server (after build)
npm run start

# Unit tests (Vitest)
npm run test
npm run test -- --run

# E2E tests (Playwright; starts dev server if needed)
npm run test:e2e
npm run test:e2e:ui

# Lint
npm run lint

# Full prepush (lint, typecheck, unit tests, build)
npm run prepush
```

## Environment

Copy `.env.example` to `.env` and fill in values for auth, Supabase, Stripe, and optional site/social settings. See `.env.example` for comments.
