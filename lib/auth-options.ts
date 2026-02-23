import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail } from '@/lib/user-service';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@mineperformance.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin';
const MEMBER_EMAIL = process.env.MEMBER_EMAIL ?? 'member@mineperformance.com';
const MEMBER_PASSWORD = process.env.MEMBER_PASSWORD ?? 'member';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        let id: string;
        let role: string;
        if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
          id = 'admin';
          role = 'admin';
        } else if (credentials.email === MEMBER_EMAIL && credentials.password === MEMBER_PASSWORD) {
          id = 'member';
          role = 'user';
        } else {
          return null;
        }
        const stored = getUserByEmail(credentials.email);
        const name = stored?.name ?? (role === 'admin' ? 'Admin' : 'Member');
        const finalRole = stored?.role ?? (role as 'admin' | 'user');
        return { id, email: credentials.email, name, role: finalRole };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role ?? 'user';
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string;
      return session;
    },
  },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};
