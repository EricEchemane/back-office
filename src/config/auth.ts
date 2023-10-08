import { prisma } from '@/prisma';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import hasher from 'bcryptjs';
import GoogleProvider from 'next-auth/providers/google';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
  throw new Error(
    'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars are not set'
  );

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { username: credentials?.username },
          include: {
            role: {
              include: { permissions: true },
            },
          },
        });

        if (
          !user ||
          !credentials ||
          !hasher.compareSync(credentials.password, user.password!)
        )
          return null;

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          permissions: user?.role?.permissions.map(
            (permission) => permission.name
          ),
        };
      },
    }),
  ],
  session: {
    maxAge: 1400,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.permissions = user.permissions;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.permissions = token.permissions;
        session.user.id = +token.sub!;
      }
      return session;
    },
    async signIn({ account, profile, user }) {
      if (account?.provider === 'google' && profile?.email && profile?.name) {
        const u = await prisma.user.upsert({
          where: { email: profile.email },
          update: {
            username: profile.name,
            image: profile.picture,
            password: null,
          },
          create: {
            email: profile.email,
            username: profile.name,
            image: profile.picture,
          },
          include: {
            role: {
              include: { permissions: true },
            },
          },
        });
        user.id = u.id;
        user.permissions = u.role?.permissions.map(
          (permission) => permission.name
        );
        return true;
      }

      return true;
    },
  },
};
