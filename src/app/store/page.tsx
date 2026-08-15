import type { Metadata } from "next";
import Container from "@/components/Container";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Store — Daniel Sinensky",
};

export default function StorePage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold">Store</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Digital and physical products, coming soon.
      </p>

      <div className="mt-8">
        <ComingSoon
          title="The store isn't open yet"
          description="This section will be powered by Shopify once it's set up. Check back soon."
        />
      </div>
    </Container>
  );
}
