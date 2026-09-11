import type { Platform } from "@/content/projects";

const LABELS: Record<Platform, string> = {
  web: "Web",
  android: "Android",
  ios: "iOS",
  cli: "CLI",
};

export default function PlatformBadge({ platform }: { platform: Platform }) {
  return <span className="text-xs text-muted">{LABELS[platform]}</span>;
}
