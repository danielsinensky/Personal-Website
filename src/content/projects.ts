export type Platform = "web" | "android" | "ios" | "cli";

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
    slug: "threat-log-analyzer",
    title: "Threat Intelligence Log Analyzer",
    summary:
      "A Python and SQL tool that detects indicators of compromise in simulated enterprise logs and outputs a severity-ranked threat report.",
    description:
      "Threat Intelligence Log Analyzer generates simulated enterprise authentication and network event logs with attack patterns deliberately injected — brute-force attempts, privilege escalation, lateral movement, and after-hours access. Four SQL detection rules (using GROUP BY, HAVING, and aggregation) run against the log data, persist structured findings to a SQLite database, and produce a severity-ranked threat report covering total findings, severity distribution, top flagged users, and critical alerts.",
    platforms: ["cli"],
    tech: ["Python", "SQL", "SQLite", "Threat Detection", "Log Analysis"],
    status: "Complete",
    links: [
      {
        label: "View on GitHub",
        url: "https://github.com/danielsinensky/threat-log-analyzer",
      },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
