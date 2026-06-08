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

export { crops, cropStages, marketPrices, diseases, ITEM_TYPES, DISEASE_KINDS } from "./schema";
export type {
  Crop,
  NewCrop,
  CropStage,
  NewCropStage,
  MarketPrice,
  NewMarketPrice,
  Disease,
  NewDisease,
  ItemType,
  DiseaseKind,
} from "./schema";
export { getUploadThing } from "./storage";
export { buildTimeline } from "./timeline";
export type { GrowthTimeline, StageView } from "./timeline";
