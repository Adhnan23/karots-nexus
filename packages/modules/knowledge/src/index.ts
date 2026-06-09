import type { KarotsModule } from "@karots/core";
import { knowledgeRouter } from "./router";

/**
 * Knowledge Base module definition (plan.md #9). The composition root (apps/api)
 * registers this with the ModuleRegistry; core never imports it directly.
 */
export const knowledgeModule: KarotsModule = {
  name: "knowledge",
  basePath: "/knowledge",
  router: knowledgeRouter,
};

export { articles, KNOWLEDGE_CATEGORIES } from "./schema";
export type { Article, NewArticle, KnowledgeCategory } from "./schema";
export { getUploadThing } from "./storage";
