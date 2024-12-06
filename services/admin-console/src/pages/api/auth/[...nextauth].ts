import { API_URL } from '@/config'
import axios from 'axios'
import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'
import KeycloakProvider from 'next-auth/providers/keycloak'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID ?? '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
    }),
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID ?? '',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      return session
    },
    async signIn({ user, account, ...passProps }: any) {
      if (account?.access_token) {
        try {
          const response = await axios.post(
            `${API_URL}/auth/login`,
            {
              nickname: passProps?.profile?.nickname,
              name: passProps?.profile?.name,
              picture: passProps?.profile?.picture,
              updated_at: passProps?.profile?.updated_at,
              email: passProps?.profile?.email,
              email_verified: passProps?.profile?.email_verified,
              sub: passProps?.profile?.sub,
              sid: passProps?.profile?.sid,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${account.access_token}`,
              },
            },
          )

          const apiUser: any = response.data
          user = {
            ...user,
            ...apiUser,
          }
          console.log('API call successful. Session user:', user)
          return true
        } catch (error) {
          console.error('Error during sign in:', error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    // signIn: '/api/auth/signin',
    error: '/auth/error',
  },
}
export default NextAuth(authOptions)
