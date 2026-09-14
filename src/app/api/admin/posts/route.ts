import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { commitFile, repoFileExists, slugify } from "@/lib/github-commit";

function buildFrontmatter(title: string, date: string, excerpt: string) {
  return [
    "---",
    `title: ${JSON.stringify(title)}`,
    `date: ${JSON.stringify(date)}`,
    `excerpt: ${JSON.stringify(excerpt)}`,
    "---",
    "",
  ].join("\n");
}

export async function POST(request: Request) {
  const session = await auth();
  const allowedUsername = process.env.ADMIN_GITHUB_USERNAME;

  if (!session?.user?.login || session.user.login !== allowedUsername) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const token = process.env.GITHUB_COMMIT_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Server is missing GITHUB_COMMIT_TOKEN." },
      { status: 500 },
    );
  }

  const { title, excerpt, date, body } = await request.json();
  if (
    typeof title !== "string" ||
    typeof excerpt !== "string" ||
    typeof date !== "string" ||
    typeof body !== "string" ||
    !title.trim() ||
    !excerpt.trim() ||
    !date.trim() ||
    !body.trim()
  ) {
    return NextResponse.json(
      { error: "Title, excerpt, date, and body are all required." },
      { status: 400 },
    );
  }

  const slug = slugify(title);
  if (!slug) {
    return NextResponse.json({ error: "Title produced an empty slug." }, { status: 400 });
  }

  const path = `content/blog/${slug}.mdx`;

  if (await repoFileExists(path, token)) {
    return NextResponse.json(
      { error: `A post already exists at ${path}. Use a different title.` },
      { status: 409 },
    );
  }

  const fileContent = buildFrontmatter(title, date, excerpt) + "\n" + body + "\n";

  const result = await commitFile({
    path,
    content: fileContent,
    message: `Add blog post: ${title}`,
    token,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: `GitHub commit failed (${result.status}): ${result.details}` },
      { status: 502 },
    );
  }

  return NextResponse.json({ slug });
}
