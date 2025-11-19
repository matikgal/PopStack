import { Film, Compass, User, Home, LogOut, Bookmark, Settings } from 'lucide-react'
import { NavLink } from './NavLink'
import { Button } from './ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { DEMO_MODE } from '@/lib/demoMode'

export const Sidebar = () => {
	const { user, signOut } = useAuth()
	const { t } = useLanguage()
	const [profileUsername, setProfileUsername] = useState<string | null>(null)

	const navItems = [
		{ icon: Home, label: t.dashboard, path: '/' },
		{ icon: Compass, label: t.discover, path: '/discover' },
		{ icon: Bookmark, label: t.watchlist, path: '/watchlist' },
		{ icon: Film, label: t.myCollection, path: '/collection' },
		{ icon: User, label: t.profile, path: '/profile' },
		{ icon: Settings, label: t.settings, path: '/settings' },
	]

	// Fetch username from profiles table
	useEffect(() => {
		const fetchProfile = async () => {
			if (!user?.id) return

			const { data } = await supabase.from('profiles').select('username').eq('id', user.id).single()

			if (data?.username) {
				setProfileUsername(data.username)
			}
		}

		fetchProfile()
	}, [user?.id])

	// Get user display name and avatar
	// Priority: 1. Custom username from profiles, 2. Google full_name, 3. Email username
	const userName =
		profileUsername ||
		user?.user_metadata?.full_name ||
		user?.user_metadata?.name ||
		user?.email?.split('@')[0] ||
		'User'
	const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

	return (
		<aside className="w-full lg:w-64 border-r-2 border-border flex flex-col h-full glass-panel flex-shrink-0">
			{/* Header with logo and user info */}
			<div className="p-4 lg:p-6 space-y-4 border-b-2 border-border flex-shrink-0">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl lg:text-4xl logo-text text-primary">{t.appName}</h1>
					<p className="text-xs mono text-muted-foreground uppercase">{t.appSubtitle}</p>
				</div>

				{/* User info */}
				{user && (
					<Link
						to="/profile"
						className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 rounded-sm bg-card border-2 border-border brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group">
						<Avatar className="h-10 w-10 lg:h-12 lg:w-12 border-2 border-primary flex-shrink-0">
							<AvatarImage src={userAvatar} alt={userName} />
							<AvatarFallback className="bg-primary text-primary-foreground font-bold text-base lg:text-lg">
								{userName.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<p className="text-sm lg:text-base font-bold truncate group-hover:text-primary transition-colors">
								{userName}
							</p>
							<p className="text-xs text-muted-foreground truncate">{user.email}</p>
						</div>
					</Link>
				)}
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-3 lg:p-4 space-y-1 overflow-y-auto">
				{navItems.map(item => (
					<NavLink
						key={item.path}
						to={item.path}
						className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-sm text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all"
						activeClassName="bg-primary text-primary-foreground font-semibold">
						<item.icon size={20} className="flex-shrink-0" />
						<span className="font-medium text-sm lg:text-base">{item.label}</span>
					</NavLink>
				))}
			</nav>

			{/* Footer with sign out and links */}
			<div className="p-3 lg:p-4 space-y-3 border-t-2 border-border flex-shrink-0">
				{user && (
					<Button
						variant="brutal"
						className="w-full"
						size="lg"
						onClick={() => {
							if (DEMO_MODE) {
								window.location.href = '/login'
							} else {
								signOut()
							}
						}}>
						<LogOut size={18} className="lg:mr-2" />
						<span className="hidden lg:inline">{t.signOut}</span>
					</Button>
				)}

				{/* Footer links */}
				<div className="flex items-center justify-center gap-2 lg:gap-3 text-xs text-muted-foreground">
					<Link to="/terms" className="hover:text-foreground transition-colors hover:underline">
						{t.terms}
					</Link>
					<span>•</span>
					<Link to="/about" className="hover:text-foreground transition-colors hover:underline">
						{t.about}
					</Link>
				</div>
			</div>
		</aside>
	)
}
