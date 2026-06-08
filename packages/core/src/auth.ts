import { createMiddleware } from "hono/factory";
import type { AppEnv } from "./types";

/**
 * Constant-time string compare to avoid leaking the admin token via timing.
 * Uses the Workers runtime's crypto.subtle.timingSafeEqual (throws on length
 * mismatch, so guard length first — and the early return is itself non-secret).
 */
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  if (ba.byteLength !== bb.byteLength) return false;
  return crypto.subtle.timingSafeEqual(ba, bb);
}

/** Extract a bearer token from the Authorization header, if present. */
export function getBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  return match ? match[1] : null;
}

/**
 * Guard for admin-only (mutating) routes. The platform has no user accounts;
 * the public is read-only. A request is admin iff it presents the ADMIN_TOKEN
 * as a bearer token. Apply per-route on POST/PUT/PATCH/DELETE handlers.
 */
export const requireAdmin = createMiddleware<AppEnv>(async (c, next) => {
  const provided = getBearerToken(c.req.header("Authorization"));
  const expected = c.env.ADMIN_TOKEN;
  if (!expected || !provided || !timingSafeEqual(provided, expected)) {
    return c.json({ error: "admin authentication required" }, 401);
  }
  await next();
});
