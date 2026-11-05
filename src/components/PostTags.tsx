import Link from "next/link";
import { buildBlogHref } from "@/lib/blog-filters";

export default function PostTags({
  tags,
  className = "",
}: {
  tags: string[];
  className?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={buildBlogHref({ tag })}
            className="border border-border px-2 py-0.5 text-xs text-muted hover:text-foreground"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
