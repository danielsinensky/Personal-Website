export type Platform = "web" | "android" | "ios";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;
  platforms: Platform[];
  tech: string[];
  status: string;
  links?: { label: string; url: string }[];
}

export const projects: Project[] = [
  {
    slug: "job-application-agent",
    title: "Job Application Agent",
    summary:
      "An AI agent that finds jobs you're eligible for and delivers them straight to your inbox.",
    description:
      "Job Application Agent automates the tedious part of job hunting. It continuously searches job boards and company career pages, filters listings against your eligibility criteria using an AI agent, and emails you a curated shortlist — so you spend your time applying, not searching.",
    platforms: ["web", "android", "ios"],
    tech: [
      "Python",
      "Web Scraper",
      "AWS Lambda",
      "SQLite",
      "AI Agent",
      "APIs",
      "Next.js",
      "Kotlin",
      "Swift",
    ],
    status: "In development",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
