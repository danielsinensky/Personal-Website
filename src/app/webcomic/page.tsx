import type { Metadata } from "next";
import Container from "@/components/Container";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Webcomic — Daniel Sinensky",
};

export default function WebcomicPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold">Webcomic</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        A comic, coming soon.
      </p>

      <div className="mt-8">
        <ComingSoon
          title="First pages are in the works"
          description="The webcomic archive will live here once the first chapter is ready."
        />
      </div>
    </Container>
  );
}
