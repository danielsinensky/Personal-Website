import type { Metadata } from "next";
import Container from "@/components/Container";
import ComingSoon from "@/components/ComingSoon";
import ClientWorkCard from "@/components/ClientWorkCard";
import { getAllClientWork } from "@/lib/client-work";

export const metadata: Metadata = {
  title: "Client Work – Daniel Sinensky",
};

export default function ClientWorkPage() {
  const clientWork = getAllClientWork();

  return (
    <Container className="py-16">
      <h1 className="text-2xl font-medium">Client Work</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        A selection of projects built for business clients.
      </p>

      <div className="mt-8">
        {clientWork.length > 0 ? (
          <div className="flex flex-col">
            {clientWork.map((entry) => (
              <ClientWorkCard key={entry.slug} entry={entry} />
            ))}
          </div>
        ) : (
          <ComingSoon
            title="Case studies coming soon"
            description="Client project write-ups are on the way. Check back soon."
          />
        )}
      </div>
    </Container>
  );
}
