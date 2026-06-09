import { Hono } from "hono";
import { ModuleRegistry, requireAdmin, type AppEnv, type AppCapabilities } from "@karots/core";
import { getDb, coreSchema } from "@karots/db";
import { agricultureModule } from "@karots/agriculture";
import { weatherModule, getDistrictRisks } from "@karots/weather";
import { knowledgeModule } from "@karots/knowledge";

/**
 * Composition root. This is the ONLY place that knows about concrete modules:
 * it registers them with the core registry and mounts them. Core and the
 * modules never import each other directly.
 *
 * To add a module: import its definition and `.register(...)` it. Nothing else
 * in core changes.
 */
const registry = new ModuleRegistry()
  .register(agricultureModule)
  .register(weatherModule)
  .register(knowledgeModule);

const app = new Hono<AppEnv>();

// The entire API lives under `/api` so it can never collide with the frontend
// SPA's client-side routes (e.g. the app's `/weather` page vs. the weather
// module's API). In production the Worker owns `/api/*` and serves the SPA for
// everything else; in dev, Vite proxies only `/api` to the Worker.
const api = new Hono<AppEnv>();

// Cross-module capabilities, wired here (the only place modules meet). The
// weather module provides district risk to the agriculture decision engine
// without either module importing the other.
const capabilities: AppCapabilities = { districtRisks: getDistrictRisks };
api.use("*", async (c, next) => {
  c.set("capabilities", capabilities);
  await next();
});

api.get("/health", (c) =>
  c.json({
    status: "ok",
    modules: registry.list().map((m) => ({ name: m.name, basePath: m.basePath })),
  }),
);

// Districts are a CORE entity (every domain record is district-scoped), not owned
// by any module — so the public read lives here in the composition root. Used by
// the frontend's district picker and by weather/recommendations lookups.
api.get("/districts", async (c) => {
  const db = getDb(c.env.DB);
  const rows = await db.select().from(coreSchema.districts);
  // Sort here rather than via drizzle's `asc` so the composition root need not
  // depend on drizzle-orm directly (it isn't a direct dep of apps/api).
  rows.sort((a, b) => a.country.localeCompare(b.country) || a.id.localeCompare(b.id));
  return c.json({ districts: rows });
});

// Lets an admin client (e.g. the admin panel) verify its token is valid.
api.get("/admin/me", requireAdmin, (c) => c.json({ admin: true }));

registry.mountAll(api);

app.route("/api", api);

export default app;
