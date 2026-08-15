import type { Metadata } from "next";
import Container from "@/components/Container";
import { projects } from "@/content/projects";
import { socialLinks } from "@/content/social-links";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "CV — Daniel Sinensky",
};

const SKILLS = [
  "Python",
  "Web Scraping",
  "AWS Lambda",
  "SQLite",
  "AI Agents",
  "APIs",
  "Next.js",
  "Kotlin",
  "Swift",
];

export default function CVPage() {
  return (
    <Container className="py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Daniel Sinensky</h1>
          <p className="mt-1 text-muted">Web and Mobile Design. Secure.</p>
          <p className="mt-2 text-sm text-muted">
            {"danielsinensky@gmail.com"}
            {socialLinks.map(({ name, url }) => (
              <span key={name}>
                {" · "}
                <a href={url} target="_blank" rel="noreferrer" className="hover:text-accent">
                  {name}
                </a>
              </span>
            ))}
          </p>
        </div>
        <PrintButton />
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
          Skills
        </h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded bg-surface px-2 py-0.5 text-xs text-muted"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
          Projects
        </h2>
        <div className="mt-3 flex flex-col gap-6">
          {projects.map((project) => (
            <div key={project.slug}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-semibold">{project.title}</h3>
                <span className="text-xs text-muted">{project.status}</span>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-muted">
                {project.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-surface px-2 py-0.5 text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
