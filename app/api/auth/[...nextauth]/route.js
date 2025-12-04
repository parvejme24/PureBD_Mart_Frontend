import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pure-bd-mart-backend.vercel.app/api";

export const authOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials Provider (Email/Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.data?.success && response.data?.user) {
            // Return user object with token
            return {
              id: response.data.user._id,
              name: response.data.user.name,
              email: response.data.user.email,
              image: response.data.user.image,
              role: response.data.user.role,
              accessToken: response.data.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Login error:", error.response?.data || error.message);
          throw new Error(error.response?.data?.message || "Invalid credentials");
        }
      },
    }),
  ],

  callbacks: {
    // Handle Google sign-in - sync with backend
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Send Google user info to backend for registration/login
          const response = await axios.post(`${API_URL}/auth/google`, {
            name: user.name,
            email: user.email,
            image: user.image,
            googleId: account.providerAccountId,
          });

          if (response.data?.success) {
            // Attach backend data to user object
            user.id = response.data.user._id;
            user.role = response.data.user.role;
            user.accessToken = response.data.token;
            user.image = response.data.user.image || user.image;
            return true;
          }
        } catch (error) {
          console.error("Google sign-in error:", error.response?.data || error.message);
          // Still allow sign-in but with limited backend integration
          return true;
        }
      }
      return true;
    },

    // Add custom data to JWT token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.image = user.image;
      }

      // Handle session update
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.image = session.image || token.image;
      }

      return token;
    },

    // Add custom data to session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

