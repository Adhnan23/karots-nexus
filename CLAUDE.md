# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Foundation scaffolded and verified booting. Active surface: the API Worker with a health
route and a working agriculture module (`/agriculture/crops` GET + POST backed by D1). The
full product/vision spec lives in `plan.md` — most of its features are not built yet.

Toolchain: **Bun** (package manager + scripts), Cloudflare Workers runtime via Wrangler.
A global `wrangler` (4.87.0) is on PATH but is older than the workspace-pinned 4.98.0 — always
run Wrangler through the Bun scripts (`bun run dev`), not bare `wrangler`, so the pinned
version is used. The runtime caps `compatibility_date` at what its bundled workerd supports;
it is currently set to `2026-05-07` (raise it as you upgrade Wrangler).

## Project

Karots Nexus is a **modular** life & agriculture intelligence platform: a shared core plus
independent domain modules. **Agriculture is the first and only active module.** Livestock,
fisheries, and daily-essentials are planned future modules. See `plan.md` for the complete
domain spec (crop intelligence, market pricing, weather, decision engine, farm planning,
disease/pest catalog, profitability, alerts, knowledge base, admin) — do not duplicate that
list elsewhere; reference it.

## Core architecture principle (non-negotiable)

This is the central constraint the whole codebase is organized around:

- **Core must never depend on any single module.** Modules depend on core, never the reverse.
- **Modules are plug-ins.** Each registers itself with the core plugin registry and can be
  added or removed without editing core or other modules.
- **Every domain entity carries district context.** Location is a `country → district →
  local area` hierarchy; data is filtered, priced, and recommended per district.
- **Data models support cross-module linking** so future modules can reference shared
  entities (users, districts) without coupling to each other.

When adding functionality, first decide: is it a *core* capability (user, district,
notifications, search, analytics, plugin registry) or a *module* capability? Core lives in
`packages/core`; everything domain-specific lives under `packages/modules/<name>`.

## Stack & bindings (Cloudflare full-stack, TypeScript)

- **API** — Hono on Cloudflare Workers. One Hono router per module, mounted by the core
  plugin registry. Adding a module = add a router; core wiring does not change.
- **Database** — Cloudflare D1 (SQLite) with Drizzle ORM (typed schema + migrations).
- **Storage** — **UploadThing** for crop/disease images and guide assets. The Worker stores
  the UploadThing file URL/key in D1; the frontend uploads via the UploadThing React SDK.
  This replaces R2 — there is **no R2 binding**; requires an `UPLOADTHING_TOKEN` secret.
- **Cache** — KV for weather snapshots and computed recommendations.
- **Async** — Queues (notifications, price alerts) and Cron Triggers / Workflows (scheduled
  price + weather polling, alert evaluation).
- **Search / AI** — Vectorize for cross-module and symptom-based diagnosis search; Workers
  AI for the decision engine and recommendations.
- **Realtime** — Durable Objects for per-district coordination where needed.
- **Frontend** — React + Vite PWA, Tailwind + shadcn/ui (mobile-first, dashboard-centric,
  offline-friendly).

## Domain context & external data

Target market is **Sri Lanka**: prices are in **LKR**, locations use the district hierarchy.
- **Weather** — Open-Meteo (free, no API key, CC BY 4.0). Called by the weather module using
  a district's `latitude`/`longitude`; responses cached in KV for 30 min.
- **Market prices** — there is **no free public API** for Sri Lankan daily prices (HARTI/DOA/
  CBSL publish only HTML/PDF; data.gov.lk CKAN has an expired cert). Prices are entered
  manually via `POST /agriculture/prices`. A scheduled scraper is a possible future module.

## Repository layout

Bun workspaces. `@karots/*` packages resolve via workspace symlinks; their `exports`
point directly at `src/*.ts` (Wrangler/esbuild bundle TS, so no build step between packages).

```
apps/api                       Hono Worker — composition root: registers + mounts modules
  src/index.ts                 ModuleRegistry wiring, /health
  wrangler.jsonc               bindings (DB, CACHE); UPLOADTHING_TOKEN via .dev.vars/secret
apps/web                       React PWA (not created yet)
packages/core                  ModuleRegistry, KarotsModule contract, AppBindings/AppEnv
packages/db                    getDb(d1) factory, core schema (users, districts),
                               drizzle.config (aggregates all schemas), migrations/
packages/modules/agriculture   crops + market_prices + diseases schema, Hono router,
                               module def, UploadThing helper
packages/modules/weather       Open-Meteo client, current+forecast routes by district,
                               KV cache, farming-risk flags (NO db table — reads core districts)
packages/ui                    shared components (not created yet)
```

Note the dependency direction: `apps/api` → core + modules; modules → core + db; **core
depends on nothing**. `packages/db/drizzle.config.ts` reaches into module schema files by
relative path, but only at build time (it is never bundled into the Worker), so this does
not create a runtime cycle.

## Module contract & how to add a module

A module is a `packages/modules/<name>` package that exports a `KarotsModule`
(`{ name, basePath, router }`) — see `packages/modules/agriculture` as the reference.
To add one:
1. Define its **Drizzle schema** in the module (`schema.ts`); district-scope localized
   entities by referencing `districts`.
2. Build a **Hono router** typed `Hono<AppEnv>` (import `AppEnv` from `@karots/core`,
   `getDb` from `@karots/db`). Paths are relative to the module's `basePath`.
3. Export the `KarotsModule` from the package `index.ts`.
4. Register it in the composition root: add `.register(<module>)` in `apps/api/src/index.ts`.
5. Add the module's `schema.ts` path to the `schema` array in
   `packages/db/drizzle.config.ts`, then `bun run db:generate` + `db:apply:local`.

Core and sibling modules are never edited — only the composition root and the central
drizzle config (build tooling). Removing a module reverses these steps.

## Commands

Run from the repo root unless noted:

- **Install**: `bun install`
- **Dev** (local Worker + local D1/KV, reads `.dev.vars`): `bun run dev` → http://localhost:8787
- **Typecheck**: `bun run typecheck` (`tsc --noEmit` over the whole workspace)
- **Generate migrations** (after editing any schema): `bun run db:generate`
  — drizzle-kit reads `packages/db/drizzle.config.ts`, which aggregates core schema +
  each module's schema, and writes SQL to `packages/db/migrations/`.
- **Apply migrations locally**: `bun run db:apply:local`
- **Apply migrations to remote D1**: `bun run db:apply:remote`
- **Deploy**: `bun run deploy`
- **Regenerate Env types from bindings**: `bun run --cwd apps/api cf-typegen` (`wrangler types`)

Tests: none yet — no test runner is wired in.

### First-time remote setup (before deploy)
`wrangler.jsonc` has placeholder ids. Create the resources and paste the ids in:
`wrangler d1 create karots-nexus`, `wrangler kv namespace create CACHE`, and
`wrangler secret put UPLOADTHING_TOKEN`. Local dev works without these.

### Smoke test
`curl localhost:8787/health` → lists registered modules.
`curl -X POST localhost:8787/agriculture/crops -d '{"name":"Tomato"}'` then
`curl localhost:8787/agriculture/crops`.
