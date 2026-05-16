import { useState } from "react";

interface ManualEntryProps {
  onAdd: (value: string) => boolean;
}

export function ManualEntry({ onAdd }: ManualEntryProps) {
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<{ type: "ok" | "dup"; msg: string } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const accepted = onAdd(trimmed);
    setFeedback(
      accepted
        ? { type: "ok", msg: `Added "${trimmed}"` }
        : { type: "dup", msg: `"${trimmed}" already scanned` },
    );
    if (accepted) setValue("");
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <form onSubmit={submit} className="border-b border-border bg-card p-4">
      <label htmlFor="manual" className="mb-2 block text-sm font-medium text-foreground">
        Manual entry
      </label>
      <div className="flex gap-2">
        <input
          id="manual"
          type="text"
          inputMode="text"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type or paste barcode"
          className="h-12 flex-1 rounded-md border border-input bg-background px-3 font-mono text-base text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="h-12 rounded-md bg-primary px-5 text-base font-semibold text-primary-foreground active:scale-[0.98] disabled:opacity-40"
        >
          Add
        </button>
      </div>
      {feedback && (
        <p
          className={`mt-2 text-sm ${
            feedback.type === "ok" ? "text-green-600" : "text-amber-600"
          }`}
        >
          {feedback.msg}
        </p>
      )}
    </form>
  );
}
