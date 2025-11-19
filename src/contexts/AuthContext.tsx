import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { DEMO_MODE, DEMO_USER } from '@/lib/demoMode'

interface AuthContextType {
	user: User | null
	session: Session | null
	loading: boolean
	signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
	signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
	signInWithGoogle: () => Promise<{ error: AuthError | null }>
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [loading, setLoading] = useState(true)
	const { toast } = useToast()

	useEffect(() => {
		// Demo mode - auto login
		if (DEMO_MODE) {
			console.log('🔐 DEMO MODE: Auto-login with demo user', DEMO_USER)
			setUser(DEMO_USER as User)
			setSession({ user: DEMO_USER } as Session)
			setLoading(false)
			return
		}

		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session)
			setUser(session?.user ?? null)
			setLoading(false)
		})

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
			setUser(session?.user ?? null)
			setLoading(false)
		})

		return () => subscription.unsubscribe()
	}, [])

	const signUp = async (email: string, password: string) => {
		try {
			const { error } = await supabase.auth.signUp({
				email,
				password,
			})

			if (error) {
				toast({
					title: 'Error',
					description: error.message,
					variant: 'destructive',
				})
				return { error }
			}

			toast({
				title: 'Success!',
				description: 'Check your email to confirm your account',
			})

			return { error: null }
		} catch (error) {
			return { error: error as AuthError }
		}
	}

	const signIn = async (email: string, password: string) => {
		// Demo mode - accept demo credentials
		if (DEMO_MODE) {
			if (email === 'demo@popstack.app' && password === 'demo123456') {
				setUser(DEMO_USER as User)
				setSession({ user: DEMO_USER } as Session)
				toast({
					title: 'Welcome to Demo!',
					description: 'You are now exploring PopStack with sample data',
				})
				return { error: null }
			} else {
				toast({
					title: 'Demo Mode',
					description: 'Use demo@popstack.app / demo123456',
					variant: 'destructive',
				})
				return { error: { message: 'Invalid demo credentials' } as AuthError }
			}
		}

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			})

			if (error) {
				toast({
					title: 'Error',
					description: error.message,
					variant: 'destructive',
				})
				return { error }
			}

			toast({
				title: 'Welcome back!',
				description: 'Successfully signed in',
			})

			return { error: null }
		} catch (error) {
			return { error: error as AuthError }
		}
	}

	const signInWithGoogle = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/`,
				},
			})

			if (error) {
				toast({
					title: 'Error',
					description: error.message,
					variant: 'destructive',
				})
				return { error }
			}

			return { error: null }
		} catch (error) {
			return { error: error as AuthError }
		}
	}

	const signOut = async () => {
		await supabase.auth.signOut()
		toast({
			title: 'Signed out',
			description: 'See you soon!',
		})
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				session,
				loading,
				signUp,
				signIn,
				signInWithGoogle,
				signOut,
			}}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
