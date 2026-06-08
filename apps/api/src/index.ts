import { Hono } from "hono";
import { ModuleRegistry, type AppEnv } from "@karots/core";
import { agricultureModule } from "@karots/agriculture";
import { weatherModule } from "@karots/weather";

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
  .register(weatherModule);

const app = new Hono<AppEnv>();

app.get("/health", (c) =>
  c.json({
    status: "ok",
    modules: registry.list().map((m) => ({ name: m.name, basePath: m.basePath })),
  }),
);

registry.mountAll(app);

export default app;
