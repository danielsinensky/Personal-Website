import type { Metadata } from "next";
import Container from "@/components/Container";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { videos, youtubeChannelUrl } from "@/content/videos";

export const metadata: Metadata = {
  title: "Videos — Daniel Sinensky",
};

export default function VideosPage() {
  return (
    <Container className="py-16">
      <h1 className="text-2xl font-medium">Videos</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Videos from my YouTube channel.
      </p>

      {videos.length > 0 ? (
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {videos.map((video) => (
            <YouTubeEmbed key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border-t border-border py-16 text-center">
          <h2 className="text-lg font-medium">No videos embedded yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Videos will show up here as they&apos;re published. In the
            meantime, catch them on YouTube directly.
          </p>
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm hover:underline"
          >
            Visit the channel →
          </a>
        </div>
      )}
    </Container>
  );
}
