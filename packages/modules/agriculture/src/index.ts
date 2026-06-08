import type { KarotsModule } from "@karots/core";
import { agricultureRouter } from "./router";

/**
 * Agriculture module definition. The composition root (apps/api) registers this
 * with the ModuleRegistry; core never imports it directly.
 */
export const agricultureModule: KarotsModule = {
  name: "agriculture",
  basePath: "/agriculture",
  router: agricultureRouter,
};

export { crops } from "./schema";
export type { Crop, NewCrop } from "./schema";
export { getUploadThing } from "./storage";
