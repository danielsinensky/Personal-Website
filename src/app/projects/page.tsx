import type { Metadata } from "next";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects – Daniel Sinensky",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <Container className="py-16">
      <h1 className="text-2xl font-medium">Projects</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Personal projects, including their web, Android, and iOS versions
        where they exist.
      </p>

      <div className="mt-8 flex flex-col">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Container>
  );
}
