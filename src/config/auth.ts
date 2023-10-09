import { prisma } from '@/prisma';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import hasher from 'bcryptjs';
import GoogleProvider from 'next-auth/providers/google';

if (!process.env.GOOGLE_CLIENT_ID)
  throw new Error('GOOGLE_CLIENT_ID env var is not set');
if (!process.env.GOOGLE_CLIENT_SECRET)
  throw new Error('GOOGLE_CLIENT_SECRET env var is not set');

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
        ) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          image: user.image ?? undefined,
          email: user.email,
          role: user.role?.name,
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
        token.image = user.image;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.permissions = token.permissions;
        session.user.id = +token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
    async signIn({ account, profile, user }) {
      if (account?.provider === 'google' && profile?.email && profile?.name) {
        const u = await prisma.user.upsert({
          where: { email: profile.email },
          update: {
            image: profile.picture,
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
        user.name = u.username;
        user.role = u.role?.name;
        user.permissions = u.role?.permissions.map(
          (permission) => permission.name
        );

        return true;
      }

      return true;
    },
  },
};
