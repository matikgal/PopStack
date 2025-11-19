import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, Play } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { DEMO_MODE } from '@/lib/demoMode'

// Demo credentials
const DEMO_EMAIL = 'demo@popstack.app'
const DEMO_PASSWORD = 'demo123456'

const Login = () => {
	const [isSignUp, setIsSignUp] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const { signIn, signUp, signInWithGoogle } = useAuth()
	const { t, language } = useLanguage()
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password)

		setLoading(false)

		if (!error && !isSignUp) {
			navigate('/')
		}
	}

	const handleGoogleSignIn = async () => {
		setLoading(true)
		await signInWithGoogle()
		setLoading(false)
	}

	const handleDemoLogin = () => {
		setEmail(DEMO_EMAIL)
		setPassword(DEMO_PASSWORD)
	}

	return (
		<div className="min-h-screen flex">
			{/* Left Side - Form */}
			<div className="flex-1 flex items-center justify-center p-12">
				<div className="w-full max-w-md space-y-8">
					<div className="space-y-3">
						<h1 className="text-6xl logo-text-large text-primary">{t.appName}</h1>
						<h2 className="text-3xl font-heading font-bold">{isSignUp ? t.createAccount : t.welcomeBackLogin}</h2>
						<p className="text-muted-foreground">{isSignUp ? t.joinUs : t.signInSubtitle}</p>

						{/* Demo Mode Info */}
						{DEMO_MODE && (
							<div className="p-4 bg-yellow-500/10 border-2 border-yellow-500 rounded-sm">
								<p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 text-center">
									{' '}
									{language === 'pl'
										? 'Tryb Demo - Użyj przykładowych danych poniżej'
										: 'Demo Mode - Use sample credentials below'}
								</p>
							</div>
						)}
					</div>

					<form className="space-y-6" onSubmit={handleSubmit}>
						{/* Demo Credentials Button */}
						{!isSignUp && (
							<Button
								type="button"
								variant="outline"
								size="lg"
								className="w-full border-2 border-primary/50 hover:bg-primary/10"
								onClick={handleDemoLogin}>
								<Play size={18} className="mr-2" />
								{language === 'pl' ? ' Wypróbuj Demo (demo@popstack.app)' : ' Try Demo (demo@popstack.app)'}
							</Button>
						)}

						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-semibold">
								{t.email}
							</Label>
							<Input
								id="email"
								type="email"
								placeholder={DEMO_MODE ? DEMO_EMAIL : 'your@email.com'}
								className="h-12 border-2 border-border"
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
								disabled={loading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-semibold">
								{t.password}
								{DEMO_MODE && !isSignUp && (
									<span className="ml-2 text-xs text-muted-foreground font-normal">
										({language === 'pl' ? 'demo: demo123456' : 'demo: demo123456'})
									</span>
								)}
							</Label>
							<Input
								id="password"
								type="password"
								placeholder={DEMO_MODE ? 'demo123456' : '••••••••'}
								className="h-12 border-2 border-border"
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
								minLength={6}
								disabled={loading}
							/>
						</div>

						<Button variant="brutal" size="xl" className="w-full" type="submit" disabled={loading}>
							{loading ? t.loading : isSignUp ? t.signUp : t.signIn}
						</Button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t-2 border-border" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-4 bg-background text-muted-foreground mono">{t.orContinueWith}</span>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4">
							<button
								type="button"
								onClick={handleGoogleSignIn}
								disabled={loading}
								className="w-full h-12 px-6 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border-2 border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
								<svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										fill="#4285F4"
									/>
									<path
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										fill="#34A853"
									/>
									<path
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										fill="#FBBC05"
									/>
									<path
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										fill="#EA4335"
									/>
								</svg>
								<span>{t.continueWithGoogle}</span>
							</button>
						</div>
					</form>

					<p className="text-center text-sm text-muted-foreground">
						{isSignUp ? t.alreadyHaveAccount : t.dontHaveAccount}{' '}
						<button
							type="button"
							onClick={() => setIsSignUp(!isSignUp)}
							className="text-primary font-semibold hover:underline">
							{isSignUp ? t.signIn : t.signUp}
						</button>
					</p>
				</div>
			</div>

			{/* Right Side - Visual */}
			<div className="hidden lg:flex flex-1 relative overflow-hidden border-l-2 border-border">
				<div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-background opacity-90" />
				<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />

				<div className="relative flex items-center justify-center w-full p-12">
					<div className="text-center space-y-6 text-white">
						<h2 className="text-5xl font-heading font-bold leading-tight">
							{t.trackEverything}
							<br />
							{t.youLove}
						</h2>
						<p className="text-xl opacity-90 max-w-md mx-auto">{t.loginHeroText}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login
