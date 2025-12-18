import NextAuth from 'next-auth';
import { UserRole } from './api';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
    };
    accessToken?: string;
    error?: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
