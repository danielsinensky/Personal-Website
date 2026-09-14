"use client";

import { useState, type FormEvent } from "react";

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

export default function NewClientWorkForm() {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [startDate, setStartDate] = useState(todayISODate);
  const [endDate, setEndDate] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ slug: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const response = await fetch("/api/admin/client-work", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        client,
        summary,
        description,
        tech,
        platforms,
        startDate,
        endDate,
        linkLabel,
        linkUrl,
      }),
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
    setClient("");
    setSummary("");
    setDescription("");
    setTech("");
    setPlatforms("");
    setEndDate("");
    setLinkLabel("");
    setLinkUrl("");
  }

  if (result) {
    return (
      <div className="mt-8 max-w-xl text-sm text-muted">
        <p>
          Client work committed as <code>{result.slug}.json</code>. Vercel is
          redeploying now, and it&apos;ll be live at{" "}
          <code>/client-work/{result.slug}</code> in about a minute.
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-4 border-b border-foreground text-sm text-foreground hover:opacity-70"
        >
          Add another client work entry
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
        Client
        <input
          type="text"
          required
          value={client}
          onChange={(event) => setClient(event.target.value)}
          className="border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Summary
        <input
          type="text"
          required
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className="border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Description
        <textarea
          required
          rows={6}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="border border-border bg-surface px-3 py-2 text-xs outline-none focus:border-foreground"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Tech (comma-separated)
        <input
          type="text"
          value={tech}
          onChange={(event) => setTech(event.target.value)}
          placeholder="Python, SQL, SQLite"
          className="border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Platform: OS or device only, comma-separated (leave blank if none)
        <input
          type="text"
          value={platforms}
          onChange={(event) => setPlatforms(event.target.value)}
          placeholder="Windows 11, Ubuntu"
          className="border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground"
        />
      </label>

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1.5 text-sm">
          Start Date
          <input
            type="date"
            required
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1.5 text-sm">
          End Date (leave blank if ongoing)
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground"
          />
        </label>
      </div>

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1.5 text-sm">
          Link Label (optional)
          <input
            type="text"
            value={linkLabel}
            onChange={(event) => setLinkLabel(event.target.value)}
            placeholder="View live site"
            className="border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1.5 text-sm">
          Link URL (optional)
          <input
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://..."
            className="border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground"
          />
        </label>
      </div>

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
