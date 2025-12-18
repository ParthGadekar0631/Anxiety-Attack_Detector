import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { loginUser } from '@/services/auth';
import { http } from '@/services/http';
import type { AuthResponse } from '@/types/api';

async function refreshAccessToken(token: JWT) {
  if (!token.refreshToken) {
    return { ...token, error: 'RefreshAccessTokenMissing' as const };
  }

  try {
    const { data } = await http.post<AuthResponse>('/auth/refresh', { refreshToken: token.refreshToken });
    return {
      ...token,
      accessToken: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken,
      accessTokenExpires: Date.now() + data.tokens.expiresIn,
      role: data.user.role,
      error: undefined,
    };
  } catch (error) {
    console.error('Failed to refresh access token', error);
    return { ...token, error: 'RefreshAccessTokenError' as const };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const response = await loginUser({ email: credentials.email, password: credentials.password });
        return {
          ...response.user,
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken,
          accessTokenExpires: Date.now() + response.tokens.expiresIn,
        } as any;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/sign-in' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpires: (user as any).accessTokenExpires,
          role: user.role,
          sub: user.id,
          error: undefined,
        };
      }

      if (token.accessToken && typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as any) ?? 'patient';
      }
      session.accessToken = token.accessToken as string | undefined;
      if (token.error) {
        session.error = token.error as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
