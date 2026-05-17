# Field Scanner

A mobile-first, offline-friendly continuous barcode scanner for real-world field use (warehouses, job sites, inventory). Built with React + TypeScript + Tailwind, scanning powered by [`@zxing/browser`](https://github.com/zxing-js/browser).

## Features

- Auto-starts the rear (environment) camera on load
- Continuous scanning — no tap required per scan
- Supports **Code 128, Code 39, EAN-13, EAN-8, QR Code**
- Duplicate prevention + per-code cooldown (no flood from holding a barcode in view)
- Manual entry fallback for damaged labels
- Vibration feedback on accepted/duplicate scans (when supported)
- Persists scan history in `localStorage` (survives refresh, fully offline)
- Clean component architecture, fully typed, proper camera cleanup on unmount

## Folder structure

```
src/
  components/
    Header.tsx
    Scanner.tsx
    ScanList.tsx
    ManualEntry.tsx
    ScannerApp.tsx
  hooks/
    useBarcodeScanner.ts
  types/
    barcode.ts
  routes/
    index.tsx        # mounts <ScannerApp />
```

## Setup

```bash
bun install   # or: npm install
bun dev       # or: npm run dev
```


Open the preview URL on your phone. **HTTPS is required** for camera access on mobile browsers — `localhost` works on desktop, but for phone testing use the deployed URL or a tunneling tool (e.g. `ngrok`).

## Mobile usage notes

- **Grant camera permission** when prompted. If denied, reload and re-allow in browser settings.
- **Hold steady, ~10–20 cm** from the barcode. The white reticle marks the active area.
- **Bright sunlight:** tilt slightly to reduce glare; the scanner re-tries continuously.
- **Gloves:** all touch targets are sized ≥ 44px. The Add button and Clear button are large by design.
- **Duplicates:** scanning the same code twice in one session shows a duplicate warning (amber). It is *not* added to the list.
- **Refresh-safe:** scans persist locally; closing the tab does not lose history.
- Add the site to your **home screen** for a full-screen, app-like experience.
