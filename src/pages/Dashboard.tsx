import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import {
	Film,
	Gamepad2,
	Star as StarIcon,
	MessageSquare,
	Bookmark,
	Clock,
	Star,
	Calendar,
	Plus,
	Check,
	Tv,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTrendingMovies, useTrendingGames, useDiscoverTVShows } from '@/hooks/useMedia'
import { ReviewDialog } from '@/components/ReviewDialog'
import { getTMDBImageUrl } from '@/services/tmdb'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useMovieDetails, useGameDetails, useMovieCredits } from '@/hooks/useMedia'
import { actionTranslations } from '@/lib/i18n'
import { useToast } from '@/hooks/use-toast'
import { useCollections, useAddToCollection as useAddItemToCollection } from '@/hooks/useCollections'
import { useAddToWatchlist, useIsInWatchlist, useRemoveFromWatchlist } from '@/hooks/useWatchlist'

// Helper component for movie card with watchlist check
const MovieCardWithWatchlist = ({
	movie,
	setSelectedMovie,
	handleAddToCollection,
	handleAddToWatchlist,
	actions,
}: any) => {
	const { data: isInWatchlist } = useIsInWatchlist('movie', movie.id)
	const title = movie.title || movie.name || ''
	const rating = movie.vote_average || 0

	return (
		<div
			key={movie.id}
			className="group relative aspect-[2/3] rounded-sm border-2 border-border overflow-hidden brutal-shadow-hover cursor-pointer bg-card">
			<div onClick={() => setSelectedMovie(movie.id)}>
				<img
					src={getTMDBImageUrl(movie.poster_path, 'w500')}
					alt={title}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
					loading="lazy"
				/>
			</div>

			{/* Quick actions */}
			<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="icon"
								variant="secondary"
								className="h-9 w-9 bg-muted/90 hover:bg-muted backdrop-blur-sm border-2 border-border shadow-lg"
								onClick={e =>
									handleAddToCollection(e, 'movie', movie.id, title, getTMDBImageUrl(movie.poster_path, 'w500'))
								}>
								<Plus size={18} className="text-foreground" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">
							<p>{actions.addToCollection}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="icon"
								variant={isInWatchlist ? 'default' : 'secondary'}
								className="h-9 w-9 bg-muted/90 hover:bg-muted backdrop-blur-sm border-2 border-border shadow-lg"
								onClick={e =>
									handleAddToWatchlist(
										e,
										'movie',
										movie.id,
										title,
										getTMDBImageUrl(movie.poster_path, 'w500'),
										rating,
										isInWatchlist
									)
								}>
								<Bookmark size={18} className={isInWatchlist ? 'fill-current' : ''} />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">
							<p>{isInWatchlist ? actions.removeFromWatchlist : actions.addToWatchlist}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{/* Info */}
			<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-3">
				<h3 className="text-white font-bold text-sm line-clamp-2 mb-1">{title}</h3>
				<div className="flex items-center gap-1">
					<Star className="text-yellow-400 fill-yellow-400" size={14} />
					<span className="text-white text-xs font-semibold">{rating.toFixed(1)}</span>
				</div>
			</div>
		</div>
	)
}

// Helper component for game card with watchlist check
const GameCardWithWatchlist = ({
	game,
	setSelectedGame,
	handleAddToCollection,
	handleAddToWatchlist,
	actions,
}: any) => {
	const { data: isInWatchlist } = useIsInWatchlist('game', game.id)
	const rating = game.rating || 0

	return (
		<div
			key={game.id}
			className="group relative aspect-[16/9] rounded-sm border-2 border-border overflow-hidden brutal-shadow-hover cursor-pointer bg-card">
			<div onClick={() => setSelectedGame(game.id)}>
				<img
					src={game.background_image}
					alt={game.name}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
					loading="lazy"
				/>
			</div>

			{/* Quick actions */}
			<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="icon"
								variant="secondary"
								className="h-9 w-9 bg-muted/90 hover:bg-muted backdrop-blur-sm border-2 border-border shadow-lg"
								onClick={e => handleAddToCollection(e, 'game', game.id, game.name, game.background_image)}>
								<Plus size={18} className="text-foreground" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">
							<p>{actions.addToCollection}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="icon"
								variant={isInWatchlist ? 'default' : 'secondary'}
								className="h-9 w-9 bg-muted/90 hover:bg-muted backdrop-blur-sm border-2 border-border shadow-lg"
								onClick={e =>
									handleAddToWatchlist(e, 'game', game.id, game.name, game.background_image, rating, isInWatchlist)
								}>
								<Bookmark size={18} className={isInWatchlist ? 'fill-current' : ''} />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">
							<p>{isInWatchlist ? actions.removeFromWatchlist : actions.addToWatchlist}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{/* Info */}
			<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-3">
				<h3 className="text-white font-bold text-sm line-clamp-2 mb-1">{game.name}</h3>
				<div className="flex items-center gap-1">
					<Star className="text-yellow-400 fill-yellow-400" size={14} />
					<span className="text-white text-xs font-semibold">{rating.toFixed(1)}</span>
				</div>
			</div>
		</div>
	)
}

const Dashboard = () => {
	const { t, language } = useLanguage()
	const navigate = useNavigate()
	const { toast } = useToast()
	const [selectedMovie, setSelectedMovie] = useState<number | null>(null)
	const [selectedGame, setSelectedGame] = useState<number | null>(null)
	const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false)
	const [selectedItemForCollection, setSelectedItemForCollection] = useState<{
		type: string
		id: number
		title: string
		poster: string
	} | null>(null)
	const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
	const [selectedItemForReview, setSelectedItemForReview] = useState<{
		type: 'movie' | 'series' | 'game'
		id: number
		title: string
		poster: string | null
	} | null>(null)

	const { data: collections } = useCollections()
	const addItemToCollection = useAddItemToCollection()
	const addToWatchlist = useAddToWatchlist()
	const removeFromWatchlist = useRemoveFromWatchlist()

	// Pobierz dane z API
	const { data: moviesData, isLoading: moviesLoading } = useTrendingMovies('week')
	const { data: seriesData, isLoading: seriesLoading } = useDiscoverTVShows(1, '', 'popularity.desc')
	const { data: gamesData, isLoading: gamesLoading } = useTrendingGames(1)

	// Szczegóły dla modali
	const { data: movieDetails, isLoading: movieDetailsLoading } = useMovieDetails(selectedMovie || 0)
	const { data: movieCredits } = useMovieCredits(selectedMovie || 0)
	const { data: gameDetails, isLoading: gameDetailsLoading } = useGameDetails(selectedGame || 0)

	const trendingMovies = moviesData?.results.slice(0, 6) || []
	const trendingSeries = seriesData?.results.slice(0, 6) || []
	const trendingGames = gamesData?.results.slice(0, 6) || []

	const actions = actionTranslations[language]

	// Sprawdź czy jest klucz RAWG
	const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY
	const hasRAWGKey = RAWG_API_KEY && RAWG_API_KEY !== 'your-rawg-key-here'

	// Akcje
	const handleAddToCollection = (
		e: React.MouseEvent,
		itemType: string,
		itemId: number,
		title: string,
		poster: string
	) => {
		e.stopPropagation()
		setSelectedItemForCollection({ type: itemType, id: itemId, title, poster })
		setIsCollectionDialogOpen(true)
	}

	const handleAddToWatchlist = async (
		e: React.MouseEvent,
		itemType: 'movie' | 'series' | 'game',
		itemId: number,
		title: string,
		poster: string,
		rating: number,
		isInWatchlist: boolean
	) => {
		e.stopPropagation()

		try {
			if (isInWatchlist) {
				await removeFromWatchlist.mutateAsync({ itemType, itemId })
				toast({
					title: actions.removeFromWatchlist,
					description: `"${title}" ${language === 'pl' ? 'usunięto z listy' : 'removed from watchlist'}`,
				})
			} else {
				await addToWatchlist.mutateAsync({
					itemType,
					itemId,
					itemTitle: title,
					itemPoster: poster,
					itemRating: rating,
				})
				toast({
					title: actions.addToWatchlist,
					description: `"${title}" ${language === 'pl' ? 'dodano do listy' : 'added to watchlist'}`,
				})
			}
		} catch (error) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Coś poszło nie tak' : 'Something went wrong',
				variant: 'destructive',
			})
		}
	}

	return (
		<Layout>
			<div className="min-h-screen">
				{/* Hero Section */}
				<section className="relative h-[40vh] min-h-[400px] overflow-hidden border-b-2 border-border">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-background" />
					<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />

					<div className="relative h-full flex flex-col justify-end p-8 pb-10 z-10">
						<div className="max-w-3xl space-y-4 animate-slide-up">
							<div className="flex items-center gap-3">
								<span className="mono text-xs uppercase tracking-wider text-foreground font-bold">{t.welcomeBack}</span>
							</div>
							<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
								<span className="text-foreground">{t.yourMedia}</span>
								<br />
								<span className="relative z-20 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
									{t.trackedStacked}
								</span>
							</h1>
							<p className="text-sm sm:text-base lg:text-lg text-foreground/80 max-w-2xl">{t.dashboardSubtitle}</p>
							<div className="flex flex-col sm:flex-row gap-3 pt-2">
								<Button variant="brutal" size="lg" onClick={() => navigate('/discover')} className="w-full sm:w-auto">
									{t.exploreNow}
								</Button>
								<Button variant="glass" size="lg" onClick={() => navigate('/collection')} className="w-full sm:w-auto">
									{t.myCollection}
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Trending Movies Section */}
				<section className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6">
					<div className="flex items-center justify-between gap-4">
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 lg:gap-3 mb-2">
								<Film className="text-primary flex-shrink-0" size={20} />
								<h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold truncate">
									{language === 'pl' ? 'Popularne Filmy' : 'Trending Movies'}
								</h2>
							</div>
							<p className="text-xs sm:text-sm text-muted-foreground">{t.trendingSubtitle}</p>
						</div>
						<Button
							variant="outline"
							onClick={() => navigate('/discover?type=movies')}
							size="sm"
							className="flex-shrink-0">
							<span className="hidden sm:inline">{t.viewAll}</span>
							<span className="sm:hidden">→</span>
						</Button>
					</div>

					{moviesLoading ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
							{[...Array(6)].map((_, i) => (
								<div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-sm border-2 border-border" />
							))}
						</div>
					) : (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
							{trendingMovies.map(movie => (
								<MovieCardWithWatchlist
									key={movie.id}
									movie={movie}
									setSelectedMovie={setSelectedMovie}
									handleAddToCollection={handleAddToCollection}
									handleAddToWatchlist={handleAddToWatchlist}
									actions={actions}
								/>
							))}
						</div>
					)}
				</section>

				{/* Trending Series Section */}
				<section className="p-8 space-y-6 border-t-2 border-border">
					<div className="flex items-center justify-between">
						<div>
							<div className="flex items-center gap-3 mb-2">
								<Tv className="text-accent" size={24} />
								<h2 className="text-3xl font-heading font-bold">
									{language === 'pl' ? 'Popularne Seriale' : 'Trending Series'}
								</h2>
							</div>
							<p className="text-sm text-muted-foreground">
								{language === 'pl' ? 'Najlepiej oceniane seriale' : 'Top-rated TV shows'}
							</p>
						</div>
						<Button variant="outline" onClick={() => navigate('/discover?type=series')}>
							{t.viewAll}
						</Button>
					</div>

					{seriesLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
							{[...Array(6)].map((_, i) => (
								<div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-sm border-2 border-border" />
							))}
						</div>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
							{trendingSeries.map(series => (
								<MovieCardWithWatchlist
									key={series.id}
									movie={series}
									setSelectedMovie={setSelectedMovie}
									handleAddToCollection={handleAddToCollection}
									handleAddToWatchlist={handleAddToWatchlist}
									actions={actions}
								/>
							))}
						</div>
					)}
				</section>

				{/* Trending Games Section */}
				<section className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6 border-t-2 border-border">
					<div className="flex items-center justify-between gap-4">
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 lg:gap-3 mb-2">
								<Gamepad2 className="text-secondary flex-shrink-0" size={20} />
								<h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold truncate">
									{language === 'pl' ? 'Popularne Gry' : 'Trending Games'}
								</h2>
							</div>
							<p className="text-xs sm:text-sm text-muted-foreground">
								{language === 'pl' ? 'Najnowsze i najlepiej oceniane gry' : 'Latest and top-rated games'}
							</p>
						</div>
						<Button
							variant="outline"
							onClick={() => navigate('/discover?type=games')}
							size="sm"
							className="flex-shrink-0">
							<span className="hidden sm:inline">{t.viewAll}</span>
							<span className="sm:hidden">→</span>
						</Button>
					</div>

					{!hasRAWGKey ? (
						<div className="border-2 border-border rounded-sm p-8 text-center bg-muted/30">
							<p className="text-muted-foreground mb-2">
								{language === 'pl'
									? '🎮 Aby zobaczyć gry, dodaj klucz RAWG API do pliku .env.local'
									: '🎮 To see games, add RAWG API key to .env.local file'}
							</p>
							<p className="text-sm text-muted-foreground">
								{language === 'pl' ? 'Zobacz plik RAWG-KEY-SETUP.md' : 'See RAWG-KEY-SETUP.md file'}
							</p>
						</div>
					) : gamesLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="aspect-[16/9] bg-muted animate-pulse rounded-sm border-2 border-border" />
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
							{trendingGames.map(game => (
								<GameCardWithWatchlist
									key={game.id}
									game={game}
									setSelectedGame={setSelectedGame}
									handleAddToCollection={handleAddToCollection}
									handleAddToWatchlist={handleAddToWatchlist}
									actions={actions}
								/>
							))}
						</div>
					)}
				</section>
			</div>

			{/* Movie Details Modal */}
			<Dialog open={selectedMovie !== null} onOpenChange={() => setSelectedMovie(null)}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar border-2 border-border">
					{movieDetailsLoading ? (
						<div className="space-y-4 animate-pulse">
							<div className="h-8 bg-muted rounded w-3/4" />
							<div className="h-64 bg-muted rounded" />
							<div className="h-4 bg-muted rounded w-full" />
						</div>
					) : movieDetails ? (
						<>
							<DialogHeader>
								<DialogTitle className="text-3xl font-heading font-bold">
									{(movieDetails as any).title || (movieDetails as any).name}
								</DialogTitle>
							</DialogHeader>

							<div className="space-y-6">
								{/* Action Buttons */}
								<div className="flex flex-wrap gap-3">
									<Button
										variant="brutal"
										onClick={() => {
											setSelectedItemForReview({
												type: 'movie',
												id: (movieDetails as any).id,
												title: (movieDetails as any).title,
												poster: getTMDBImageUrl((movieDetails as any).poster_path, 'w500'),
											})
											setIsReviewDialogOpen(true)
										}}>
										<StarIcon size={18} className="mr-2" />
										{actions.rateThis}
									</Button>
									<Button
										variant="outline"
										onClick={() =>
											handleAddToCollection(
												{} as any,
												'movie',
												(movieDetails as any).id,
												(movieDetails as any).title,
												getTMDBImageUrl((movieDetails as any).poster_path, 'w500')
											)
										}>
										<Plus size={18} className="mr-2" />
										{actions.addToCollection}
									</Button>
								</div>

								<div className="flex gap-6 flex-col md:flex-row">
									<img
										src={getTMDBImageUrl((movieDetails as any).poster_path, 'w500')}
										alt={(movieDetails as any).title}
										className="w-full md:w-64 rounded-sm border-2 border-border"
									/>

									<div className="flex-1 space-y-4">
										{/* Ocena */}
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-2">
												<Star className="text-yellow-400 fill-yellow-400" size={24} />
												<span className="text-2xl font-bold">{(movieDetails as any).vote_average?.toFixed(1)}</span>
												<span className="text-muted-foreground">/ 10</span>
											</div>
											<span className="text-sm text-muted-foreground">
												({(movieDetails as any).vote_count} {language === 'pl' ? 'głosów' : 'votes'})
											</span>
										</div>

										{/* Data premiery */}
										{(movieDetails as any).release_date && (
											<div className="flex items-center gap-2">
												<Calendar className="text-primary" size={20} />
												<span className="font-semibold">{language === 'pl' ? 'Premiera:' : 'Release:'}</span>
												<span>
													{new Date((movieDetails as any).release_date).toLocaleDateString(
														language === 'pl' ? 'pl-PL' : 'en-US'
													)}
												</span>
											</div>
										)}

										{/* Czas trwania */}
										{(movieDetails as any).runtime && (
											<div className="flex items-center gap-2">
												<Clock className="text-primary" size={20} />
												<span className="font-semibold">{language === 'pl' ? 'Czas trwania:' : 'Runtime:'}</span>
												<span>{(movieDetails as any).runtime} min</span>
											</div>
										)}

										{/* Gatunki */}
										{(movieDetails as any).genres && (movieDetails as any).genres.length > 0 && (
											<div>
												<span className="font-semibold">{language === 'pl' ? 'Gatunki:' : 'Genres:'}</span>
												<div className="flex flex-wrap gap-2 mt-2">
													{(movieDetails as any).genres.map((genre: any) => (
														<span
															key={genre.id}
															className="px-3 py-1 bg-primary/10 border border-primary rounded-sm text-sm font-medium">
															{genre.name}
														</span>
													))}
												</div>
											</div>
										)}

										{/* Obsada */}
										{movieCredits && (movieCredits as any).cast && (movieCredits as any).cast.length > 0 && (
											<div>
												<span className="font-semibold">{language === 'pl' ? 'Obsada:' : 'Cast:'}</span>
												<div className="flex flex-wrap gap-2 mt-2">
													{(movieCredits as any).cast.slice(0, 6).map((actor: any) => (
														<span
															key={actor.id}
															className="px-3 py-1 bg-accent/50 border border-border rounded-sm text-sm">
															{actor.name}
														</span>
													))}
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Opis */}
								{(movieDetails as any).overview && (
									<div>
										<h3 className="text-xl font-heading font-bold mb-2">{language === 'pl' ? 'Opis' : 'Overview'}</h3>
										<p className="text-muted-foreground leading-relaxed">{(movieDetails as any).overview}</p>
									</div>
								)}

								{/* Tagline */}
								{(movieDetails as any).tagline && (
									<div className="border-l-4 border-primary pl-4 italic text-muted-foreground">
										"{(movieDetails as any).tagline}"
									</div>
								)}
							</div>
						</>
					) : null}
				</DialogContent>
			</Dialog>

			{/* Game Details Modal */}
			<Dialog open={selectedGame !== null} onOpenChange={() => setSelectedGame(null)}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar border-2 border-border">
					{gameDetailsLoading ? (
						<div className="space-y-4 animate-pulse">
							<div className="h-8 bg-muted rounded w-3/4" />
							<div className="h-64 bg-muted rounded" />
							<div className="h-4 bg-muted rounded w-full" />
						</div>
					) : gameDetails ? (
						<>
							<DialogHeader>
								<DialogTitle className="text-3xl font-heading font-bold">{(gameDetails as any).name}</DialogTitle>
							</DialogHeader>

							<div className="space-y-6">
								{/* Action Buttons */}
								<div className="flex flex-wrap gap-3">
									<Button
										variant="brutal"
										onClick={() => {
											setSelectedItemForReview({
												type: 'game',
												id: (gameDetails as any).id,
												title: (gameDetails as any).name,
												poster: (gameDetails as any).background_image,
											})
											setIsReviewDialogOpen(true)
										}}>
										<StarIcon size={18} className="mr-2" />
										{actions.rateThis}
									</Button>
									<Button
										variant="outline"
										onClick={() =>
											handleAddToCollection(
												{} as any,
												'game',
												(gameDetails as any).id,
												(gameDetails as any).name,
												(gameDetails as any).background_image
											)
										}>
										<Plus size={18} className="mr-2" />
										{actions.addToCollection}
									</Button>
								</div>

								<div className="flex gap-6 flex-col md:flex-row">
									<img
										src={(gameDetails as any).background_image || 'https://via.placeholder.com/500x281'}
										alt={(gameDetails as any).name}
										className="w-full md:w-96 rounded-sm border-2 border-border"
									/>

									<div className="flex-1 space-y-4">
										{/* Ocena */}
										<div className="flex items-center gap-4 flex-wrap">
											<div className="flex items-center gap-2">
												<Star className="text-yellow-400 fill-yellow-400" size={24} />
												<span className="text-2xl font-bold">{(gameDetails as any).rating?.toFixed(1)}</span>
												<span className="text-muted-foreground">/ 5</span>
											</div>
											{(gameDetails as any).metacritic && (
												<div className="px-3 py-1 bg-green-500/20 border border-green-500 rounded-sm">
													<span className="font-bold text-green-500">
														Metacritic: {(gameDetails as any).metacritic}
													</span>
												</div>
											)}
										</div>

										{/* Data premiery */}
										{(gameDetails as any).released && (
											<div className="flex items-center gap-2">
												<Calendar className="text-secondary" size={20} />
												<span className="font-semibold">{language === 'pl' ? 'Premiera:' : 'Released:'}</span>
												<span>
													{new Date((gameDetails as any).released).toLocaleDateString(
														language === 'pl' ? 'pl-PL' : 'en-US'
													)}
												</span>
											</div>
										)}

										{/* Platformy */}
										{(gameDetails as any).platforms && (gameDetails as any).platforms.length > 0 && (
											<div>
												<span className="font-semibold">{language === 'pl' ? 'Platformy:' : 'Platforms:'}</span>
												<div className="flex flex-wrap gap-2 mt-2">
													{(gameDetails as any).platforms.slice(0, 6).map((p: any) => (
														<span
															key={p.platform.id}
															className="px-3 py-1 bg-secondary/10 border border-secondary rounded-sm text-sm font-medium">
															{p.platform.name}
														</span>
													))}
												</div>
											</div>
										)}

										{/* Gatunki */}
										{(gameDetails as any).genres && (gameDetails as any).genres.length > 0 && (
											<div>
												<span className="font-semibold">{language === 'pl' ? 'Gatunki:' : 'Genres:'}</span>
												<div className="flex flex-wrap gap-2 mt-2">
													{(gameDetails as any).genres.map((genre: any) => (
														<span
															key={genre.id}
															className="px-3 py-1 bg-secondary/10 border border-secondary rounded-sm text-sm font-medium">
															{genre.name}
														</span>
													))}
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Opis */}
								{(gameDetails as any).description_raw && (
									<div>
										<h3 className="text-xl font-heading font-bold mb-2">
											{language === 'pl' ? 'Opis' : 'Description'}
										</h3>
										<p className="text-muted-foreground leading-relaxed">
											{(gameDetails as any).description_raw.slice(0, 500)}
											{(gameDetails as any).description_raw.length > 500 && '...'}
										</p>
									</div>
								)}
							</div>
						</>
					) : null}
				</DialogContent>
			</Dialog>

			{/* Add to Collection Dialog */}
			<Dialog open={isCollectionDialogOpen} onOpenChange={setIsCollectionDialogOpen}>
				<DialogContent className="border-2 border-border">
					<DialogHeader>
						<DialogTitle className="text-2xl font-heading font-bold">
							{language === 'pl' ? 'Dodaj do kolekcji' : 'Add to Collection'}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						{!collections || collections.length === 0 ? (
							<div className="text-center py-8 space-y-4">
								<p className="text-muted-foreground">
									{language === 'pl' ? 'Nie masz jeszcze żadnych kolekcji' : "You don't have any collections yet"}
								</p>
								<Button
									variant="brutal"
									onClick={() => {
										setIsCollectionDialogOpen(false)
										window.location.href = '/collection'
									}}>
									{language === 'pl' ? 'Utwórz kolekcję' : 'Create Collection'}
								</Button>
							</div>
						) : (
							<div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
								{collections.map(collection => (
									<button
										key={collection.id}
										onClick={async () => {
											if (!selectedItemForCollection) return
											try {
												await addItemToCollection.mutateAsync({
													collectionId: collection.id,
													itemType: selectedItemForCollection.type,
													itemId: selectedItemForCollection.id,
													itemTitle: selectedItemForCollection.title,
													itemPoster: selectedItemForCollection.poster,
												})
												toast({
													title: language === 'pl' ? 'Dodano' : 'Added',
													description: `"${selectedItemForCollection.title}" ${
														language === 'pl' ? 'dodano do' : 'added to'
													} "${collection.name}"`,
												})
												setIsCollectionDialogOpen(false)
												setSelectedItemForCollection(null)
											} catch (error) {
												toast({
													title: language === 'pl' ? 'Błąd' : 'Error',
													description: language === 'pl' ? 'Nie udało się dodać' : 'Failed to add',
													variant: 'destructive',
												})
											}
										}}
										className="w-full p-4 text-left rounded-sm border-2 border-border hover:bg-accent transition-colors">
										<div className="font-semibold">{collection.name}</div>
										{collection.description && (
											<div className="text-sm text-muted-foreground line-clamp-1">{collection.description}</div>
										)}
										<div className="text-xs text-muted-foreground mt-1">
											{collection.items_count || 0} {language === 'pl' ? 'elementów' : 'items'}
										</div>
									</button>
								))}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* Review Dialog */}
			{selectedItemForReview && (
				<ReviewDialog
					open={isReviewDialogOpen}
					onOpenChange={setIsReviewDialogOpen}
					itemType={selectedItemForReview.type}
					itemId={selectedItemForReview.id}
					itemTitle={selectedItemForReview.title}
					itemPoster={selectedItemForReview.poster}
				/>
			)}
		</Layout>
	)
}

export default Dashboard
