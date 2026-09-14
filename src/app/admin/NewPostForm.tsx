"use client";

import { useState, type FormEvent } from "react";

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

export default function NewPostForm() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [date, setDate] = useState(todayISODate);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ slug: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const response = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, excerpt, date, body }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus("error");
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setStatus("idle");
    setResult({ slug: data.slug });
    setTitle("");
    setExcerpt("");
    setBody("");
  }

  if (result) {
    return (
      <div className="mt-8 max-w-xl text-sm text-muted">
        <p>
          Post committed as <code>{result.slug}.mdx</code>. Vercel is
          redeploying now, and it&apos;ll be live at{" "}
          <code>/blog/{result.slug}</code> in about a minute.
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-4 border-b border-foreground text-sm text-foreground hover:opacity-70"
        >
          Write another post
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-xl flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm">
        Title
        <input
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Excerpt
        <input
          type="text"
          required
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          className="border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Date
        <input
          type="date"
          required
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Body (Markdown)
        <textarea
          required
          rows={14}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="border border-border bg-surface px-3 py-2 font-mono text-xs outline-none focus:border-foreground"
        />
      </label>

      {status === "error" && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start border-b border-foreground text-sm hover:opacity-70 disabled:opacity-50"
      >
        {status === "submitting" ? "Publishing…" : "Publish"}
      </button>
    </form>
  );
}
