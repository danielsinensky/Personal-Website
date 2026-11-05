import type { BlogPostMeta } from "@/lib/blog";
import { monthYearLabel } from "@/lib/dates";
import { normalizeTag } from "@/lib/tags";

export type SortOrder = "newest" | "oldest";

export interface BlogQuery {
  tag?: string;
  month?: string; // "YYYY-MM"
  sort: SortOrder;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface ArchiveEntry {
  key: string; // "YYYY-MM"
  label: string; // "August 2026"
  count: number;
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseBlogQuery(
  params: Record<string, string | string[] | undefined>,
): BlogQuery {
  const tag = normalizeTag(firstValue(params.tag));
  const month = firstValue(params.month);
  return {
    tag: tag || undefined,
    month: month && /^\d{4}-(0[1-9]|1[0-2])$/.test(month) ? month : undefined,
    sort: firstValue(params.sort) === "oldest" ? "oldest" : "newest",
  };
}

export function buildBlogHref(query: Partial<BlogQuery>): string {
  const params = new URLSearchParams();
  if (query.tag) params.set("tag", query.tag);
  if (query.month) params.set("month", query.month);
  if (query.sort === "oldest") params.set("sort", "oldest");
  const search = params.toString();
  return search ? `/blog?${search}` : "/blog";
}

export function filterAndSortPosts(
  posts: BlogPostMeta[],
  query: BlogQuery,
): BlogPostMeta[] {
  const direction = query.sort === "oldest" ? 1 : -1;
  return posts
    .filter((post) => !query.tag || post.tags.includes(query.tag))
    .filter((post) => !query.month || post.date.startsWith(query.month))
    .sort(
      (a, b) => direction * a.date.localeCompare(b.date) || a.title.localeCompare(b.title),
    );
}

export function getTagCounts(posts: BlogPostMeta[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// Most recent month first.
export function getArchive(posts: BlogPostMeta[]): ArchiveEntry[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    const key = post.date.slice(0, 7);
    if (/^\d{4}-\d{2}$/.test(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, count]) => ({ key, label: monthYearLabel(key), count }));
}
