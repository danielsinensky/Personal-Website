"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="shrink-0 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent"
    >
      Print / Save as PDF
    </button>
  );
}
