import { useCallback, useEffect, useState } from "react";
import { Header } from "./Header";
import { Scanner } from "./Scanner";
import { ManualEntry } from "./ManualEntry";
import { ScanList } from "./ScanList";
import type { ScanEntry } from "@/types/barcode";

const STORAGE_KEY = "field-scanner.scans.v1";

function loadScans(): ScanEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s): s is ScanEntry =>
        s && typeof s.value === "string" && typeof s.timestamp === "number",
    );
  } catch {
    return [];
  }
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}

export function ScannerApp() {
  const [scans, setScans] = useState<ScanEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setScans(loadScans());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
    } catch {
      /* ignore quota */
    }
  }, [scans, hydrated]);

  const addScan = useCallback(
    (value: string, format: string, source: ScanEntry["source"]): boolean => {
      let accepted = false;
      setScans((prev) => {
        if (prev.some((s) => s.value === value)) {
          vibrate(60);
          return prev;
        }
        accepted = true;
        vibrate(source === "camera" ? [40, 30, 40] : 50);
        const entry: ScanEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          value,
          format,
          timestamp: Date.now(),
          source,
        };
        return [entry, ...prev];
      });
      return accepted;
    },
    [],
  );

  const handleManual = useCallback(
    (value: string) => addScan(value, "MANUAL", "manual"),
    [addScan],
  );

  const removeScan = useCallback((id: string) => {
    setScans((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    if (scans.length === 0) return;
    if (confirm(`Clear all ${scans.length} scans?`)) {
      setScans([]);
    }
  }, [scans.length]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header count={scans.length} onClear={clearAll} />
      <Scanner onScan={addScan} />
      <ManualEntry onAdd={handleManual} />
      <ScanList scans={scans} onRemove={removeScan} />
    </div>
  );
}
