import { useSyncExternalStore } from "react";
import type { Localized } from "@/i18n/localized";

/**
 * "My Plantings" — saved entirely in the browser (localStorage). No account, no
 * server, no notifications: the user records what they planted and when, and the
 * app shows expected progress via the stateless timeline. This is the only place
 * user-specific data lives, and it never leaves the device.
 */
export interface Planting {
  id: string;
  cropId: string;
  cropName: Localized;
  /** ISO date (YYYY-MM-DD) the user planted. */
  plantedOn: string;
  nickname?: string;
  createdAt: number;
}

const KEY = "karots.plantings";
const listeners = new Set<() => void>();
let cache: Planting[] | null = null;

function read(): Planting[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Planting[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: Planting[]): void {
  cache = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

export function addPlanting(input: Omit<Planting, "id" | "createdAt">): Planting {
  const planting: Planting = { ...input, id: crypto.randomUUID(), createdAt: Date.now() };
  write([planting, ...read()]);
  return planting;
}

export function removePlanting(id: string): void {
  write(read().filter((p) => p.id !== id));
}

export function getPlanting(id: string): Planting | undefined {
  return read().find((p) => p.id === id);
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** React hook: live list of plantings, re-rendering on any change. */
export function usePlantings(): Planting[] {
  return useSyncExternalStore(subscribe, read, read);
}
