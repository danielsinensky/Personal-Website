import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import PlatformBadge from "@/components/PlatformBadge";
import TechTag from "@/components/TechTag";
import { getAllClientWork, getClientWorkBySlug } from "@/lib/client-work";
import { formatDateRange } from "@/lib/dates";

export function generateStaticParams() {
  return getAllClientWork().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getClientWorkBySlug(slug);
  return { title: entry ? `${entry.title} — Daniel Sinensky` : "Client Work" };
}

export default async function ClientWorkEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getClientWorkBySlug(slug);
  if (!entry) notFound();

  return (
    <Container className="py-16">
      <p className="text-xs text-muted">
        {formatDateRange(entry.startDate, entry.endDate)}
      </p>
      <h1 className="mt-1 text-2xl font-medium">{entry.title}</h1>
      <p className="mt-1 text-sm text-muted">Client: {entry.client}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {entry.tech.map((tech) => (
          <TechTag key={tech} tech={tech} />
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
        {entry.description}
      </p>

      {entry.platforms.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm text-muted">Platform</h2>
          <div className="mt-2 flex flex-wrap gap-3">
            {entry.platforms.map((platform) => (
              <PlatformBadge key={platform} platform={platform} />
            ))}
          </div>
        </div>
      )}

      {entry.links && entry.links.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4">
          {entry.links.map((link) => (
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
