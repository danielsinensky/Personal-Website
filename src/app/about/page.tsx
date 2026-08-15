import type { Metadata } from "next";
import Container from "@/components/Container";
import { socialLinks } from "@/content/social-links";

export const metadata: Metadata = {
  title: "About — Daniel Sinensky",
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-accent-foreground">
          DS
        </div>
        <div>
          <h1 className="text-3xl font-semibold">Daniel Sinensky</h1>
          <p className="mt-1 text-muted">Web and Mobile Design. Secure.</p>
        </div>
      </div>

      <div className="mt-10 max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
        <p>
          I design and build web and mobile products end-to-end — from
          backend services and cloud infrastructure to native iOS and Android
          clients.
        </p>
        <p>
          My current project, Job Application Agent, is an AI agent that
          searches for jobs a user is eligible for and emails them the
          matches. It combines a Python web scraper, AWS Lambda, SQLite, and
          third-party APIs on the backend with Next.js, Kotlin, and Swift
          clients across web, Android, and iOS.
        </p>
        <p>
          This site is where I collect that work — personal projects,
          client projects, and everything else I build or make.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium text-muted">Find me elsewhere</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          {socialLinks.map(({ name, url, Icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:border-accent hover:text-accent"
            >
              <Icon size={16} />
              {name}
            </a>
          ))}
        </div>
      </div>
    </Container>
  );
}
