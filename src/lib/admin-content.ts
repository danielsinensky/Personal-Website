import {
  SLUG_PATTERN,
  commitFile,
  deleteFile,
  getRepoFile,
  slugify,
} from "@/lib/github-commit";
import { isValidISODate } from "@/lib/dates";
import { MAX_TAGS, MAX_TAG_LENGTH, normalizeTags } from "@/lib/tags";

export type ContentKind = "post" | "project" | "client-work";

type Input = Record<string, unknown>;
type BuildResult =
  | { ok: true; content: string; title: string }
  | { ok: false; error: string };

export interface ApiResult {
  status: number;
  body: Record<string, unknown>;
}

interface ContentType {
  dir: string;
  ext: "mdx" | "json";
  label: string;
  build(input: Input, slug: string, existing: string | null): BuildResult;
}

const fail = (error: string): BuildResult => ({ ok: false, error });

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function splitList(value: unknown): string[] {
  const items = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  return items.map((item) => text(item)).filter(Boolean);
}

function buildPost(input: Input): BuildResult {
  const title = text(input.title);
  const excerpt = text(input.excerpt);
  const date = text(input.date);
  const body = typeof input.body === "string" ? input.body.trim() : "";

  if (!title || !excerpt || !date || !body) {
    return fail("Title, excerpt, date, and body are all required.");
  }
  if (!isValidISODate(date)) return fail("Date must be a valid date.");

  const tags = normalizeTags(input.tags);
  if (tags.length > MAX_TAGS) return fail(`A post can have at most ${MAX_TAGS} tags.`);
  if (tags.some((tag) => tag.length > MAX_TAG_LENGTH)) {
    return fail(`Tags can be at most ${MAX_TAG_LENGTH} characters.`);
  }

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `date: ${JSON.stringify(date)}`,
    `excerpt: ${JSON.stringify(excerpt)}`,
    `tags: ${JSON.stringify(tags)}`,
    "---",
    "",
  ].join("\n");

  return { ok: true, content: `${frontmatter}\n${body}\n`, title };
}

function buildEntry(
  input: Input,
  slug: string,
  existing: string | null,
  withClient: boolean,
): BuildResult {
  const title = text(input.title);
  const client = text(input.client);
  const summary = text(input.summary);
  const description = text(input.description);
  const startDate = text(input.startDate);
  const endDate = text(input.endDate);

  if (!title || !summary || !description || !startDate || (withClient && !client)) {
    return fail(
      withClient
        ? "Title, client, summary, description, and start date are all required."
        : "Title, summary, description, and start date are all required.",
    );
  }
  if (!isValidISODate(startDate)) return fail("Start date must be a valid date.");
  if (endDate && !isValidISODate(endDate)) return fail("End date must be a valid date.");
  if (endDate && endDate < startDate) return fail("End date can't be before the start date.");

  const linkLabel = text(input.linkLabel);
  const linkUrl = text(input.linkUrl);
  if (Boolean(linkLabel) !== Boolean(linkUrl)) {
    return fail("Provide both a link label and a link URL, or neither.");
  }
  if (linkUrl && !/^https?:\/\//i.test(linkUrl)) {
    return fail("Link URL must start with http:// or https://.");
  }

  // The form edits a single link; keep any extra links already in the file.
  let extraLinks: unknown[] = [];
  if (existing) {
    try {
      const links = (JSON.parse(existing) as { links?: unknown }).links;
      if (Array.isArray(links)) extraLinks = links.slice(1);
    } catch {
      // An unreadable existing file is simply overwritten.
    }
  }
  const links = [...(linkUrl ? [{ label: linkLabel, url: linkUrl }] : []), ...extraLinks];

  const entry = {
    slug,
    title,
    ...(withClient ? { client } : {}),
    summary,
    description,
    platforms: splitList(input.platforms),
    tech: splitList(input.tech),
    startDate,
    ...(endDate ? { endDate } : {}),
    ...(links.length > 0 ? { links } : {}),
  };

  return { ok: true, content: `${JSON.stringify(entry, null, 2)}\n`, title };
}

export const CONTENT_TYPES: Record<ContentKind, ContentType> = {
  post: {
    dir: "content/blog",
    ext: "mdx",
    label: "post",
    build: (input) => buildPost(input),
  },
  project: {
    dir: "content/projects",
    ext: "json",
    label: "project",
    build: (input, slug, existing) => buildEntry(input, slug, existing, false),
  },
  "client-work": {
    dir: "content/client-work",
    ext: "json",
    label: "client work entry",
    build: (input, slug, existing) => buildEntry(input, slug, existing, true),
  },
};

const error = (status: number, message: string): ApiResult => ({
  status,
  body: { error: message },
});

function pathFor(kind: ContentKind, slug: string) {
  const { dir, ext } = CONTENT_TYPES[kind];
  return `${dir}/${slug}.${ext}`;
}

// A slug from the client is used to build a repo path, so it must be a plain slug.
function readSlug(input: Input): string | null {
  const slug = text(input.slug);
  return SLUG_PATTERN.test(slug) ? slug : null;
}

export async function createEntry(
  kind: ContentKind,
  input: Input,
  token: string,
): Promise<ApiResult> {
  const type = CONTENT_TYPES[kind];
  const slug = slugify(text(input.title));
  if (!slug) return error(400, "Title produced an empty slug.");

  const built = type.build(input, slug, null);
  if (!built.ok) return error(400, built.error);

  const path = pathFor(kind, slug);
  if (await getRepoFile(path, token)) {
    return error(409, `A ${type.label} already exists at ${path}. Use a different title.`);
  }

  const result = await commitFile({
    path,
    content: built.content,
    message: `Add ${type.label}: ${built.title}`,
    token,
  });
  if (!result.ok) {
    return error(502, `GitHub commit failed (${result.status}): ${result.details}`);
  }
  return { status: 200, body: { slug } };
}

// The slug (and so the file path and URL) stays fixed when the title changes.
export async function updateEntry(
  kind: ContentKind,
  input: Input,
  token: string,
): Promise<ApiResult> {
  const type = CONTENT_TYPES[kind];
  const slug = readSlug(input);
  if (!slug) return error(400, "Invalid slug.");

  const path = pathFor(kind, slug);
  const existing = await getRepoFile(path, token);
  if (!existing) return error(404, `No ${type.label} found at ${path}.`);

  const built = type.build(input, slug, existing.content);
  if (!built.ok) return error(400, built.error);

  const result = await commitFile({
    path,
    content: built.content,
    message: `Update ${type.label}: ${built.title}`,
    token,
    sha: existing.sha,
  });
  if (!result.ok) {
    return error(502, `GitHub commit failed (${result.status}): ${result.details}`);
  }
  return { status: 200, body: { slug } };
}

export async function deleteEntry(
  kind: ContentKind,
  input: Input,
  token: string,
): Promise<ApiResult> {
  const type = CONTENT_TYPES[kind];
  const slug = readSlug(input);
  if (!slug) return error(400, "Invalid slug.");

  const path = pathFor(kind, slug);
  const existing = await getRepoFile(path, token);
  if (!existing) return error(404, `No ${type.label} found at ${path}.`);

  const result = await deleteFile({
    path,
    sha: existing.sha,
    message: `Delete ${type.label}: ${slug}`,
    token,
  });
  if (!result.ok) {
    return error(502, `GitHub delete failed (${result.status}): ${result.details}`);
  }
  return { status: 200, body: { slug } };
}
