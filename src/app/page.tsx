import Link from "next/link";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import EmailSignupForm from "@/components/EmailSignupForm";
import { projects } from "@/content/projects";
import { getAllPosts } from "@/lib/blog";
import { youtubeChannelUrl } from "@/content/videos";

export default function Home() {
  const latestPost = getAllPosts()[0];

  return (
    <Container className="flex flex-col gap-20 py-16">
      <section>
        <h1 className="text-4xl font-semibold sm:text-5xl">Daniel Sinensky</h1>
        <p className="mt-3 text-lg text-muted">Web and Mobile Design. Secure.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            View Projects
          </Link>
          <Link
            href="/cv"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent"
          >
            View CV
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured Project</h2>
          <Link href="/projects" className="text-sm text-accent hover:underline">
            All projects →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.slice(0, 1).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {latestPost && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">From the Blog</h2>
            <Link href="/blog" className="text-sm text-accent hover:underline">
              All posts →
            </Link>
          </div>
          <Link
            href={`/blog/${latestPost.slug}`}
            className="block rounded-xl border border-border bg-surface p-6 hover:border-accent"
          >
            <p className="text-xs text-muted">{latestPost.date}</p>
            <h3 className="mt-1 text-lg font-semibold">{latestPost.title}</h3>
            <p className="mt-2 text-sm text-muted">{latestPost.excerpt}</p>
          </Link>
        </section>
      )}

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold">Watch on YouTube</h2>
        <p className="mt-2 text-sm text-muted">
          Videos are on their way. In the meantime, subscribe on YouTube to
          catch new uploads.
        </p>
        <a
          href={youtubeChannelUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent"
        >
          Visit the channel →
        </a>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Stay in the loop</h2>
        <p className="mt-2 max-w-md text-sm text-muted">
          Get an email when there&apos;s a new project, post, or product.
        </p>
        <div className="mt-4">
          <EmailSignupForm />
        </div>
      </section>
    </Container>
  );
}
