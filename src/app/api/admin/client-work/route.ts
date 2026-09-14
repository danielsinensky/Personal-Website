import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { commitFile, repoFileExists, slugify } from "@/lib/github-commit";
import type { ClientWork } from "@/lib/client-work";

function splitList(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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

  const body = await request.json();
  const {
    title,
    client,
    summary,
    description,
    tech,
    platforms,
    startDate,
    endDate,
    linkLabel,
    linkUrl,
  } = body;

  if (
    typeof title !== "string" ||
    typeof client !== "string" ||
    typeof summary !== "string" ||
    typeof description !== "string" ||
    typeof startDate !== "string" ||
    !title.trim() ||
    !client.trim() ||
    !summary.trim() ||
    !description.trim() ||
    !startDate.trim()
  ) {
    return NextResponse.json(
      {
        error:
          "Title, client, summary, description, and start date are all required.",
      },
      { status: 400 },
    );
  }

  const slug = slugify(title);
  if (!slug) {
    return NextResponse.json({ error: "Title produced an empty slug." }, { status: 400 });
  }

  const path = `content/client-work/${slug}.json`;

  if (await repoFileExists(path, token)) {
    return NextResponse.json(
      { error: `A client work entry already exists at ${path}. Use a different title.` },
      { status: 409 },
    );
  }

  const entry: ClientWork = {
    slug,
    title,
    client,
    summary,
    description,
    platforms: splitList(platforms),
    tech: splitList(tech),
    startDate,
    ...(typeof endDate === "string" && endDate.trim() ? { endDate } : {}),
    ...(typeof linkLabel === "string" &&
    linkLabel.trim() &&
    typeof linkUrl === "string" &&
    linkUrl.trim()
      ? { links: [{ label: linkLabel, url: linkUrl }] }
      : {}),
  };

  const result = await commitFile({
    path,
    content: JSON.stringify(entry, null, 2) + "\n",
    message: `Add client work: ${title}`,
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
