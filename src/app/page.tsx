import Link from "next/link";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import EmailSignupForm from "@/components/EmailSignupForm";
import { getAllProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/blog";
import { youtubeChannelUrl } from "@/content/videos";

export default function Home() {
  const latestPost = getAllPosts()[0];
  const projects = getAllProjects();

  return (
    <Container className="flex flex-col gap-20 py-16">
      <section>
        <h1 className="text-3xl font-medium">Daniel Sinensky</h1>
        <p className="mt-4 max-w-xl text-muted">
          A cybersecurity professional with hands-on GRC, risk, and
          incident-response experience, plus an outreach track record
          that&apos;s booked CISOs as speakers and built a 100+ client
          business from scratch. I also build the security tooling and
          software behind that work. Below is what I&apos;m currently
          building, recent writing, and where else to find me.
        </p>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm text-muted">Featured Project</h2>
          <Link href="/projects" className="text-sm hover:underline">
            All projects →
          </Link>
        </div>
        <div className="flex flex-col">
          {projects.slice(0, 1).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {latestPost && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm text-muted">From the Blog</h2>
            <Link href="/blog" className="text-sm hover:underline">
              All posts →
            </Link>
          </div>
          <Link
            href={`/blog/${latestPost.slug}`}
            className="block border-b border-border py-6 first:pt-0 hover:underline"
          >
            <p className="text-xs text-muted">{latestPost.date}</p>
            <h3 className="mt-1 text-lg font-medium">{latestPost.title}</h3>
            <p className="mt-2 text-sm text-muted">{latestPost.excerpt}</p>
          </Link>
        </section>
      )}

      <section className="border-t border-border pt-8">
        <h2 className="text-sm text-muted">Watch on YouTube</h2>
        <p className="mt-2 text-sm text-muted">
          Videos are on their way. In the meantime, subscribe on YouTube to
          catch new uploads.
        </p>
        <a
          href={youtubeChannelUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-sm hover:underline"
        >
          Visit the channel →
        </a>
      </section>

      <section>
        <h2 className="text-sm text-muted">Stay in the loop</h2>
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
