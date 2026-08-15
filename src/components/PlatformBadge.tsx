import type { Platform } from "@/content/projects";

const LABELS: Record<Platform, string> = {
  web: "Web",
  android: "Android",
  ios: "iOS",
};

export default function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted">
      {LABELS[platform]}
    </span>
  );
}
