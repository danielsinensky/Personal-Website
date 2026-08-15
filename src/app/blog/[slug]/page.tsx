import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Container from "@/components/Container";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return { title: post ? `${post.meta.title} — Daniel Sinensky` : "Blog post" };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <Container className="py-16">
      <article className="max-w-2xl">
        <p className="text-xs text-muted">{post.meta.date}</p>
        <h1 className="mt-1 text-3xl font-semibold">{post.meta.title}</h1>
        <div className="mt-6 text-sm leading-relaxed text-muted [&_p]:mb-4 [&_strong]:text-foreground">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </Container>
  );
}
