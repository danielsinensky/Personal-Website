import Link from "next/link";
import type { Project } from "@/content/projects";
import PlatformBadge from "@/components/PlatformBadge";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border-b border-border py-6 first:pt-0"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-medium group-hover:underline">
          {project.title}
        </h3>
        <span className="shrink-0 text-xs text-muted">{project.status}</span>
      </div>
      <p className="mt-2 text-sm text-muted">{project.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.platforms.map((platform) => (
          <PlatformBadge key={platform} platform={platform} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        {project.tech.map((tech) => (
          <span key={tech} className="text-xs text-muted">
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}
