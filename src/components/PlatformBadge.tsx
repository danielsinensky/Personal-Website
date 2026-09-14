import type { Platform } from "@/lib/projects";

export default function PlatformBadge({ platform }: { platform: Platform }) {
  return <span className="text-xs text-muted">{platform}</span>;
}
