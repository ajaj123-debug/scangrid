import { createFileRoute } from "@tanstack/react-router";
import { ScannerApp } from "@/components/ScannerApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScanGrid - Fast Barcode Scanning" },
      {
        name: "description",
        content:
          "Mobile-first continuous barcode scanner for warehouses, job sites, and inventory. Works offline.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <ScannerApp />;
}
