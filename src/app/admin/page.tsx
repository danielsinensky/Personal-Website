import type { Metadata } from "next";
import Container from "@/components/Container";
import { auth, signIn, signOut } from "@/auth";
import NewPostForm from "./NewPostForm";

export const metadata: Metadata = {
  title: "Admin — Daniel Sinensky",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Container className="py-16">
        <h1 className="text-2xl font-medium">Admin</h1>
        <p className="mt-2 max-w-md text-sm text-muted">
          Sign in with the site owner&apos;s GitHub account to publish a new
          blog post.
        </p>
        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="border-b border-foreground text-sm hover:opacity-70"
          >
            Sign in with GitHub
          </button>
        </form>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">New Post</h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin" });
          }}
        >
          <button type="submit" className="text-sm text-muted hover:text-foreground">
            Sign out
          </button>
        </form>
      </div>
      <NewPostForm />
    </Container>
  );
}
