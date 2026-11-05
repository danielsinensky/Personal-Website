import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { toISODate } from "@/lib/dates";
import { normalizeTags } from "@/lib/tags";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export interface BlogPost {
  meta: BlogPostMeta;
  content: string;
}

export function postMetaFromFrontmatter(
  slug: string,
  data: Record<string, unknown>,
): BlogPostMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    date: toISODate(data.date),
    excerpt: String(data.excerpt ?? ""),
    tags: normalizeTags(data.tags),
  };
}

export function getAllPosts(): BlogPostMeta[] {
  const files = fs.existsSync(BLOG_DIR)
    ? fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"))
    : [];

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"));
      return postMetaFromFrontmatter(slug, data);
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  return { meta: postMetaFromFrontmatter(slug, data), content };
}
