import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUserStats, useFavoriteMedia } from '@/hooks/useProfile'
import { useUpdateProfile, useProfile } from '@/hooks/useProfileUpdate'
import {
	Settings,
	TrendingUp,
	Film,
	Gamepad2,
	Clock,
	Bookmark,
	FolderOpen,
	Edit2,
	MessageSquare,
	Star,
} from 'lucide-react'
import { getTMDBImageUrl } from '@/services/tmdb'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useQuery } from '@tanstack/react-query'
import { ReviewViewDialog } from '@/components/ReviewViewDialog'

const Profile = () => {
	const { user } = useAuth()
	const { language } = useLanguage()
	const { toast } = useToast()
	const { data: stats, isLoading: statsLoading } = useUserStats()
	const { data: favorites, isLoading: favoritesLoading } = useFavoriteMedia()
	const profileQuery = useProfile()
	const { data: profile } = useQuery(profileQuery)
	const updateProfile = useUpdateProfile()

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [editUsername, setEditUsername] = useState('')
	const [editBio, setEditBio] = useState('')
	const [selectedReview, setSelectedReview] = useState<any>(null)
	const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
	const [reviewType, setReviewType] = useState<'movie' | 'series' | 'game'>('movie')

	// Dane użytkownika z Google/Auth
	const userName =
		profile?.username ||
		user?.user_metadata?.full_name ||
		user?.user_metadata?.name ||
		user?.email?.split('@')[0] ||
		'User'
	const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture
	const userEmail = user?.email || ''
	const userBio = profile?.bio || ''

	const handleEditProfile = () => {
		setEditUsername(profile?.username || '')
		setEditBio(profile?.bio || '')
		setIsEditDialogOpen(true)
	}

	const handleSaveProfile = async () => {
		try {
			await updateProfile.mutateAsync({
				username: editUsername,
				bio: editBio,
			})
			toast({
				title: language === 'pl' ? 'Zapisano' : 'Saved',
				description: language === 'pl' ? 'Profil został zaktualizowany' : 'Profile updated successfully',
			})
			setIsEditDialogOpen(false)
		} catch (error) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Nie udało się zapisać profilu' : 'Failed to save profile',
				variant: 'destructive',
			})
		}
	}

	const handleReviewClick = (review: any, type: 'movie' | 'series' | 'game') => {
		setSelectedReview(review)
		setReviewType(type)
		setReviewDialogOpen(true)
	}

	const statsData = [
		{
			label: language === 'pl' ? 'Filmy/Seriale/Gry' : 'Movies/Series/Games',
			value: stats?.total_items || 0,
			icon: Film,
			color: 'text-primary',
		},
		{
			label: language === 'pl' ? 'Oceny' : 'Ratings',
			value: stats?.total_ratings || 0,
			icon: Star,
			color: 'text-yellow-500',
		},
		{
			label: language === 'pl' ? 'Recenzje' : 'Reviews',
			value: stats?.total_text_reviews || 0,
			icon: MessageSquare,
			color: 'text-secondary',
		},
		{
			label: language === 'pl' ? 'Lista' : 'Watchlist',
			value: stats?.watchlist_count || 0,
			icon: Bookmark,
			color: 'text-accent',
		},
	]

	return (
		<Layout>
			<div className="min-h-screen">
				{/* Profile Header */}
				<section className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-background p-4 sm:p-6 lg:p-8 border-b-4 border-primary">
					<div className="max-w-7xl mx-auto">
						<div className="flex flex-col md:flex-row items-start gap-4 lg:gap-6">
							<div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0 w-full">
								<Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 border-4 border-border brutal-shadow flex-shrink-0">
									<AvatarImage src={userAvatar} alt={userName} />
									<AvatarFallback className="bg-primary text-primary-foreground text-2xl sm:text-3xl font-bold">
										{userName.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="space-y-1 flex-1 min-w-0">
									<h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold truncate">{userName}</h1>
									<p className="text-xs sm:text-sm text-muted-foreground truncate">{userEmail}</p>
									{userBio && <p className="text-xs sm:text-sm text-foreground line-clamp-2">{userBio}</p>}
									<p className="text-xs text-muted-foreground mono">
										{language === 'pl' ? 'Członek od' : 'Member since'}{' '}
										{new Date(user?.created_at || '').toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
											month: 'long',
											year: 'numeric',
										})}
									</p>
								</div>
							</div>
							<div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
								<Button variant="outline" size="sm" onClick={handleEditProfile} className="flex-1 md:flex-initial">
									<Edit2 size={14} className="sm:mr-1" />
									<span className="hidden sm:inline">{language === 'pl' ? 'Edytuj' : 'Edit'}</span>
								</Button>
								<Button
									variant="brutal"
									size="sm"
									onClick={() => (window.location.href = '/settings')}
									className="flex-1 md:flex-initial">
									<Settings size={14} className="sm:mr-1" />
									<span className="hidden sm:inline">{language === 'pl' ? 'Ustawienia' : 'Settings'}</span>
								</Button>
							</div>
						</div>
					</div>
				</section>

				<div className="p-4 sm:p-6 lg:p-12">
					<div className="max-w-7xl mx-auto space-y-8 lg:space-y-12">
						{/* Stats Grid */}
						<section>
							<h2 className="text-2xl sm:text-3xl font-heading font-bold mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3">
								<TrendingUp className="text-primary flex-shrink-0" size={24} />
								{language === 'pl' ? 'Statystyki' : 'Stats Overview'}
							</h2>
							{statsLoading ? (
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
									{[...Array(4)].map((_, i) => (
										<div
											key={i}
											className="h-24 sm:h-28 lg:h-32 bg-muted animate-pulse rounded-sm border-2 border-border"
										/>
									))}
								</div>
							) : (
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
									{statsData.map(stat => (
										<div
											key={stat.label}
											className="p-3 sm:p-4 lg:p-6 border-2 border-border rounded-sm brutal-shadow hover:translate-x-1 hover:translate-y-1 transition-transform bg-card">
											<div className="flex items-center gap-2 lg:gap-3 mb-2">
												<stat.icon className={`${stat.color} flex-shrink-0`} size={20} />
												<div className="text-2xl sm:text-3xl font-heading font-bold text-primary">{stat.value}</div>
											</div>
											<div className="text-sm font-semibold text-muted-foreground">{stat.label}</div>
										</div>
									))}
								</div>
							)}
						</section>

						{/* Favorite Movies */}
						{favorites?.movies && favorites.movies.length > 0 && (
							<section>
								<h2 className="text-2xl font-heading font-bold mb-4">
									{language === 'pl' ? 'Ulubione Filmy' : 'Favorite Movies'}
								</h2>
								<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
									{favorites.movies.slice(0, 6).map((movie: any) => (
										<div
											key={movie.id}
											className="group relative aspect-[2/3] rounded-sm border-2 border-border overflow-hidden brutal-shadow-hover bg-card cursor-pointer"
											onClick={() => handleReviewClick(movie, 'movie')}>
											<img
												src={getTMDBImageUrl(movie.movie_poster || '', 'w500')}
												alt={movie.movie_title}
												className="w-full h-full object-cover"
												loading="lazy"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
												<h3 className="text-white font-bold text-sm line-clamp-2 mb-1">{movie.movie_title}</h3>
												<div className="flex items-center gap-1 mb-1">
													<span className="text-yellow-400 text-lg">★</span>
													<span className="text-white font-bold text-sm">{movie.rating}/10</span>
												</div>
												{movie.review_text && <p className="text-white/80 text-xs line-clamp-2">{movie.review_text}</p>}
												<p className="text-white/60 text-xs mt-1">
													{language === 'pl' ? 'Kliknij aby zobaczyć pełną recenzję' : 'Click to view full review'}
												</p>
											</div>
											<div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-sm">
												<div className="flex items-center gap-1">
													<span className="text-yellow-400 text-sm">★</span>
													<span className="text-white font-bold text-xs">{movie.rating}</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</section>
						)}

						{/* Favorite Games */}
						{favorites?.games && favorites.games.length > 0 && (
							<section className="pb-12">
								<h2 className="text-2xl font-heading font-bold mb-4">
									{language === 'pl' ? 'Ulubione Gry' : 'Favorite Games'}
								</h2>
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
									{favorites.games.slice(0, 4).map((game: any) => (
										<div
											key={game.id}
											className="group relative aspect-[16/9] rounded-sm border-2 border-border overflow-hidden brutal-shadow-hover bg-card cursor-pointer"
											onClick={() => handleReviewClick(game, 'game')}>
											<img
												src={game.game_cover || 'https://via.placeholder.com/500x281'}
												alt={game.game_title}
												className="w-full h-full object-cover"
												loading="lazy"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
												<h3 className="text-white font-bold text-sm line-clamp-2 mb-1">{game.game_title}</h3>
												<div className="flex items-center gap-2 mb-1">
													<div className="flex items-center gap-1">
														<span className="text-yellow-400 text-lg">★</span>
														<span className="text-white font-bold text-sm">{game.rating}/10</span>
													</div>
													{game.hours_played && <span className="text-white/70 text-xs">{game.hours_played}h</span>}
												</div>
												{game.review_text && <p className="text-white/80 text-xs line-clamp-2">{game.review_text}</p>}
												<p className="text-white/60 text-xs mt-1">
													{language === 'pl' ? 'Kliknij aby zobaczyć pełną recenzję' : 'Click to view full review'}
												</p>
											</div>
											<div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-sm">
												<div className="flex items-center gap-1">
													<span className="text-yellow-400 text-sm">★</span>
													<span className="text-white font-bold text-xs">{game.rating}</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</section>
						)}

						{/* Empty State */}
						{!favoritesLoading &&
							(!favorites?.movies || favorites.movies.length === 0) &&
							(!favorites?.games || favorites.games.length === 0) && (
								<section className="text-center py-20 space-y-4">
									<p className="text-2xl text-muted-foreground">
										{language === 'pl'
											? 'Zacznij oceniać filmy i gry, aby zobaczyć swoje ulubione!'
											: 'Start rating movies and games to see your favorites!'}
									</p>
									<Button variant="brutal" size="lg" onClick={() => (window.location.href = '/discover')}>
										{language === 'pl' ? 'Odkrywaj Media' : 'Discover Media'}
									</Button>
								</section>
							)}
					</div>
				</div>
			</div>

			{/* Edit Profile Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="border-2 border-border">
					<DialogHeader>
						<DialogTitle className="text-2xl font-heading font-bold">
							{language === 'pl' ? 'Edytuj Profil' : 'Edit Profile'}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="username">{language === 'pl' ? 'Nazwa użytkownika' : 'Username'}</Label>
							<Input
								id="username"
								placeholder={language === 'pl' ? 'Twoja nazwa' : 'Your name'}
								value={editUsername}
								onChange={e => setEditUsername(e.target.value)}
								className="border-2 border-border"
							/>
							<p className="text-xs text-muted-foreground">
								{language === 'pl' ? 'Zostaw puste aby używać nazwy z Google' : 'Leave empty to use your Google name'}
							</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="bio">{language === 'pl' ? 'O mnie' : 'Bio'}</Label>
							<Textarea
								id="bio"
								placeholder={language === 'pl' ? 'Opowiedz coś o sobie...' : 'Tell us about yourself...'}
								value={editBio}
								onChange={e => setEditBio(e.target.value)}
								className="border-2 border-border resize-none"
								rows={4}
								maxLength={500}
							/>
							<p className="text-xs text-muted-foreground">
								{editBio.length}/500 {language === 'pl' ? 'znaków' : 'characters'}
							</p>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
							{language === 'pl' ? 'Anuluj' : 'Cancel'}
						</Button>
						<Button variant="brutal" onClick={handleSaveProfile} disabled={updateProfile.isPending}>
							{updateProfile.isPending
								? language === 'pl'
									? 'Zapisywanie...'
									: 'Saving...'
								: language === 'pl'
								? 'Zapisz'
								: 'Save'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Review View Dialog */}
			<ReviewViewDialog
				open={reviewDialogOpen}
				onOpenChange={setReviewDialogOpen}
				review={selectedReview}
				type={reviewType}
			/>
		</Layout>
	)
}

export default Profile
