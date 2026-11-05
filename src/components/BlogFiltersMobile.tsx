"use client";

import { useRouter } from "next/navigation";
import {
  buildBlogHref,
  type ArchiveEntry,
  type BlogQuery,
  type TagCount,
} from "@/lib/blog-filters";

const SELECT_CLASS =
  "w-full border-b border-border bg-transparent px-1 py-1.5 text-sm outline-none focus:border-foreground";

// Mobile version: compact dropdowns instead of the sidebar lists.
export default function BlogFiltersMobile({
  tags,
  archive,
  query,
}: {
  tags: TagCount[];
  archive: ArchiveEntry[];
  query: BlogQuery;
}) {
  const router = useRouter();

  if (tags.length === 0 && archive.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <label className="flex flex-col gap-1.5 text-muted">
        Month
        <select
          value={query.month ?? ""}
          onChange={(event) =>
            router.push(buildBlogHref({ ...query, month: event.target.value || undefined }))
          }
          className={SELECT_CLASS}
        >
          <option value="" className="bg-background text-foreground">
            All dates
          </option>
          {archive.map((entry) => (
            <option key={entry.key} value={entry.key} className="bg-background text-foreground">
              {entry.label} ({entry.count})
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-muted">
        Tag
        <select
          value={query.tag ?? ""}
          onChange={(event) =>
            router.push(buildBlogHref({ ...query, tag: event.target.value || undefined }))
          }
          className={SELECT_CLASS}
        >
          <option value="" className="bg-background text-foreground">
            All tags
          </option>
          {tags.map(({ tag, count }) => (
            <option key={tag} value={tag} className="bg-background text-foreground">
              {tag} ({count})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
