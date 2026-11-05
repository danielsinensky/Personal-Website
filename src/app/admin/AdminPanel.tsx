"use client";

import { useState } from "react";
import type { AdminPost } from "@/lib/admin-data";
import type { ClientWork } from "@/lib/client-work";
import type { Project } from "@/lib/projects";
import EntryForm from "./EntryForm";
import PostForm from "./PostForm";

type Kind = "post" | "project" | "client-work";
type Mode = "new" | "edit";

const KINDS: { kind: Kind; label: string; noun: string }[] = [
  { kind: "post", label: "Post", noun: "post" },
  { kind: "project", label: "Project", noun: "project" },
  { kind: "client-work", label: "Client Work", noun: "client work entry" },
];

function tabClass(active: boolean) {
  return `text-sm ${
    active ? "border-b border-foreground text-foreground" : "text-muted hover:text-foreground"
  }`;
}

export default function AdminPanel({
  posts,
  projects,
  clientWork,
  warnings,
}: {
  posts: AdminPost[];
  projects: Project[];
  clientWork: ClientWork[];
  warnings: string[];
}) {
  const [kind, setKind] = useState<Kind>("post");
  const [mode, setMode] = useState<Mode>("new");
  const [selected, setSelected] = useState("");

  const items: { slug: string; label: string }[] =
    kind === "post"
      ? posts.map((post) => ({ slug: post.slug, label: `${post.title} (${post.date})` }))
      : kind === "project"
        ? projects.map((project) => ({
            slug: project.slug,
            label: `${project.title} (${project.startDate})`,
          }))
        : clientWork.map((entry) => ({
            slug: entry.slug,
            label: `${entry.title} for ${entry.client} (${entry.startDate})`,
          }));

  const noun = KINDS.find((item) => item.kind === kind)!.noun;
  const existingTags = [...new Set(posts.flatMap((post) => post.tags))].sort();
  const current = items.find((item) => item.slug === selected);

  function switchKind(next: Kind) {
    setKind(next);
    setSelected("");
  }

  function renderForm() {
    // The key resets the form whenever the type, mode, or chosen entry changes.
    const key = `${kind}-${mode}-${selected}`;
    const onFinished = () => setSelected("");

    if (kind === "post") {
      const initial = mode === "edit" ? posts.find((post) => post.slug === selected) : undefined;
      if (mode === "edit" && !initial) return null;
      return (
        <PostForm key={key} initial={initial} existingTags={existingTags} onFinished={onFinished} />
      );
    }

    const list = kind === "project" ? projects : clientWork;
    const initial = mode === "edit" ? list.find((entry) => entry.slug === selected) : undefined;
    if (mode === "edit" && !initial) return null;
    return <EntryForm key={key} kind={kind} initial={initial} onFinished={onFinished} />;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-border pb-3">
        {KINDS.map(({ kind: value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => switchKind(value)}
            className={tabClass(kind === value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-5 text-sm">
        <button type="button" onClick={() => setMode("new")} className={tabClass(mode === "new")}>
          New
        </button>
        <button type="button" onClick={() => setMode("edit")} className={tabClass(mode === "edit")}>
          Edit existing
        </button>
      </div>

      {warnings.length > 0 && (
        <p className="mt-4 max-w-xl text-xs text-red-400">{warnings.join(" ")}</p>
      )}

      {mode === "edit" && (
        <div className="mt-6 max-w-xl">
          {items.length === 0 ? (
            <p className="text-sm text-muted">There are no {noun}s to edit yet.</p>
          ) : (
            <label className="flex flex-col gap-1.5 text-sm">
              Choose a {noun} to edit
              <select
                value={current ? selected : ""}
                onChange={(event) => setSelected(event.target.value)}
                className="border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground"
              >
                <option value="" className="bg-background text-foreground">
                  Select…
                </option>
                {items.map((item) => (
                  <option key={item.slug} value={item.slug} className="bg-background text-foreground">
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}

      {renderForm()}
    </div>
  );
}
