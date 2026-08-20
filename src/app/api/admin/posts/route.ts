import { NextResponse } from "next/server";
import { auth } from "@/auth";

const REPO_OWNER = "danielsinensky";
const REPO_NAME = "Personal-Website";
const GITHUB_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  const existing = await fetch(`${GITHUB_API}/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (existing.status === 200) {
    return NextResponse.json(
      { error: `A post already exists at ${path}. Use a different title.` },
      { status: 409 },
    );
  }

  const fileContent = buildFrontmatter(title, date, excerpt) + "\n" + body + "\n";

  const commitResponse = await fetch(`${GITHUB_API}/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Add blog post: ${title}`,
      content: Buffer.from(fileContent, "utf-8").toString("base64"),
      branch: "main",
    }),
  });

  if (!commitResponse.ok) {
    const details = await commitResponse.text();
    return NextResponse.json(
      { error: `GitHub commit failed (${commitResponse.status}): ${details}` },
      { status: 502 },
    );
  }

  return NextResponse.json({ slug });
}
