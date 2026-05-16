import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType, type Result } from "@zxing/library";
import type { ScannerStatus } from "@/types/barcode";

interface UseBarcodeScannerOptions {
  onDetected: (value: string, format: string) => boolean; // returns true if accepted (not duplicate/cooldown)
  cooldownMs?: number;
}

interface UseBarcodeScannerReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: ScannerStatus;
  error: string | null;
  lastDetected:
    | {
        value: string;
        format: string;
        accepted: boolean;
        ts: number;
      }
    | null;
  restart: () => void;
}

const FORMATS = [
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.QR_CODE,
];

export function useBarcodeScanner({
  onDetected,
  cooldownMs = 2500,
}: UseBarcodeScannerOptions): UseBarcodeScannerReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const lastByCodeRef = useRef<Map<string, number>>(new Map());
  const onDetectedRef = useRef(onDetected);
  onDetectedRef.current = onDetected;

  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastDetected, setLastDetected] = useState<UseBarcodeScannerReturn["lastDetected"]>(null);
  const [restartKey, setRestartKey] = useState(0);

  const restart = useCallback(() => setRestartKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      setStatus("starting");
      setError(null);

      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, FORMATS);
      hints.set(DecodeHintType.TRY_HARDER, true);

      const reader = new BrowserMultiFormatReader(hints, {
        delayBetweenScanAttempts: 100,
        delayBetweenScanSuccess: 300,
      });
      readerRef.current = reader;

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera API not available in this browser.");
        }

        const constraints: MediaStreamConstraints = {
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const video = videoRef.current;
        if (!video) throw new Error("Video element not ready.");

        const controls = await reader.decodeFromConstraints(
          constraints,
          video,
          (result: Result | undefined) => {
            if (!result) return;
            const value = result.getText();
            const fmtNum = result.getBarcodeFormat?.();
            const formatName =
              typeof fmtNum === "number" ? (BarcodeFormat[fmtNum] ?? "UNKNOWN") : "UNKNOWN";
            const now = Date.now();
            const last = lastByCodeRef.current.get(value) ?? 0;
            if (now - last < cooldownMs) return;
            lastByCodeRef.current.set(value, now);
            const accepted = onDetectedRef.current(value, formatName);
            setLastDetected({ value, format: formatName, accepted, ts: now });
          },
        );

        if (cancelled) {
          controls.stop();
          return;
        }
        controlsRef.current = controls;
        setStatus("scanning");
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Failed to start camera.";
        setError(msg);
        setStatus("error");
      }
    };

    start();

    return () => {
      cancelled = true;
      try {
        controlsRef.current?.stop();
      } catch {
        /* ignore */
      }
      controlsRef.current = null;
      readerRef.current = null;
      const v = videoRef.current;
      if (v && v.srcObject) {
        const stream = v.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        v.srcObject = null;
      }
      setStatus("stopped");
    };
  }, [cooldownMs, restartKey]);

  return { videoRef, status, error, lastDetected, restart };
}
