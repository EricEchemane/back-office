import { prisma } from '@/prisma';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import hasher from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
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
          !hasher.compareSync(credentials.password, user.password)
        )
          return null;

        return {
          id: user.id.toString(),
          name: user.username,
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
      token.permissions = user?.permissions;
      return token;
    },
  },
};
