import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import PlatformBadge from "@/components/PlatformBadge";
import TechTag from "@/components/TechTag";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { formatDateRange } from "@/lib/dates";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project ? `${project.title} – Daniel Sinensky` : "Project" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <Container className="py-16">
      <p className="text-xs text-muted">
        {formatDateRange(project.startDate, project.endDate)}
      </p>
      <h1 className="mt-1 text-2xl font-medium">{project.title}</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <TechTag key={tech} tech={tech} />
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      {project.platforms.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm text-muted">Platform</h2>
          <div className="mt-2 flex flex-wrap gap-3">
            {project.platforms.map((platform) => (
              <PlatformBadge key={platform} platform={platform} />
            ))}
          </div>
        </div>
      )}

      {project.links && project.links.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm hover:underline"
            >
              {link.label} →
            </a>
          ))}
        </div>
      )}
    </Container>
  );
}
