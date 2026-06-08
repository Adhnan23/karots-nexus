import { UTApi } from "uploadthing/server";

/**
 * Server-side UploadThing client, built per-request from the secret binding.
 *
 * Workers have no long-lived process, so construct this inside a handler using
 * `c.env.UPLOADTHING_TOKEN` rather than at module load. The token carries the
 * appId + region, so no other config is required.
 *
 * Direct browser uploads use the UploadThing React SDK on the frontend; this
 * server client is for management operations (delete, list, signed access).
 */
export function getUploadThing(token: string): UTApi {
  return new UTApi({ token });
}
