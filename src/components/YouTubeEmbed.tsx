import type { Video } from "@/content/videos";

export default function YouTubeEmbed({ video }: { video: Video }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="aspect-video">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <p className="px-4 py-3 text-sm font-medium">{video.title}</p>
    </div>
  );
}
