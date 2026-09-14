import fs from "fs";
import path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type Platform = string;

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;
  platforms: Platform[];
  tech: string[];
  startDate: string;
  endDate?: string;
  links?: { label: string; url: string }[];
}

export function getAllProjects(): Project[] {
  const files = fs.existsSync(PROJECTS_DIR)
    ? fs.readdirSync(PROJECTS_DIR).filter((file) => file.endsWith(".json"))
    : [];

  return files
    .map((file) => JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8")) as Project)
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug);
}
