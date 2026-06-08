/**
 * Shared runtime bindings available to the API Worker and every module.
 *
 * Keep this list to CORE infrastructure only. Anything domain-specific belongs
 * to a module, not here. Mirrors the bindings declared in apps/api/wrangler.jsonc;
 * after changing bindings, regenerate types with `wrangler types`.
 */
export interface AppBindings {
  /** Cloudflare D1 (SQLite) — primary structured datastore. */
  DB: D1Database;
  /** Cloudflare KV — caches weather snapshots and computed recommendations. */
  CACHE: KVNamespace;
  /** UploadThing API token (secret) — image/asset uploads. No R2 binding. */
  UPLOADTHING_TOKEN: string;
  /**
   * Shared secret for admin actions (secret). There are no user accounts — the
   * public is anonymous/read-only; only holders of this token may mutate data.
   */
  ADMIN_TOKEN: string;
}

/** Hono environment shape used across the app and all module routers. */
export interface AppEnv {
  Bindings: AppBindings;
}
