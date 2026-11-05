import type { Metadata } from "next";
import Container from "@/components/Container";
import { auth, signIn, signOut } from "@/auth";
import { loadAdminContent, type AdminContent } from "@/lib/admin-data";
import AdminPanel from "./AdminPanel";

export const metadata: Metadata = {
  title: "Admin – Daniel Sinensky",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Container className="py-16">
        <h1 className="text-2xl font-medium">Admin</h1>
        <p className="mt-2 max-w-md text-sm text-muted">
          Sign in with the site owner&apos;s GitHub account to publish a new
          blog post, project, or client work entry, or to edit or delete one.
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

  const content: AdminContent = { posts: [], projects: [], clientWork: [], warnings: [] };
  const token = process.env.GITHUB_COMMIT_TOKEN;
  if (!token) {
    content.warnings.push("GITHUB_COMMIT_TOKEN isn't set, so existing entries can't be loaded.");
  } else {
    try {
      Object.assign(content, await loadAdminContent(token));
    } catch (caught) {
      const reason = caught instanceof Error ? caught.message : "unknown error";
      content.warnings.push(`Couldn't load existing entries (${reason}).`);
    }
  }

  return (
    <Container className="py-16">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">Admin</h1>
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
      <div className="mt-8">
        <AdminPanel
          posts={content.posts}
          projects={content.projects}
          clientWork={content.clientWork}
          warnings={content.warnings}
        />
      </div>
    </Container>
  );
}
