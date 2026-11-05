const REPO_OWNER = "danielsinensky";
const REPO_NAME = "Personal-Website";
const BRANCH = "main";
const GITHUB_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };
}

export interface RepoFile {
  sha: string;
  content: string;
}

export type CommitResult =
  | { ok: true }
  | { ok: false; status: number; details: string };

// Returns null when the file doesn't exist; throws on any other failure.
export async function getRepoFile(path: string, token: string): Promise<RepoFile | null> {
  const response = await fetch(`${GITHUB_API}/${path}?ref=${BRANCH}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`GitHub read failed (${response.status})`);

  const data = await response.json();
  if (Array.isArray(data) || typeof data.content !== "string") {
    throw new Error(`${path} is not a file`);
  }
  return {
    sha: data.sha as string,
    content: Buffer.from(data.content, "base64").toString("utf-8"),
  };
}

// File names in a directory; an absent directory is an empty list.
export async function listRepoDir(path: string, token: string): Promise<string[]> {
  const response = await fetch(`${GITHUB_API}/${path}?ref=${BRANCH}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`GitHub list failed (${response.status})`);

  const data = await response.json();
  if (!Array.isArray(data)) return [];
  return data
    .filter((entry: { type: string }) => entry.type === "file")
    .map((entry: { name: string }) => entry.name);
}

// Pass `sha` (the current file's sha) to update an existing file.
export async function commitFile({
  path,
  content,
  message,
  token,
  sha,
}: {
  path: string;
  content: string;
  message: string;
  token: string;
  sha?: string;
}): Promise<CommitResult> {
  const response = await fetch(`${GITHUB_API}/${path}`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!response.ok) {
    return { ok: false, status: response.status, details: await response.text() };
  }
  return { ok: true };
}

export async function deleteFile({
  path,
  sha,
  message,
  token,
}: {
  path: string;
  sha: string;
  message: string;
  token: string;
}): Promise<CommitResult> {
  const response = await fetch(`${GITHUB_API}/${path}`, {
    method: "DELETE",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });

  if (!response.ok) {
    return { ok: false, status: response.status, details: await response.text() };
  }
  return { ok: true };
}
