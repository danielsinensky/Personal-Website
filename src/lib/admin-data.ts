import matter from "gray-matter";
import { getRepoFile, listRepoDir } from "@/lib/github-commit";
import { postMetaFromFrontmatter, type BlogPostMeta } from "@/lib/blog";
import type { Project } from "@/lib/projects";
import type { ClientWork } from "@/lib/client-work";

export type AdminPost = BlogPostMeta & { body: string };

export interface AdminContent {
  posts: AdminPost[];
  projects: Project[];
  clientWork: ClientWork[];
  warnings: string[];
}

async function readAll<T>(
  dir: string,
  ext: string,
  token: string,
  parse: (slug: string, raw: string) => T,
  warnings: string[],
): Promise<T[]> {
  const names = (await listRepoDir(dir, token)).filter((name) => name.endsWith(`.${ext}`));
  const results = await Promise.all(
    names.map(async (name) => {
      const slug = name.slice(0, -(ext.length + 1));
      try {
        const file = await getRepoFile(`${dir}/${name}`, token);
        return file ? parse(slug, file.content) : null;
      } catch {
        warnings.push(`Couldn't read ${dir}/${name}.`);
        return null;
      }
    }),
  );
  return results.filter((item): item is Awaited<T> => item !== null) as T[];
}

// Reads straight from GitHub so edits always start from the latest committed
// version, even before the site has finished redeploying.
export async function loadAdminContent(token: string): Promise<AdminContent> {
  const warnings: string[] = [];

  const [posts, projects, clientWork] = await Promise.all([
    readAll<AdminPost>("content/blog", "mdx", token, (slug, raw) => {
      const { data, content } = matter(raw);
      return { ...postMetaFromFrontmatter(slug, data), body: content.trim() };
    }, warnings),
    readAll<Project>("content/projects", "json", token, (slug, raw) => ({
      ...(JSON.parse(raw) as Project),
      slug,
    }), warnings),
    readAll<ClientWork>("content/client-work", "json", token, (slug, raw) => ({
      ...(JSON.parse(raw) as ClientWork),
      slug,
    }), warnings),
  ]);

  return {
    posts: posts.sort((a, b) => b.date.localeCompare(a.date)),
    projects: projects.sort((a, b) => b.startDate.localeCompare(a.startDate)),
    clientWork: clientWork.sort((a, b) => b.startDate.localeCompare(a.startDate)),
    warnings,
  };
}
