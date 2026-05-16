import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import type { ScanEntry } from "@/types/barcode";

interface ScannerProps {
  onScan: (value: string, format: string, source: ScanEntry["source"]) => boolean;
}

export function Scanner({ onScan }: ScannerProps) {
  const { videoRef, status, error, lastDetected, restart } = useBarcodeScanner({
    onDetected: (value, format) => onScan(value, format, "camera"),
  });

  const isRecentDetection = lastDetected && Date.now() - lastDetected.ts < 1500;
  const outlineShape =
    isRecentDetection &&
    (lastDetected.format === "QR_CODE" || lastDetected.format === "DATA_MATRIX")
      ? "square"
      : "rectangle";

  const statusColor =
    status === "scanning"
      ? "bg-green-500"
      : status === "starting"
        ? "bg-yellow-500"
        : status === "error"
          ? "bg-red-500"
          : "bg-muted-foreground";

  const statusLabel =
    status === "scanning"
      ? "Scanning"
      : status === "starting"
        ? "Starting camera…"
        : status === "error"
          ? "Camera error"
          : status === "stopped"
            ? "Stopped"
            : "Idle";

  return (
    <div className="relative w-full overflow-hidden bg-black">
      <div className="relative aspect-[3/4] w-full sm:aspect-video">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
          autoPlay
        />
        {/* Adaptive outline */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={`relative rounded-[1.5rem] border-2 border-white/80 bg-white/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.24)] ${
              outlineShape === "square"
                ? "h-44 w-44 sm:h-52 sm:w-52"
                : "h-28 w-[76%] sm:h-32 sm:w-[66%]"
            }`}
          >
            <div className="absolute inset-0 rounded-[1.5rem] border border-white/30" />
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
          <span className={`h-2 w-2 rounded-full ${statusColor} ${status === "scanning" ? "animate-pulse" : ""}`} />
          {statusLabel}
        </div>

        {/* Last detected toast */}
        {lastDetected && Date.now() - lastDetected.ts < 1500 && (
          <div
            className={`absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-lg ${
              lastDetected.accepted ? "bg-green-600" : "bg-amber-600"
            }`}
          >
            {lastDetected.accepted ? "✓ " : "⚠ Duplicate: "}
            <span className="font-mono">{lastDetected.value.slice(0, 24)}</span>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-x-3 bottom-3 rounded-md bg-red-600/95 p-3 text-sm text-white">
            <div className="font-semibold">Camera unavailable</div>
            <div className="mt-1 text-xs opacity-90">{error}</div>
            <button
              type="button"
              onClick={restart}
              className="mt-2 rounded bg-white/20 px-3 py-1.5 text-xs font-medium"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
