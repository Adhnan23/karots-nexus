import type { AppBindings } from "./types";

/**
 * Cross-module capability contracts.
 *
 * Modules must not import each other (see the architecture principle in
 * CLAUDE.md), but some features benefit from another module's data — e.g. the
 * agriculture decision engine wants weather risk. Core owns a small set of
 * neutral capability interfaces; the composition root (apps/api) wires concrete
 * providers in and exposes them on the Hono context. Consumers treat every
 * capability as OPTIONAL, so a module keeps working when the provider module is
 * not registered.
 */

/** Weather risk flags for a district — a neutral subset shared across modules. */
export interface DistrictRisk {
  heavyRain?: boolean;
  heatStress?: boolean;
  drySpell?: boolean;
  thunderstorm?: boolean;
}

/** The capabilities a request may have available (all optional). */
export interface AppCapabilities {
  /** Current weather risk flags for a district, or null if unavailable. */
  districtRisks?: (env: AppBindings, districtId: string) => Promise<DistrictRisk | null>;
}
