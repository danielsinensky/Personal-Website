import type { Metadata } from "next";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects — Daniel Sinensky",
};

export default function ProjectsPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Personal projects, including their web, Android, and iOS versions
        where they exist.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Container>
  );
}
