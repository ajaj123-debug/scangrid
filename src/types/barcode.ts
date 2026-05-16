export interface ScanEntry {
  id: string;
  value: string;
  format: string;
  timestamp: number;
  source: "camera" | "manual";
}

export type ScannerStatus = "idle" | "starting" | "scanning" | "error" | "stopped";
