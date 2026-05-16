import type { ScanEntry } from "@/types/barcode";
import emptyIllustration from "@/assets/scanner-empty.png";

interface ScanListProps {
  scans: ScanEntry[];
  onRemove: (id: string) => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function ScanList({ scans, onRemove }: ScanListProps) {
  if (scans.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <img
          src={emptyIllustration}
          alt=""
          width={128}
          height={128}
          loading="lazy"
          className="mb-4 h-32 w-32 opacity-80"
        />
        <h2 className="text-base font-semibold text-foreground">No scans yet</h2>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Point the camera at a barcode or use manual entry. Scans appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex-1 divide-y divide-border overflow-y-auto">
      {scans.map((s) => (
        <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="truncate font-mono text-sm font-semibold text-foreground">
              {s.value}
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{s.format}</span>
              <span>•</span>
              <span>{formatTime(s.timestamp)}</span>
              {s.source === "manual" && (
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase text-secondary-foreground">
                  Manual
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(s.id)}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground active:scale-[0.98]"
            aria-label="Remove scan"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
