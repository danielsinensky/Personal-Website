import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Daniel Sinensky",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold">Blog</h1>

      <div className="mt-8 flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl border border-border bg-surface p-6 hover:border-accent"
          >
            <p className="text-xs text-muted">{post.date}</p>
            <h2 className="mt-1 text-lg font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
