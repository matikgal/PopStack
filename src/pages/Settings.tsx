import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/hooks/useTheme'
import { Settings as SettingsIcon, Globe, Palette, User, LogOut, Edit2, Save } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

const Settings = () => {
	const { user, signOut } = useAuth()
	const { language, setLanguage } = useLanguage()
	const { theme, setTheme } = useTheme()
	const { toast } = useToast()

	const [profileUsername, setProfileUsername] = useState<string>('')
	const [isEditingUsername, setIsEditingUsername] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	// Fetch username from profiles table
	useEffect(() => {
		const fetchProfile = async () => {
			if (!user?.id) return

			const { data, error } = await supabase
				.from('profiles')
				.select('username')
				.eq('id', user.id)
				.single<Pick<Profile, 'username'>>()

			if (!error && data && data.username) {
				setProfileUsername(data.username)
			}
		}

		fetchProfile()
	}, [user?.id])

	const displayName =
		profileUsername ||
		user?.user_metadata?.full_name ||
		user?.user_metadata?.name ||
		user?.email?.split('@')[0] ||
		'User'
	const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture
	const userEmail = user?.email || ''

	const handleSaveUsername = async () => {
		if (!user?.id || !profileUsername.trim()) return

		setIsSaving(true)
		try {
			const profileData = {
				id: user.id,
				username: profileUsername.trim(),
				updated_at: new Date().toISOString(),
			}

			// @ts-expect-error - Supabase types issue
			const { error } = await supabase.from('profiles').upsert(profileData, { onConflict: 'id' })

			if (error) throw error

			toast({
				title: language === 'pl' ? 'Zapisano' : 'Saved',
				description: language === 'pl' ? 'Nazwa użytkownika została zaktualizowana' : 'Username has been updated',
			})
			setIsEditingUsername(false)
		} catch (error) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Nie udało się zapisać nazwy użytkownika' : 'Failed to save username',
				variant: 'destructive',
			})
		} finally {
			setIsSaving(false)
		}
	}

	const handleLanguageChange = (lang: 'pl' | 'en') => {
		setLanguage(lang)
		toast({
			title: lang === 'pl' ? 'Język zmieniony' : 'Language changed',
			description: lang === 'pl' ? 'Język został zmieniony na Polski' : 'Language changed to English',
		})
	}

	const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
		setTheme(newTheme)
		toast({
			title: language === 'pl' ? 'Motyw zmieniony' : 'Theme changed',
			description:
				newTheme === 'light'
					? language === 'pl'
						? 'Motyw jasny'
						: 'Light theme'
					: newTheme === 'dark'
					? language === 'pl'
						? 'Motyw ciemny'
						: 'Dark theme'
					: language === 'pl'
					? 'Motyw systemowy'
					: 'System theme',
		})
	}

	return (
		<Layout>
			<div className="min-h-screen p-4 sm:p-6 lg:p-12">
				<div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
					{/* Header */}
					<div className="space-y-3 lg:space-y-4 pb-4 lg:pb-6 border-b-4 border-primary">
						<div className="flex items-center gap-3 lg:gap-4">
							<div className="p-2 lg:p-3 bg-primary/10 border-2 border-primary rounded-sm flex-shrink-0">
								<SettingsIcon size={28} className="text-primary sm:w-10 sm:h-10" />
							</div>
							<div className="flex-1 min-w-0">
								<h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold truncate">
									{language === 'pl' ? 'Ustawienia' : 'Settings'}
								</h1>
								<p className="text-sm sm:text-base lg:text-xl text-muted-foreground">
									{language === 'pl' ? 'Zarządzaj swoim kontem i preferencjami' : 'Manage your account and preferences'}
								</p>
							</div>
						</div>
					</div>

					{/* Account Section */}
					<section className="p-4 sm:p-6 border-2 border-border rounded-sm brutal-shadow bg-card space-y-4 lg:space-y-6">
						<div className="flex items-center gap-2 lg:gap-3 pb-3 lg:pb-4 border-b-2 border-border">
							<User className="text-primary flex-shrink-0" size={20} />
							<h2 className="text-xl sm:text-2xl font-heading font-bold">{language === 'pl' ? 'Konto' : 'Account'}</h2>
						</div>

						<div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-6">
							<Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-border flex-shrink-0">
								<AvatarImage src={userAvatar} alt={displayName} />
								<AvatarFallback className="bg-primary text-primary-foreground text-2xl sm:text-3xl font-bold">
									{displayName.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 space-y-3 lg:space-y-4 w-full min-w-0">
								<div>
									<Label className="text-xs sm:text-sm font-semibold text-muted-foreground">
										{language === 'pl' ? 'Nazwa użytkownika' : 'Username'}
									</Label>
									{isEditingUsername ? (
										<div className="flex flex-col sm:flex-row gap-2 mt-2">
											<Input
												value={profileUsername}
												onChange={e => setProfileUsername(e.target.value)}
												placeholder={language === 'pl' ? 'Wpisz nazwę użytkownika' : 'Enter username'}
												className="flex-1"
											/>
											<div className="flex gap-2">
												<Button
													onClick={handleSaveUsername}
													disabled={isSaving}
													size="sm"
													className="flex-1 sm:flex-initial">
													<Save size={14} className="mr-1" />
													{language === 'pl' ? 'Zapisz' : 'Save'}
												</Button>
												<Button
													onClick={() => setIsEditingUsername(false)}
													variant="outline"
													size="sm"
													className="flex-1 sm:flex-initial">
													{language === 'pl' ? 'Anuluj' : 'Cancel'}
												</Button>
											</div>
										</div>
									) : (
										<div className="flex items-center gap-2 mt-2">
											<h3 className="text-xl sm:text-2xl font-bold truncate">{displayName}</h3>
											<Button
												onClick={() => setIsEditingUsername(true)}
												variant="ghost"
												size="sm"
												className="flex-shrink-0">
												<Edit2 size={14} />
											</Button>
										</div>
									)}
								</div>
								<div>
									<Label className="text-xs sm:text-sm font-semibold text-muted-foreground">Email</Label>
									<p className="text-base sm:text-lg mt-1 truncate">{userEmail}</p>
								</div>
								<p className="text-sm text-muted-foreground">
									{language === 'pl' ? 'Zalogowano przez' : 'Signed in with'} Google
								</p>
							</div>
						</div>
					</section>

					{/* Language Section */}
					<section className="p-6 border-2 border-border rounded-sm brutal-shadow bg-card space-y-6">
						<div className="flex items-center gap-3 pb-4 border-b-2 border-border">
							<Globe className="text-primary" size={24} />
							<h2 className="text-2xl font-heading font-bold">{language === 'pl' ? 'Język' : 'Language'}</h2>
						</div>

						<div className="space-y-4">
							<Label className="text-base font-semibold">
								{language === 'pl' ? 'Wybierz język aplikacji' : 'Choose app language'}
							</Label>
							<p className="text-sm text-muted-foreground">
								{language === 'pl'
									? 'Twój wybór zostanie zapisany i zastosowany przy następnym logowaniu.'
									: 'Your choice will be saved and applied on next login.'}
							</p>
							<div className="grid grid-cols-2 gap-4">
								<button
									onClick={() => handleLanguageChange('pl')}
									className={`p-4 border-2 rounded-sm font-semibold transition-all ${
										language === 'pl'
											? 'border-primary bg-primary text-primary-foreground brutal-shadow'
											: 'border-border hover:border-primary hover:bg-accent'
									}`}>
									🇵🇱 Polski
								</button>
								<button
									onClick={() => handleLanguageChange('en')}
									className={`p-4 border-2 rounded-sm font-semibold transition-all ${
										language === 'en'
											? 'border-primary bg-primary text-primary-foreground brutal-shadow'
											: 'border-border hover:border-primary hover:bg-accent'
									}`}>
									🇬🇧 English
								</button>
							</div>
						</div>
					</section>

					{/* Theme Section */}
					<section className="p-6 border-2 border-border rounded-sm brutal-shadow bg-card space-y-6">
						<div className="flex items-center gap-3 pb-4 border-b-2 border-border">
							<Palette className="text-primary" size={24} />
							<h2 className="text-2xl font-heading font-bold">{language === 'pl' ? 'Motyw' : 'Theme'}</h2>
						</div>

						<div className="space-y-4">
							<Label className="text-base font-semibold">
								{language === 'pl' ? 'Wybierz motyw aplikacji' : 'Choose app theme'}
							</Label>
							<div className="grid grid-cols-3 gap-4">
								<button
									onClick={() => handleThemeChange('light')}
									className={`p-4 border-2 rounded-sm font-semibold transition-all ${
										theme === 'light'
											? 'border-primary bg-primary text-primary-foreground brutal-shadow'
											: 'border-border hover:border-primary hover:bg-accent'
									}`}>
									{language === 'pl' ? 'Jasny' : 'Light'}
								</button>
								<button
									onClick={() => handleThemeChange('dark')}
									className={`p-4 border-2 rounded-sm font-semibold transition-all ${
										theme === 'dark'
											? 'border-primary bg-primary text-primary-foreground brutal-shadow'
											: 'border-border hover:border-primary hover:bg-accent'
									}`}>
									{language === 'pl' ? 'Ciemny' : 'Dark'}
								</button>
								<button
									onClick={() => handleThemeChange('system')}
									className={`p-4 border-2 rounded-sm font-semibold transition-all ${
										theme === 'system'
											? 'border-primary bg-primary text-primary-foreground brutal-shadow'
											: 'border-border hover:border-primary hover:bg-accent'
									}`}>
									{language === 'pl' ? 'System' : 'System'}
								</button>
							</div>
							<p className="text-sm text-muted-foreground">
								{language === 'pl'
									? 'Motyw systemowy dostosowuje się do ustawień Twojego urządzenia. Twoje preferencje są zapisywane automatycznie.'
									: 'System theme adapts to your device settings. Your preferences are saved automatically.'}
							</p>
						</div>
					</section>

					{/* Danger Zone */}
					<section className="p-6 border-2 border-destructive rounded-sm bg-destructive/5 space-y-6">
						<div className="flex items-center gap-3 pb-4 border-b-2 border-destructive">
							<LogOut className="text-destructive" size={24} />
							<h2 className="text-2xl font-heading font-bold text-destructive">
								{language === 'pl' ? 'Strefa Niebezpieczna' : 'Danger Zone'}
							</h2>
						</div>

						<div className="space-y-4">
							<p className="text-muted-foreground">
								{language === 'pl'
									? 'Wylogowanie spowoduje zakończenie sesji. Będziesz musiał zalogować się ponownie.'
									: 'Signing out will end your session. You will need to sign in again.'}
							</p>
							<Button variant="destructive" size="lg" onClick={signOut} className="w-full">
								<LogOut size={20} className="mr-2" />
								{language === 'pl' ? 'Wyloguj się' : 'Sign Out'}
							</Button>
						</div>
					</section>
				</div>
			</div>
		</Layout>
	)
}

export default Settings
