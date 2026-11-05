import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import BlogFiltersMobile from "@/components/BlogFiltersMobile";
import BlogFiltersSidebar from "@/components/BlogFiltersSidebar";
import PostTags from "@/components/PostTags";
import { getAllPosts } from "@/lib/blog";
import {
  buildBlogHref,
  filterAndSortPosts,
  getArchive,
  getTagCounts,
  parseBlogQuery,
} from "@/lib/blog-filters";
import { monthYearLabel } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Blog – Daniel Sinensky",
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = parseBlogQuery(await searchParams);
  const allPosts = getAllPosts();
  const posts = filterAndSortPosts(allPosts, query);
  const tags = getTagCounts(allPosts);
  const archive = getArchive(allPosts);
  const filtered = Boolean(query.tag || query.month);

  return (
    <Container className="py-16">
      <h1 className="text-2xl font-medium">Blog</h1>

      <div className="mt-6 md:hidden">
        <BlogFiltersMobile tags={tags} archive={archive} query={query} />
      </div>

      <div className="mt-8 flex gap-12">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-border pb-3 text-xs text-muted">
            <p>
              {posts.length} {posts.length === 1 ? "post" : "posts"}
              {query.tag ? ` tagged ${query.tag}` : ""}
              {query.month ? ` from ${monthYearLabel(query.month)}` : ""}
              {filtered && (
                <>
                  {" "}
                  <Link
                    href={buildBlogHref({ sort: query.sort })}
                    className="text-foreground hover:underline"
                  >
                    Clear filters
                  </Link>
                </>
              )}
            </p>
            <p className="flex gap-3">
              <Link
                href={buildBlogHref({ ...query, sort: "newest" })}
                className={query.sort === "newest" ? "text-foreground underline" : "hover:text-foreground"}
              >
                Newest first
              </Link>
              <Link
                href={buildBlogHref({ ...query, sort: "oldest" })}
                className={query.sort === "oldest" ? "text-foreground underline" : "hover:text-foreground"}
              >
                Oldest first
              </Link>
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="py-8 text-sm text-muted">
              {allPosts.length === 0 ? "No posts yet." : "No posts match these filters."}
            </p>
          ) : (
            <div className="flex flex-col">
              {posts.map((post) => (
                <article key={post.slug} className="border-b border-border py-6">
                  <p className="text-xs text-muted">{post.date}</p>
                  <h2 className="mt-1 text-lg font-medium">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                  <PostTags tags={post.tags} className="mt-3" />
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-8">
            <BlogFiltersSidebar tags={tags} archive={archive} query={query} />
          </div>
        </aside>
      </div>
    </Container>
  );
}
