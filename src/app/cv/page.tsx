import type { Metadata } from "next";
import Container from "@/components/Container";
import { getAllProjects } from "@/lib/projects";
import { getAllClientWork } from "@/lib/client-work";
import { formatDateRange } from "@/lib/dates";
import { socialLinks } from "@/content/social-links";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "CV – Daniel Sinensky",
};

const CERTIFICATIONS = [
  "CompTIA Security+",
  "ISC2 Certified in Cybersecurity",
  "CSA CCSK",
];

const CYBERSECURITY_SKILLS = [
  "SOC Analysis",
  "Network Security",
  "Incident Response",
  "IAM",
  "Risk Analysis",
  "GRC (NIST, SOC 2, ISO 27001, HIPAA)",
  "Splunk Log Analysis",
  "Threat Detection",
];

const IT_SYSTEMS_SKILLS = [
  "VirtualBox",
  "VLANs & Firewalls",
  "Microsoft 365",
  "SharePoint",
  "ServiceNow",
];

const AV_EVENT_SKILLS = [
  "Zoom",
  "OBS",
  "Audio Mixing",
  "Livestream Support",
  "Projectors & Display Systems",
];

const SOFTWARE_ENGINEERING_SKILLS = [
  "Python",
  "SQL",
  "SQLite",
  "Next.js",
  "TypeScript",
];

export default function CVPage() {
  const projects = getAllProjects();
  const clientWork = getAllClientWork();

  return (
    <Container className="py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Daniel Sinensky</h1>
          <p className="mt-1 text-muted">
            Cybersecurity Professional. Hands-On Builder.
          </p>
          <p className="mt-2 text-sm text-muted">
            {"danielsinensky@danielsinensky.com"}
            {socialLinks.map(({ name, url }) => (
              <span key={name}>
                {" · "}
                <a href={url} target="_blank" rel="noreferrer" className="hover:text-foreground">
                  {name}
                </a>
              </span>
            ))}
          </p>
        </div>
        <PrintButton />
      </div>

      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-sm text-muted">Skills</h2>
        <p className="mt-3 text-sm leading-relaxed">
          Certifications: {CERTIFICATIONS.join(" / ")}
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Cybersecurity: {CYBERSECURITY_SKILLS.join(" / ")}
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          IT & Systems: {IT_SYSTEMS_SKILLS.join(" / ")}
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          AV & Event Production: {AV_EVENT_SKILLS.join(" / ")}
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          Software Engineering: {SOFTWARE_ENGINEERING_SKILLS.join(" / ")}
        </p>
      </section>

      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-sm text-muted">Projects</h2>
        <div className="mt-3 flex flex-col">
          {projects.map((project) => (
            <div key={project.slug} className="border-b border-border py-6 first:pt-0">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-medium">{project.title}</h3>
                <span className="text-xs text-muted">
                  {formatDateRange(project.startDate, project.endDate)}
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-muted">
                {project.description}
              </p>
              <p className="mt-2 text-xs text-muted">
                {project.tech.join(" / ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {clientWork.length > 0 && (
        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-sm text-muted">Client Work</h2>
          <div className="mt-3 flex flex-col">
            {clientWork.map((entry) => (
              <div key={entry.slug} className="border-b border-border py-6 first:pt-0">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-medium">
                    {entry.title} for {entry.client}
                  </h3>
                  <span className="text-xs text-muted">
                    {formatDateRange(entry.startDate, entry.endDate)}
                  </span>
                </div>
                <p className="mt-1 max-w-2xl text-sm text-muted">
                  {entry.description}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {entry.tech.join(" / ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
