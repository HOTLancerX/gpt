import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from './db';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcryptjs';

// Ensure MongoDB connection is working
let adapter;
try {
  adapter = MongoDBAdapter(clientPromise);
} catch (error) {
  console.error('MongoDB Adapter error:', error);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          const client = await clientPromise;
          const db = client.db();
          const user = await db.collection('users').findOne({ 
            email: credentials.email as string
          });

          if (!user) {
            throw new Error('User not found');
          }

          if (!user.password) {
            throw new Error('Invalid password configuration');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string, 
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.photo,
            role: user.type || 'user'
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user && 'role' in user) {
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
});