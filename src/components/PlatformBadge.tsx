import type { Platform } from "@/content/projects";

export default function PlatformBadge({ platform }: { platform: Platform }) {
  return <span className="text-xs text-muted">{platform}</span>;
}
