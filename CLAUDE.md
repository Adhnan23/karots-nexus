# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Foundation scaffolded and verified booting. Active surface: the API Worker with a health
route, a full-CRUD agriculture module (crops with rich intelligence — seasons, planting
months, suitable districts, water need, expected yield, climate/soil notes, farming guide;
plus crop stages, market prices, disease/pest catalog — all GET public, mutations
admin-only), stateless calculators (growth timeline, profitability), a farming decision
engine (`GET /agriculture/recommendations?districtId=` → best-to-plant-now / high-profit /
low-risk by district + season + price trend), a knowledge base module (localized farming
guides/articles — public read, admin CRUD), localized seed data (25 SL districts, 5
enriched crops + stages, 10 disease/pest entries, 5 knowledge articles), and a weather
module on Open-Meteo.
Symptom search, knowledge search, and recommendation reasons span all three languages. The
decision engine's `lowRisk` lens is weather-aware via a core *capability* (the weather module
provides `districtRisks`; the two modules never import each other).

There is now a **React PWA frontend** (`apps/web`): Vite + React + TS, Tailwind v3 +
shadcn-style components, react-router, vite-plugin-pwa (installable, offline app shell). It
covers crop browse (list + detail) and **My Plantings** — a *client-side-only* tracker
(localStorage, no account, no server state): "I planted this" saves a planting and the
progress screen renders the stateless growth timeline (live online, recomputed from cached
stages offline). i18n is a React `LangProvider` (en/si/ta, persisted); the `Localized` type
is **redeclared locally** in the web app (not imported from `@karots/core`) so server/
Cloudflare-typed core code never enters the browser bundle or typecheck. Dev uses a Vite
proxy to the Worker (:8787), so no CORS; prod serving via Workers static assets is planned,
not wired. Many other screens (dashboard/district picker, weather, prices, recommendations,
knowledge browse, admin panel) and most of the `plan.md` vision are not built yet.

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
  entities (users, districts) without coupling to each other. Link by id, not by FK, when
  the target lives in another module (e.g. `articles.cropId` has no foreign key).
- **Modules never import each other.** When one module needs another's data, core defines a
  neutral *capability* interface (`packages/core/src/capabilities.ts`, e.g. `districtRisks`);
  the composition root wires the provider in and exposes it on the Hono context
  (`c.var.capabilities`), and consumers treat it as optional. This is how the agriculture
  decision engine uses weather risk without importing `@karots/weather`.

When adding functionality, first decide: is it a *core* capability (district, search,
analytics, plugin registry, auth) or a *module* capability? Core lives in `packages/core`;
everything domain-specific lives under `packages/modules/<name>`.

## Access model (no user accounts)

This is a free public service with **no end-user accounts and no notifications**. The public
is **anonymous and read-only**; they browse data and use stateless calculators (e.g. the
growth timeline). Only an **admin** can mutate data, authenticated by a shared `ADMIN_TOKEN`
(no login/users table). Apply `requireAdmin` from `@karots/core` to every mutating
(POST/PUT/PATCH/DELETE) route; GET routes stay public. The token is sent as
`Authorization: Bearer <ADMIN_TOKEN>`; `GET /admin/me` lets a client validate it. The `users`
table exists but is currently unused — keep new features account-free unless this changes.

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

## Localization (Sinhala / Tamil / English)

User-facing content is multilingual. Translatable fields are stored as a **`Localized`
JSON value `{ en, si?, ta? }`** (English required) — crop names/categories, stage
names/descriptions, disease text, market `itemName`, district names. The API **returns all
three languages**; the frontend renders the user's chosen one (instant switch, offline-
friendly). Helpers live in `@karots/core` (`Localized`, `localize`, `resolveLocale`,
`isLocalized`, `LOCALES`). Server-generated text (e.g. weather risk messages) is also
Localized. Drizzle columns use `text(col, { mode: "json" }).$type<Localized>()` (no DDL
change — stored as TEXT). Identity/grouping keys stay language-neutral (e.g. market
`itemKey`). Seeded si/ta strings are best-effort — have a native speaker review them.

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
apps/web                       React PWA — Vite, Tailwind, react-router, vite-plugin-pwa
  src/i18n                     LangProvider (en/si/ta), local Localized type + localize
  src/api                      typed fetch client + localStorage cache
  src/plantings                client-side-only planting store (localStorage, no account)
  src/pages                    CropList, CropDetail, MyPlantings, PlantingProgress
  vite.config.ts               dev proxy of API prefixes → Worker :8787 (no CORS)
packages/core                  ModuleRegistry, KarotsModule contract, AppBindings/AppEnv
packages/db                    getDb(d1) factory, core schema (users, districts),
                               drizzle.config (aggregates all schemas), migrations/
packages/modules/agriculture   crops + crop_stages + market_prices + diseases schema,
                               Hono router, growth-timeline + profitability + decision-engine
                               (recommendations) calcs, UploadThing helper
packages/modules/weather       Open-Meteo client, current+forecast routes by district,
                               KV cache, farming-risk flags, getDistrictRisks capability
                               provider (NO db table — reads core districts)
packages/modules/knowledge     articles schema (localized guides/articles, soft crop link),
                               Hono router (public read + admin CRUD), UploadThing helper
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
   `getDb` from `@karots/db`). Paths are relative to the module's `basePath`. Guard every
   mutating route with `requireAdmin` (see Access model).
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
- **Seed districts + crops** (idempotent): `bun run seed:local`
  (or individually `seed:districts:local` / `seed:crops:local`; `:remote` variants exist)
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
