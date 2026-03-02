import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            // Since it's an "Internal" app, Google handles the org restriction,
            // but we add an extra layer of safety here.
            if (user.email?.endsWith("@spoton.com")) {
                return true;
            }
            return false;
        },
        async session({ session }) {
            if (session.user?.email) {
                const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
                session.user.isAdmin = adminEmails.includes(session.user.email);
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});

declare module "next-auth" {
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            isAdmin?: boolean;
        }
    }
}

export { handler as GET, handler as POST };
