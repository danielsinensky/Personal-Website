import type { Metadata } from "next";
import Container from "@/components/Container";
import { projects } from "@/content/projects";
import { socialLinks } from "@/content/social-links";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "CV — Daniel Sinensky",
};

const SKILLS = [
  "CompTIA Security+",
  "ISC2 Certified in Cybersecurity",
  "CSA CCSK",
  "SOC Analysis",
  "Network Security",
  "Python",
  "SQL",
  "SQLite",
  "Next.js",
  "TypeScript",
];

export default function CVPage() {
  return (
    <Container className="py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Daniel Sinensky</h1>
          <p className="mt-1 text-muted">Web and Mobile Design. Secure.</p>
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
        <p className="mt-3 text-sm leading-relaxed">{SKILLS.join(" / ")}</p>
      </section>

      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-sm text-muted">Projects</h2>
        <div className="mt-3 flex flex-col">
          {projects.map((project) => (
            <div key={project.slug} className="border-b border-border py-6 first:pt-0">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-medium">{project.title}</h3>
                <span className="text-xs text-muted">{project.status}</span>
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
    </Container>
  );
}
