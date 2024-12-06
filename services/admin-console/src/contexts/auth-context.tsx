import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, {
  ComponentType,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

interface AuthProviderProps {
  children: ReactNode
}

type WithAuthUser = (
  Component: ComponentType<AuthProviderProps>,
) => React.FC<AuthProviderProps>

const withAuthUser: WithAuthUser = (Component) => {
  return function WithAuthUser(props: AuthProviderProps): JSX.Element {
    return <Component {...props} />
  }
}

interface AuthContextType {
  token: string | null
  fetchToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: FC<AuthProviderProps> = withAuthUser(
  ({ children }) => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [token, setToken] = useState<string | null>(null)

    const fetchToken = useCallback(async () => {
      if ((session as any)?.accessToken) {
        setToken((session as any).accessToken as string)
      } else {
        try {
          const response = await fetch('/api/auth/session')
          const data = await response.json()
          if (data.accessToken) {
            setToken(data.accessToken)
          } else {
            throw new Error('No access token found')
          }
        } catch (error) {
          console.error(`Fetching token failed, redirecting to login: ${error}`)
          await signOut({ redirect: false })
          router.push('/api/auth/signin')
        }
      }
    }, [session, router])

    useEffect(() => {
      if (status === 'authenticated') {
        fetchToken()
      }
    }, [fetchToken, status])

    return (
      <AuthContext.Provider value={{ token, fetchToken }}>
        {children}
      </AuthContext.Provider>
    )
  },
)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
