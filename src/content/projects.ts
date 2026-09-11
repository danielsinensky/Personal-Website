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
    status: "In Progress",
    links: [
      {
        label: "View on GitHub",
        url: "https://github.com/danielsinensky/threat-log-analyzer",
      },
    ],
  },
  {
    slug: "it-networking-lab",
    title: "IT & Network Infrastructure Lab",
    summary:
      "A VirtualBox home lab on Windows and Ubuntu for practicing enterprise network administration and IT support end-to-end.",
    description:
      "A VirtualBox home lab running Windows 10/11 and Ubuntu VMs, built to practice enterprise network administration and IT support end-to-end. On the infrastructure side: VLAN segmentation, firewall rule configuration, and inter-VLAN routing to simulate production network architecture, plus access control lists, endpoint hardening, and backup integrity verification for simulated NAS storage. On the support side: Tier 1/2 helpdesk troubleshooting (OS installs, driver conflicts, network connectivity), a Microsoft 365 developer tenant configured for account provisioning, conditional access/MFA policies, and SharePoint administration, with the full change and ticket lifecycle documented in a ServiceNow developer instance.",
    platforms: [],
    tech: [
      "VirtualBox",
      "Ubuntu",
      "Windows 10/11",
      "VLANs & Firewalls",
      "Microsoft 365",
      "SharePoint",
      "ServiceNow",
    ],
    status: "In Progress",
  },
  {
    slug: "av-event-systems",
    title: "AV & Hybrid Event Systems",
    summary:
      "Hands-on audio/visual setup and hybrid event production, from a home test environment to running live speaker events.",
    description:
      "A hybrid A/V test environment built with Zoom and OBS to practice multi-source stream routing and audio mixing — the same technical stack used in production hybrid event support. That experience carried directly into producing and running in-person cybersecurity workshops and speaker events as Vice President of ISACA NY Metro Chapter's Yeshiva University student group, handling A/V setup and teardown, projector and display systems, livestream support, and event troubleshooting for 5+ events a semester.",
    platforms: [],
    tech: [
      "Zoom",
      "OBS",
      "Audio Mixing",
      "Livestream Support",
      "Projectors & Display Systems",
    ],
    status: "Complete",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
