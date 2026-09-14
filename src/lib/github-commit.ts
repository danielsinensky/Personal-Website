const REPO_OWNER = "danielsinensky";
const REPO_NAME = "Personal-Website";
const GITHUB_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function repoFileExists(path: string, token: string) {
  const response = await fetch(`${GITHUB_API}/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  return response.status === 200;
}

export async function commitFile({
  path,
  content,
  message,
  token,
}: {
  path: string;
  content: string;
  message: string;
  token: string;
}): Promise<{ ok: true } | { ok: false; status: number; details: string }> {
  const response = await fetch(`${GITHUB_API}/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch: "main",
    }),
  });

  if (!response.ok) {
    return { ok: false, status: response.status, details: await response.text() };
  }
  return { ok: true };
}
