"use client";

import { useState, type FormEvent } from "react";
import { todayLocalISO } from "@/lib/dates";
import type { ClientWork } from "@/lib/client-work";
import type { Project } from "@/lib/projects";
import DateSelect from "./DateSelect";
import ResultPanel from "./ResultPanel";
import { useContentApi } from "./useContentApi";

const UNDERLINE_INPUT =
  "border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground";

type Kind = "project" | "client-work";

const COPY: Record<Kind, { endpoint: string; publicBase: string; noun: string }> = {
  project: { endpoint: "/api/admin/projects", publicBase: "/projects", noun: "project" },
  "client-work": {
    endpoint: "/api/admin/client-work",
    publicBase: "/client-work",
    noun: "client work entry",
  },
};

// One form for projects and client work (client work adds a client field).
// Creates an entry, or edits one when `initial` is given.
export default function EntryForm({
  kind,
  initial,
  onFinished,
}: {
  kind: Kind;
  initial?: Project | ClientWork;
  onFinished: () => void;
}) {
  const editing = Boolean(initial);
  const { endpoint, publicBase, noun } = COPY[kind];
  const isClientWork = kind === "client-work";

  const [title, setTitle] = useState(initial?.title ?? "");
  const [client, setClient] = useState(initial && "client" in initial ? initial.client : "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tech, setTech] = useState(initial?.tech.join(", ") ?? "");
  const [platforms, setPlatforms] = useState(initial?.platforms.join(", ") ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? todayLocalISO());
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [linkLabel, setLinkLabel] = useState(initial?.links?.[0]?.label ?? "");
  const [linkUrl, setLinkUrl] = useState(initial?.links?.[0]?.url ?? "");
  const { status, error, result, clearResult, send } = useContentApi(endpoint);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = await send(
      editing ? "PUT" : "POST",
      {
        slug: initial?.slug,
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
      },
      editing ? "updated" : "created",
    );
    if (saved && !editing) {
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
  }

  async function handleDelete() {
    if (!initial) return;
    const confirmed = window.confirm(
      `Delete "${initial.title}"? It will be removed from the site after the next deploy.`,
    );
    if (confirmed) await send("DELETE", { slug: initial.slug }, "deleted");
  }

  if (result) {
    const file = `${result.slug}.json`;
    const publicPath = `${publicBase}/${result.slug}`;
    if (result.action === "created") {
      return (
        <ResultPanel
          action="created"
          file={file}
          publicPath={publicPath}
          actions={[{ label: `Add another ${noun}`, onClick: clearResult }]}
        />
      );
    }
    return (
      <ResultPanel
        action={result.action}
        file={file}
        publicPath={publicPath}
        actions={[
          ...(result.action === "updated"
            ? [{ label: "Keep editing", onClick: clearResult }]
            : []),
          { label: "Back to list", onClick: onFinished },
        ]}
      />
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
          className={UNDERLINE_INPUT}
        />
      </label>

      {isClientWork && (
        <label className="flex flex-col gap-1.5 text-sm">
          Client
          <input
            type="text"
            required
            value={client}
            onChange={(event) => setClient(event.target.value)}
            className={UNDERLINE_INPUT}
          />
        </label>
      )}

      <label className="flex flex-col gap-1.5 text-sm">
        Summary
        <input
          type="text"
          required
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className={UNDERLINE_INPUT}
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
          className={UNDERLINE_INPUT}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        Platform: OS or device only, comma-separated (leave blank if none)
        <input
          type="text"
          value={platforms}
          onChange={(event) => setPlatforms(event.target.value)}
          placeholder="Windows 11, Ubuntu"
          className={UNDERLINE_INPUT}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <DateSelect label="Start date" value={startDate} onChange={setStartDate} required />
        <DateSelect label="End date (leave blank if ongoing)" value={endDate} onChange={setEndDate} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          Link label (optional)
          <input
            type="text"
            value={linkLabel}
            onChange={(event) => setLinkLabel(event.target.value)}
            placeholder="View on GitHub"
            className={UNDERLINE_INPUT}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Link URL (optional)
          <input
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://..."
            className={UNDERLINE_INPUT}
          />
        </label>
      </div>

      {status === "error" && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="border-b border-foreground text-sm hover:opacity-70 disabled:opacity-50"
        >
          {status === "submitting"
            ? "Saving…"
            : editing
              ? "Save changes"
              : "Publish"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={status === "submitting"}
            className="text-sm text-red-400 hover:opacity-70 disabled:opacity-50"
          >
            Delete {noun}
          </button>
        )}
      </div>
    </form>
  );
}
