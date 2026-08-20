"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="shrink-0 border-b border-foreground text-sm hover:opacity-70"
    >
      Print / Save as PDF
    </button>
  );
}
