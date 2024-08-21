import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';

async function fetchUsers() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/register`, {
      method: 'GET',
    });
    const users = await res.json();
    return users;
  }
  

  export const authOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'text' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials: any) {
        const users = await fetchUsers();
          const user = users.find(
            (user: { id: string; email: string; password: string }) =>
              user.email === credentials.email &&
              user.password === credentials.password
          );
  
          if (user) {
            return { id: String(user.id), email: user.email };
          } else {
            return null;
          }
        },
      }),
    ],
    pages: {
      signIn: '/auth/signin',
      error: '/'
    },
    callbacks: {
      async session({ session, token }: any) {
        if (token?.sub) {
          session.user.id = token.sub;
        }
        return session;
      },
      async jwt({ token, user }: any) {
        if (user) {
          token.sub = user.id;
        }
        return token;
      },
    },
  };
  
  const handler = NextAuth(authOptions);
  export { handler as GET, handler as POST };