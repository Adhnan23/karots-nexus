import { drizzle } from "drizzle-orm/d1";

/**
 * Build a Drizzle client over a D1 binding.
 *
 * Modules import this factory and use their own table definitions in queries,
 * so this stays decoupled from any single module's schema.
 */
export function getDb(d1: D1Database) {
  return drizzle(d1);
}

export type Database = ReturnType<typeof getDb>;

export * as coreSchema from "./schema";
