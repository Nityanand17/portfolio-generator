import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import "@/lib/types" // Import the extended types

// Get the site URL from environment or use a default for local development
const siteUrl = process.env.NEXTAUTH_URL || 
                process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                "http://localhost:3000";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      authorization: {
        params: {
          // We need the 'repo' scope to create repositories and push code
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after sign in
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: '/portfolio',
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
} 