import { useEffect, useState, useSyncExternalStore } from "react";
import type { District } from "@/api/types";
import { listDistricts } from "@/api/client";

/**
 * Selected district — persisted in the browser. Every domain view (weather,
 * recommendations, prices) is district-scoped, so the choice is global and
 * sticky across sessions. The list itself comes from the API (cached for
 * offline) via `useDistricts`.
 */
const KEY = "karots.district";
const listeners = new Set<() => void>();

function readId(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setSelectedDistrictId(id: string): void {
  localStorage.setItem(KEY, id);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function useSelectedDistrictId(): string | null {
  return useSyncExternalStore(subscribe, readId, readId);
}

export interface UseDistricts {
  districts: District[];
  selected: District | null;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  loading: boolean;
}

/**
 * Loads the district list and tracks the selected one. If nothing is selected
 * yet, defaults to Colombo (else the first district) and persists it, so
 * district-scoped screens always have a value to work with.
 */
export function useDistricts(): UseDistricts {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedId = useSelectedDistrictId();

  useEffect(() => {
    let cancelled = false;
    listDistricts()
      .then((d) => {
        if (!cancelled) setDistricts(d);
      })
      .catch(() => {
        if (!cancelled) setDistricts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedId || districts.length === 0) return;
    const fallback = districts.find((d) => d.id === "lk-colombo") ?? districts[0];
    if (fallback) setSelectedDistrictId(fallback.id);
  }, [selectedId, districts]);

  const selected = districts.find((d) => d.id === selectedId) ?? null;
  return { districts, selected, selectedId, setSelectedId: setSelectedDistrictId, loading };
}
