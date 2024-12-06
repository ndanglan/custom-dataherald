import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'

export const withAuth = (WrappedComponent: FC) => {
  const AuthWrapper: FC = (props) => {
    const router = useRouter()
    const { data: session, status } = useSession()

    useEffect(() => {
      if (status === 'loading') return // Do nothing while loading
      if (!session) void router.push('/api/auth/signin') // If not authenticated, force log in
    }, [session, status, router])

    if (status === 'loading') {
      return <div>Loading...</div>
    }

    return session ? <WrappedComponent {...props} /> : null
  }

  return AuthWrapper
}
