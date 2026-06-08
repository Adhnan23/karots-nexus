import type { Hono } from "hono";
import type { AppEnv } from "./types";

/**
 * The contract every Karots Nexus module must satisfy.
 *
 * A module is a self-contained plug-in: it owns its routes (and, separately, its
 * own schema + migrations). Core knows nothing about a module's internals — only
 * this contract. Adding a module never requires editing core or sibling modules.
 */
export interface KarotsModule {
  /** Unique module id, e.g. "agriculture". */
  name: string;
  /** URL prefix the router is mounted under, e.g. "/agriculture". */
  basePath: string;
  /** The module's Hono router, typed against the shared AppEnv. */
  router: Hono<AppEnv>;
}

/**
 * Holds the set of active modules and mounts them onto the API Worker.
 *
 * The core platform depends on this registry; it must never depend on any
 * concrete module. The composition root (apps/api) wires modules in.
 */
export class ModuleRegistry {
  private readonly modules = new Map<string, KarotsModule>();

  /** Register a module. Throws on duplicate name or basePath. */
  register(module: KarotsModule): this {
    if (this.modules.has(module.name)) {
      throw new Error(`Module "${module.name}" is already registered`);
    }
    for (const existing of this.modules.values()) {
      if (existing.basePath === module.basePath) {
        throw new Error(
          `basePath "${module.basePath}" is already used by module "${existing.name}"`,
        );
      }
    }
    this.modules.set(module.name, module);
    return this;
  }

  /** All registered modules, in registration order. */
  list(): readonly KarotsModule[] {
    return [...this.modules.values()];
  }

  /** Mount every registered module's router onto the given app. */
  mountAll(app: Hono<AppEnv>): void {
    for (const module of this.modules.values()) {
      app.route(module.basePath, module.router);
    }
  }
}
