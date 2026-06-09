import { Hono } from "hono";
import { ModuleRegistry, requireAdmin, type AppEnv, type AppCapabilities } from "@karots/core";
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

// Cross-module capabilities, wired here (the only place modules meet). The
// weather module provides district risk to the agriculture decision engine
// without either module importing the other.
const capabilities: AppCapabilities = { districtRisks: getDistrictRisks };
app.use("*", async (c, next) => {
  c.set("capabilities", capabilities);
  await next();
});

app.get("/health", (c) =>
  c.json({
    status: "ok",
    modules: registry.list().map((m) => ({ name: m.name, basePath: m.basePath })),
  }),
);

// Lets an admin client (e.g. the admin panel) verify its token is valid.
app.get("/admin/me", requireAdmin, (c) => c.json({ admin: true }));

registry.mountAll(app);

export default app;
