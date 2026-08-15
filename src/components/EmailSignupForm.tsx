"use client";

import { useState, type FormEvent } from "react";

export default function EmailSignupForm({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // No email provider is connected yet — this just acknowledges the signup locally.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className={`text-sm text-muted ${compact ? "" : "max-w-sm"}`}>
        Thanks! The mailing list isn&apos;t live yet, but I&apos;ve noted you
        want in — check back soon.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex gap-2 ${compact ? "" : "max-w-sm"}`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Subscribe
      </button>
    </form>
  );
}
