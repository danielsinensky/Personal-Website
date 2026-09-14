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
        want in. Check back soon.
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
        className="min-w-0 flex-1 border-b border-border bg-transparent px-1 py-1.5 text-sm outline-none focus:border-foreground"
      />
      <button
        type="submit"
        className="shrink-0 border-b border-foreground px-1 py-1.5 text-sm hover:opacity-70"
      >
        Subscribe
      </button>
    </form>
  );
}
