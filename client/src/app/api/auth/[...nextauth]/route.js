import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from '@/utils/api';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        id: { label: '아이디', type: 'text' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const user = await authApi.login(
            credentials.id,
            credentials.password,
          );
          return user;
        } catch (error) {
          throw new Error(
            error.message || '로그인 처리 중 오류가 발생했습니다.',
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.nickname = user.nickname;
        token.blogTitle = user.blogTitle;
        token.blogInfo = user.blogInfo;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          userId: token.userId,
          nickname: token.nickname,
          blogTitle: token.blogTitle,
          blogInfo: token.blogInfo,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
