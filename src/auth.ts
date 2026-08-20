import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import type { GitHubProfile } from "next-auth/providers/github";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ profile }) {
      const allowedUsername = process.env.ADMIN_GITHUB_USERNAME;
      const login = (profile as GitHubProfile | undefined)?.login;
      return Boolean(allowedUsername) && login === allowedUsername;
    },
    async jwt({ token, profile }) {
      const login = (profile as GitHubProfile | undefined)?.login;
      if (login) token.login = login;
      return token;
    },
    async session({ session, token }) {
      if (typeof token.login === "string") session.user.login = token.login;
      return session;
    },
  },
});
