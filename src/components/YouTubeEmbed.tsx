import type { Video } from "@/content/videos";

export default function YouTubeEmbed({ video }: { video: Video }) {
  return (
    <div>
      <div className="aspect-video overflow-hidden">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <p className="mt-3 text-sm text-muted">{video.title}</p>
    </div>
  );
}
