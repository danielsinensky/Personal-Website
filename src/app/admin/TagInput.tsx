"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { MAX_TAGS, MAX_TAG_LENGTH, normalizeTag } from "@/lib/tags";

export default function TagInput({
  tags,
  onChange,
  suggestions = [],
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState("");
  const listId = useId();
  const atLimit = tags.length >= MAX_TAGS;

  function commit(candidates: string[]) {
    const next = [...tags];
    for (const candidate of candidates) {
      const tag = normalizeTag(candidate).slice(0, MAX_TAG_LENGTH).trim();
      if (tag && !next.includes(tag) && next.length < MAX_TAGS) next.push(tag);
    }
    if (next.length !== tags.length) onChange(next);
  }

  function addDraft() {
    commit([draft]);
    setDraft("");
  }

  // Commas are handled on the value (not the key) so they also work from
  // mobile keyboards and when pasting "a, b, c".
  function handleChange(value: string) {
    if (!value.includes(",")) {
      setDraft(value);
      return;
    }
    const parts = value.split(",");
    const unfinished = parts.pop() ?? "";
    commit(parts);
    setDraft(unfinished);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      // Enter must not submit the surrounding form.
      event.preventDefault();
      addDraft();
    } else if (event.key === "Backspace" && !draft && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <label htmlFor={`${listId}-input`}>Tags</label>
      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-1.5 border border-border px-2 py-0.5 text-xs text-muted"
            >
              {tag}
              <button
                type="button"
                aria-label={`Remove tag ${tag}`}
                onClick={() => onChange(tags.filter((existing) => existing !== tag))}
                className="text-sm leading-none hover:text-foreground"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-3">
        <input
          id={`${listId}-input`}
          type="text"
          list={`${listId}-suggestions`}
          value={draft}
          disabled={atLimit}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addDraft}
          placeholder={atLimit ? `Up to ${MAX_TAGS} tags` : "Type a tag, then press Enter"}
          className="min-w-0 flex-1 border-b border-border bg-transparent px-1 py-1.5 outline-none focus:border-foreground disabled:opacity-50"
        />
        <button
          type="button"
          onClick={addDraft}
          disabled={atLimit || !draft.trim()}
          className="border-b border-foreground text-sm hover:opacity-70 disabled:opacity-40"
        >
          Add
        </button>
      </div>
      <datalist id={`${listId}-suggestions`}>
        {suggestions
          .filter((suggestion) => !tags.includes(suggestion))
          .map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
      </datalist>
    </div>
  );
}
