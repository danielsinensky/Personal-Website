import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createEntry,
  deleteEntry,
  updateEntry,
  type ApiResult,
  type ContentKind,
} from "@/lib/admin-content";

type Operation = (
  kind: ContentKind,
  input: Record<string, unknown>,
  token: string,
) => Promise<ApiResult>;

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

function handler(kind: ContentKind, operation: Operation) {
  return async function (request: Request) {
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

    const input = await readBody(request);
    if (!input) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    try {
      const result = await operation(kind, input, token);
      return NextResponse.json(result.body, { status: result.status });
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unknown error";
      return NextResponse.json({ error: `GitHub request failed: ${message}` }, { status: 502 });
    }
  };
}

export function contentRoutes(kind: ContentKind) {
  return {
    POST: handler(kind, createEntry),
    PUT: handler(kind, updateEntry),
    DELETE: handler(kind, deleteEntry),
  };
}
