import Link from "next/link";
import {
  buildBlogHref,
  type ArchiveEntry,
  type BlogQuery,
  type TagCount,
} from "@/lib/blog-filters";

function FilterLink({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`flex justify-between gap-3 ${
        active ? "text-foreground underline" : "text-muted hover:text-foreground"
      }`}
    >
      <span>{label}</span>
      <span>{count}</span>
    </Link>
  );
}

// Desktop version: always-visible lists. Clicking an active entry clears it.
export default function BlogFiltersSidebar({
  tags,
  archive,
  query,
}: {
  tags: TagCount[];
  archive: ArchiveEntry[];
  query: BlogQuery;
}) {
  return (
    <nav aria-label="Filter blog posts" className="flex flex-col gap-8 text-sm">
      {archive.length > 0 && (
        <section>
          <h2 className="text-sm text-muted">Archive</h2>
          <ul className="mt-2 flex max-h-72 flex-col gap-1 overflow-y-auto">
            {archive.map((entry) => {
              const active = query.month === entry.key;
              return (
                <li key={entry.key}>
                  <FilterLink
                    href={buildBlogHref({ ...query, month: active ? undefined : entry.key })}
                    active={active}
                    label={entry.label}
                    count={entry.count}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {tags.length > 0 && (
        <section>
          <h2 className="text-sm text-muted">Tags</h2>
          <ul className="mt-2 flex max-h-72 flex-col gap-1 overflow-y-auto">
            {tags.map(({ tag, count }) => {
              const active = query.tag === tag;
              return (
                <li key={tag}>
                  <FilterLink
                    href={buildBlogHref({ ...query, tag: active ? undefined : tag })}
                    active={active}
                    label={tag}
                    count={count}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </nav>
  );
}
