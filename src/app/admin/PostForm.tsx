"use client";

import { useState, type FormEvent } from "react";
import { todayLocalISO } from "@/lib/dates";
import type { AdminPost } from "@/lib/admin-data";
import DateSelect from "./DateSelect";
import ResultPanel from "./ResultPanel";
import TagInput from "./TagInput";
import { useContentApi } from "./useContentApi";

const UNDERLINE_INPUT =
  "border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground";

// Creates a post, or edits one when `initial` is given.
export default function PostForm({
  initial,
  existingTags,
  onFinished,
}: {
  initial?: AdminPost;
  existingTags: string[];
  onFinished: () => void;
}) {
  const editing = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [date, setDate] = useState(initial?.date ?? todayLocalISO());
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [body, setBody] = useState(initial?.body ?? "");
  const { status, error, result, clearResult, send } = useContentApi("/api/admin/posts");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const saved = await send(
      editing ? "PUT" : "POST",
      { slug: initial?.slug, title, excerpt, date, tags, body },
      editing ? "updated" : "created",
    );
    if (saved && !editing) {
      setTitle("");
      setExcerpt("");
      setTags([]);
      setBody("");
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
    const file = `${result.slug}.mdx`;
    const publicPath = `/blog/${result.slug}`;
    if (result.action === "created") {
      return (
        <ResultPanel
          action="created"
          file={file}
          publicPath={publicPath}
          actions={[{ label: "Write another post", onClick: clearResult }]}
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

      <label className="flex flex-col gap-1.5 text-sm">
        Excerpt
        <input
          type="text"
          required
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          className={UNDERLINE_INPUT}
        />
      </label>

      <DateSelect label="Date" value={date} onChange={setDate} required />

      <TagInput tags={tags} onChange={setTags} suggestions={existingTags} />

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
            Delete post
          </button>
        )}
      </div>
    </form>
  );
}
