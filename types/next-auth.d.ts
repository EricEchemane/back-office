import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      permissions?: string[];
      name: string;
      id: number;
    };
  }
  interface User {
    permissions?: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    permissions?: string[];
  }
}
