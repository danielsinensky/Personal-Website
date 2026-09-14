import fs from "fs";
import path from "path";
import type { Platform } from "./projects";

const CLIENT_WORK_DIR = path.join(process.cwd(), "content", "client-work");

export interface ClientWork {
  slug: string;
  client: string;
  title: string;
  summary: string;
  description: string;
  platforms: Platform[];
  tech: string[];
  startDate: string;
  endDate?: string;
  links?: { label: string; url: string }[];
}

export function getAllClientWork(): ClientWork[] {
  const files = fs.existsSync(CLIENT_WORK_DIR)
    ? fs.readdirSync(CLIENT_WORK_DIR).filter((file) => file.endsWith(".json"))
    : [];

  return files
    .map(
      (file) =>
        JSON.parse(fs.readFileSync(path.join(CLIENT_WORK_DIR, file), "utf8")) as ClientWork,
    )
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
}

export function getClientWorkBySlug(slug: string): ClientWork | undefined {
  return getAllClientWork().find((entry) => entry.slug === slug);
}
