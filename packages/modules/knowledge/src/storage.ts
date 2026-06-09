import { UTApi } from "uploadthing/server";

/**
 * Server-side UploadThing client, built per-request from the secret binding.
 * Mirrors the agriculture module's helper (kept local rather than shared so the
 * modules stay decoupled). Used for management operations like deleting an
 * article's image when the row is removed.
 */
export function getUploadThing(token: string): UTApi {
  return new UTApi({ token });
}
