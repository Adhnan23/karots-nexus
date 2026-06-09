import { defineConfig } from "drizzle-kit";

/**
 * Single migration source for the whole platform so it fits Wrangler's one
 * `migrations_dir` model. Schemas are aggregated here at BUILD TIME only —
 * reaching into module packages by relative path does NOT create a runtime
 * dependency (drizzle.config is never bundled into the Worker). When a new
 * module is added, append its schema file to the `schema` array.
 */
export default defineConfig({
  dialect: "sqlite",
  out: "./migrations",
  schema: [
    "./src/schema/index.ts",
    "../modules/agriculture/src/schema.ts",
    "../modules/knowledge/src/schema.ts",
  ],
});
