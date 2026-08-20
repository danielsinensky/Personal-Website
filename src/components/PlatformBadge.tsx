import type { Platform } from "@/content/projects";

const LABELS: Record<Platform, string> = {
  web: "Web",
  android: "Android",
  ios: "iOS",
};

export default function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className="border border-border px-2 py-0.5 text-xs text-muted">
      {LABELS[platform]}
    </span>
  );
}
