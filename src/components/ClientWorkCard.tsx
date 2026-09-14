import Link from "next/link";
import type { ClientWork } from "@/lib/client-work";
import { formatDateRange } from "@/lib/dates";
import PlatformBadge from "@/components/PlatformBadge";
import TechTag from "@/components/TechTag";

export default function ClientWorkCard({ entry }: { entry: ClientWork }) {
  return (
    <Link
      href={`/client-work/${entry.slug}`}
      className="group block border-b border-border py-6 first:pt-0"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-medium group-hover:underline">
          {entry.title}
        </h3>
        <span className="shrink-0 text-xs text-muted">
          {formatDateRange(entry.startDate, entry.endDate)}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted">Client: {entry.client}</p>
      <p className="mt-2 text-sm text-muted">{entry.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {entry.tech.map((tech) => (
          <TechTag key={tech} tech={tech} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {entry.platforms.map((platform) => (
          <PlatformBadge key={platform} platform={platform} />
        ))}
      </div>
    </Link>
  );
}
