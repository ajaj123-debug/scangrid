import logo from "../assets/logo.jpeg";

interface HeaderProps {
  count: number;
  onClear: () => void;
}

export function Header({ count, onClear }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
        <img
          src={logo}
          alt="ScanGrid logo"
          className="h-10 w-auto rounded-md object-contain"
        />
        <div>
          <h1 className="sr-only">Field Scanner</h1>
          <p className="text-xs text-muted-foreground text-right">
            {count} {count === 1 ? "scan" : "scans"} this session
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClear}
        disabled={count === 0}
        className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground whitespace-nowrap active:scale-[0.98] disabled:opacity-40"
      >
        Clear all
      </button>
    </header>
  );
}
