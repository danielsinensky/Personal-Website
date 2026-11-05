export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 30;

export function normalizeTag(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number") return "";
  return String(value).replace(/,/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

export function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  for (const item of value) {
    const tag = normalizeTag(item);
    if (tag) seen.add(tag);
  }
  return [...seen];
}
