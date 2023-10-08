import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      image?: string;
      permissions?: string[];
    };
  }
  interface User {
    id: number;
    email: string;
    name: string;
    image?: string;
    permissions?: string[];
  }
  interface Profile {
    email?: string;
    name?: string;
    picture?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    permissions?: string[];
  }
}
