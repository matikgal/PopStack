import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLanguage } from '@/contexts/LanguageContext'
import { Film, Gamepad2, Clock, Bookmark, FolderOpen, MessageSquare, TrendingUp, Star } from 'lucide-react'
import { getTMDBImageUrl } from '@/services/tmdb'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { ReviewViewDialog } from '@/components/ReviewViewDialog'

const FriendProfile = () => {
	const { userId } = useParams<{ userId: string }>()
	const { language } = useLanguage()
	const [selectedReview, setSelectedReview] = useState<any>(null)
	const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
	const [reviewType, setReviewType] = useState<'movie' | 'series' | 'game'>('movie')

	// Pobierz profil znajomego
	const { data: profile, isLoading: profileLoading } = useQuery({
		queryKey: ['friendProfile', userId],
		queryFn: async () => {
			if (!userId) return null

			const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

			if (error) throw error
			return data
		},
		enabled: !!userId,
	})

	// Pobierz statystyki
	const { data: stats } = useQuery({
		queryKey: ['friendStats', userId],
		queryFn: async () => {
			if (!userId) return null

			const [movies, series, games, watchlist] = await Promise.all([
				supabase.from('movie_reviews').select('review_text').eq('user_id', userId),
				supabase.from('series_reviews').select('review_text').eq('user_id', userId),
				supabase.from('game_reviews').select('review_text').eq('user_id', userId),
				supabase.from('watchlist').select('*', { count: 'exact', head: true }).eq('user_id', userId),
			])

			const allReviews = [...(movies.data || []), ...(series.data || []), ...(games.data || [])]

			const totalRatings = allReviews.length
			const totalTextReviews = allReviews.filter(r => r.review_text && r.review_text.trim()).length

			return {
				total_items: totalRatings,
				watchlist_count: watchlist.count || 0,
				total_ratings: totalRatings,
				total_text_reviews: totalTextReviews,
			}
		},
		enabled: !!userId,
	})

	// Pobierz ulubione filmy
	const { data: favoriteMovies } = useQuery({
		queryKey: ['friendFavoriteMovies', userId],
		queryFn: async () => {
			if (!userId) return []

			const { data, error } = await supabase
				.from('movie_reviews')
				.select('*')
				.eq('user_id', userId)
				.order('rating', { ascending: false })
				.limit(6)

			if (error) {
				console.error('Error fetching friend movies:', error)
				return []
			}
			return data || []
		},
		enabled: !!userId,
	})

	// Pobierz ulubione gry
	const { data: favoriteGames } = useQuery({
		queryKey: ['friendFavoriteGames', userId],
		queryFn: async () => {
			if (!userId) return []

			const { data, error } = await supabase
				.from('game_reviews')
				.select('*')
				.eq('user_id', userId)
				.order('rating', { ascending: false })
				.limit(4)

			if (error) {
				console.error('Error fetching friend games:', error)
				return []
			}
			return data || []
		},
		enabled: !!userId,
	})

	if (profileLoading) {
		return (
			<Layout>
				<div className="min-h-screen flex items-center justify-center">
					<div className="text-center space-y-4">
						<div className="h-24 w-24 bg-muted animate-pulse rounded-full mx-auto" />
						<div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto" />
					</div>
				</div>
			</Layout>
		)
	}

	if (!profile) {
		return (
			<Layout>
				<div className="min-h-screen flex items-center justify-center">
					<div className="text-center space-y-4">
						<h1 className="text-3xl font-heading font-bold">
							{language === 'pl' ? 'Profil nie znaleziony' : 'Profile not found'}
						</h1>
						<p className="text-muted-foreground">
							{language === 'pl' ? 'Ten użytkownik nie istnieje' : 'This user does not exist'}
						</p>
					</div>
				</div>
			</Layout>
		)
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
						<div className="flex items-center gap-3 lg:gap-4">
							<Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 border-4 border-border brutal-shadow flex-shrink-0">
								<AvatarImage src={profile.avatar_url || undefined} />
								<AvatarFallback className="bg-primary text-primary-foreground text-2xl sm:text-3xl font-bold">
									{profile.username?.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="space-y-1 flex-1 min-w-0">
								<h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold truncate">{profile.username}</h1>
								{profile.bio && <p className="text-xs sm:text-sm text-foreground line-clamp-2">{profile.bio}</p>}
								<p className="text-xs text-muted-foreground mono">
									{language === 'pl' ? 'Członek od' : 'Member since'}{' '}
									{new Date(profile.created_at).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', {
										month: 'long',
										year: 'numeric',
									})}
								</p>
							</div>
						</div>
					</div>
				</section>

				<div className="p-4 sm:p-6 lg:p-8">
					<div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
						{/* Stats Grid */}
						<section>
							<h2 className="text-xl sm:text-2xl font-heading font-bold mb-3 lg:mb-4 flex items-center gap-2 lg:gap-3">
								<TrendingUp className="text-primary flex-shrink-0" size={24} />
								{language === 'pl' ? 'Statystyki' : 'Stats'}
							</h2>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
								{statsData.map(stat => (
									<div key={stat.label} className="p-3 sm:p-4 border-2 border-border rounded-sm brutal-shadow bg-card">
										<div className="flex items-center gap-2 mb-2">
											<stat.icon className={`${stat.color} flex-shrink-0`} size={18} />
											<div className="text-xl sm:text-2xl font-heading font-bold text-primary">{stat.value}</div>
										</div>
										<div className="text-xs font-semibold text-muted-foreground">{stat.label}</div>
									</div>
								))}
							</div>
						</section>

						{/* Favorite Movies */}
						{favoriteMovies && favoriteMovies.length > 0 && (
							<section>
								<h2 className="text-xl sm:text-2xl font-heading font-bold mb-3 lg:mb-4">
									{language === 'pl' ? 'Ulubione Filmy' : 'Favorite Movies'}
								</h2>
								<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
									{favoriteMovies.map((movie: any) => (
										<div
											key={movie.id}
											className="group relative aspect-[2/3] rounded-sm border-2 border-border overflow-hidden brutal-shadow-hover bg-card cursor-pointer"
											onClick={() => handleReviewClick(movie, 'movie')}>
											<img
												src={getTMDBImageUrl(movie.movie_poster || '', 'w500')}
												alt={movie.movie_title}
												className="w-full h-full object-cover"
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
						{favoriteGames && favoriteGames.length > 0 && (
							<section className="pb-8">
								<h2 className="text-2xl font-heading font-bold mb-4">
									{language === 'pl' ? 'Ulubione Gry' : 'Favorite Games'}
								</h2>
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
									{favoriteGames.map((game: any) => (
										<div
											key={game.id}
											className="group relative aspect-[16/9] rounded-sm border-2 border-border overflow-hidden brutal-shadow-hover bg-card cursor-pointer"
											onClick={() => handleReviewClick(game, 'game')}>
											<img
												src={game.game_cover || 'https://via.placeholder.com/500x281'}
												alt={game.game_title}
												className="w-full h-full object-cover"
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
						{(!favoriteMovies || favoriteMovies.length === 0) && (!favoriteGames || favoriteGames.length === 0) && (
							<section className="text-center py-12">
								<p className="text-xl text-muted-foreground">
									{language === 'pl'
										? 'Ten użytkownik nie ma jeszcze żadnych recenzji'
										: 'This user has no reviews yet'}
								</p>
							</section>
						)}
					</div>
				</div>
			</div>
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

export default FriendProfile
