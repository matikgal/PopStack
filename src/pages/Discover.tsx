import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Star, Bookmark } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
	useDiscoverMovies,
	useDiscoverTVShows,
	useSearchMovies,
	useSearchTVShows,
	useMovieGenres,
	useTVGenres,
	useGameGenres,
	useMovieDetails,
	useMovieCredits,
	useDiscoverGames,
	useSearchGames,
	useGameDetails,
} from '@/hooks/useMedia'
import { useAddToWatchlist, useIsInWatchlist, useRemoveFromWatchlist } from '@/hooks/useWatchlist'
import { useCollections, useAddToCollection as useAddItemToCollection } from '@/hooks/useCollections'
import { getTMDBImageUrl } from '@/services/tmdb'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { actionTranslations } from '@/lib/i18n'
import { useToast } from '@/hooks/use-toast'
import { Plus, Check, Star as StarIcon, MessageSquare, Calendar, Clock as ClockIcon } from 'lucide-react'
import { ReviewDialog } from '@/components/ReviewDialog'

type MediaType = 'movies' | 'series' | 'games'

// Helper component for media card with watchlist check
const MediaCardWithWatchlist = ({
	item,
	isGame,
	title,
	rating,
	image,
	currentItemType,
	mediaType,
	setSelectedGame,
	setSelectedMovie,
	handleAddToCollection,
	handleAddToWatchlist,
	actions,
	itemId,
}: any) => {
	const { data: isInWatchlist } = useIsInWatchlist(currentItemType, itemId)

	return (
		<div
			className={`group relative ${
				isGame ? 'aspect-[16/9]' : 'aspect-[2/3]'
			} rounded-sm border-2 border-border overflow-hidden brutal-shadow-hover cursor-pointer bg-card`}>
			<div onClick={() => (isGame ? setSelectedGame(item.id) : setSelectedMovie(item.id))}>
				<img
					src={image}
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
								onClick={e => handleAddToCollection(e, currentItemType, itemId, title, image)}>
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
								onClick={e => handleAddToWatchlist(e, currentItemType, item.id, title, image, rating, isInWatchlist)}>
								<Bookmark size={18} className={isInWatchlist ? 'fill-current' : ''} />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">
							<p>{isInWatchlist ? actions.removeFromWatchlist : actions.addToWatchlist}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{/* Zawsze widoczna nazwa i ocena */}
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

const Discover = () => {
	const { t, language } = useLanguage()
	const { toast } = useToast()
	const [searchParams] = useSearchParams()

	// Pobierz typ z URL lub użyj domyślnego
	const typeFromUrl = searchParams.get('type') as MediaType | null
	const [mediaType, setMediaType] = useState<MediaType>(
		typeFromUrl && ['movies', 'series', 'games'].includes(typeFromUrl) ? typeFromUrl : 'movies'
	)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedGenres, setSelectedGenres] = useState<number[]>([])
	const [sortBy, setSortBy] = useState('popularity.desc')
	const [yearFrom, setYearFrom] = useState('')
	const [yearTo, setYearTo] = useState('')
	const [minRating, setMinRating] = useState('0')
	const [selectedMovie, setSelectedMovie] = useState<number | null>(null)
	const [selectedGame, setSelectedGame] = useState<number | null>(null)
	const [page, setPage] = useState(1)
	const [allResults, setAllResults] = useState<any[]>([])
	const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
	const [reviewItem, setReviewItem] = useState<{
		type: 'movie' | 'series' | 'game'
		id: number
		title: string
		poster: string | null
	} | null>(null)

	const actions = actionTranslations[language]

	// Pobierz wszystkie gatunki (prefetch - ładują się od razu)
	const { data: movieGenresData } = useMovieGenres()
	const { data: tvGenresData } = useTVGenres()
	const { data: gameGenresData } = useGameGenres()

	let allGenres: any[] = []
	if (mediaType === 'movies') {
		allGenres = (movieGenresData as any)?.genres || []
	} else if (mediaType === 'series') {
		allGenres = (tvGenresData as any)?.genres || []
	} else if (mediaType === 'games') {
		allGenres = (gameGenresData as any)?.results || []
	}

	// Parametry dla API (TMDB - filmy/seriale)
	const apiParams = {
		page: page,
		sort_by: sortBy,
		with_genres: selectedGenres.length > 0 ? selectedGenres.join(',') : undefined,
		'primary_release_date.gte': yearFrom ? `${yearFrom}-01-01` : yearTo ? '1900-01-01' : undefined,
		'primary_release_date.lte': yearTo ? `${yearTo}-12-31` : undefined,
		'vote_average.gte': minRating !== '0' ? minRating : undefined,
		'vote_count.gte': minRating !== '0' ? '100' : undefined, // Minimum głosów dla wiarygodności
	}

	// Parametry dla gier (RAWG używa innego formatu)
	// Domyślnie trending (-added) dla gier zamiast rating
	let gameOrdering = '-added' // trending by default
	if (sortBy !== 'popularity.desc') {
		gameOrdering = sortBy
			.replace('popularity', 'rating')
			.replace('vote_average', 'rating')
			.replace('.desc', '')
			.replace('.asc', '')
		if (sortBy.includes('.asc')) {
			gameOrdering = gameOrdering.replace('-', '')
		} else if (!gameOrdering.startsWith('-')) {
			gameOrdering = '-' + gameOrdering
		}
	}

	const gameApiParams = {
		page: page,
		ordering: gameOrdering,
		genres: selectedGenres.length > 0 ? selectedGenres.join(',') : undefined,
		dates:
			yearFrom && yearTo
				? `${yearFrom}-01-01,${yearTo}-12-31`
				: yearTo
				? `1900-01-01,${yearTo}-12-31`
				: yearFrom
				? `${yearFrom}-01-01,${new Date().getFullYear()}-12-31`
				: undefined,
		metacritic: minRating !== '0' ? `${parseInt(minRating) * 20},100` : undefined, // Konwersja 0-5 na 0-100
	}

	// Pobierz dane - albo wyszukiwanie albo discover
	const isSearching = searchQuery.length > 0

	// Prefetch wszystkich kategorii (ładują się w tle)
	const { data: discoverMoviesData, isLoading: discoverMoviesLoading } = useDiscoverMovies(apiParams)
	const { data: discoverTVData, isLoading: discoverTVLoading } = useDiscoverTVShows(apiParams)
	const { data: gamesData, isLoading: gamesLoading } = useDiscoverGames(gameApiParams)

	// Wyszukiwanie
	const { data: searchMoviesData, isLoading: searchMoviesLoading } = useSearchMovies(searchQuery, page)
	const { data: searchTVData, isLoading: searchTVLoading } = useSearchTVShows(searchQuery, page)
	const { data: searchGamesData, isLoading: searchGamesLoading } = useSearchGames(searchQuery, page)

	// Wybierz właściwe dane
	const moviesData = isSearching ? searchMoviesData : discoverMoviesData
	const tvData = isSearching ? searchTVData : discoverTVData
	const gamesResults = isSearching ? searchGamesData : gamesData

	let currentResults: any[] = []
	let totalPages = 1

	if (mediaType === 'movies') {
		currentResults = moviesData?.results || []
		totalPages = moviesData?.total_pages || 1
	} else if (mediaType === 'series') {
		currentResults = tvData?.results || []
		totalPages = tvData?.total_pages || 1
	} else if (mediaType === 'games') {
		currentResults = gamesResults?.results || []
		totalPages = gamesResults?.count ? Math.ceil(gamesResults.count / 20) : 1
	}

	const hasMore = page < totalPages

	// Dodaj nowe wyniki do listy (akumulacja)
	useEffect(() => {
		if (currentResults.length > 0) {
			if (page === 1) {
				// Pierwsza strona - zastąp wszystko
				setAllResults(currentResults)
			} else {
				// Kolejne strony - dodaj do istniejących
				setAllResults(prev => [...prev, ...currentResults])
			}
		}
	}, [currentResults, page])

	const results = allResults

	const isLoading =
		mediaType === 'movies'
			? isSearching
				? searchMoviesLoading
				: discoverMoviesLoading
			: mediaType === 'series'
			? isSearching
				? searchTVLoading
				: discoverTVLoading
			: isSearching
			? searchGamesLoading
			: gamesLoading

	// Szczegóły dla modali
	const { data: movieDetails, isLoading: movieDetailsLoading } = useMovieDetails(selectedMovie || 0)
	const { data: movieCredits } = useMovieCredits(selectedMovie || 0)
	const { data: gameDetails, isLoading: gameDetailsLoading } = useGameDetails(selectedGame || 0)

	// Reset gatunków, filtrów i strony przy zmianie typu mediów
	useEffect(() => {
		setSelectedGenres([])
		setYearFrom('')
		setYearTo('')
		setMinRating('0')
		setPage(1)
	}, [mediaType])

	// Reset strony przy zmianie wyszukiwania, sortowania, gatunków lub filtrów
	useEffect(() => {
		setPage(1)
	}, [searchQuery, sortBy, selectedGenres, yearFrom, yearTo, minRating])

	const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false)
	const [selectedItemForCollection, setSelectedItemForCollection] = useState<{
		type: string
		id: number
		title: string
		poster: string
	} | null>(null)

	// Akcje
	const handleAddToCollection = (
		e: React.MouseEvent,
		itemType: string,
		itemId: number,
		title: string,
		poster: string
	) => {
		e.stopPropagation()
		console.log('Opening collection dialog for:', title)
		setSelectedItemForCollection({ type: itemType, id: itemId, title, poster })
		setIsCollectionDialogOpen(true)
		console.log('Dialog state set to true')
	}

	const addToWatchlist = useAddToWatchlist()
	const removeFromWatchlist = useRemoveFromWatchlist()
	const { data: collections } = useCollections()
	const addItemToCollection = useAddItemToCollection()

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

	const toggleGenre = (genreId: number) => {
		setSelectedGenres(prev => (prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId]))
	}

	return (
		<Layout>
			<div className="min-h-screen">
				{/* Search Header */}
				<section className="sticky top-0 z-10 glass-panel border-b-2 border-border p-3 sm:p-4 lg:p-6">
					<div className="max-w-7xl mx-auto space-y-3 lg:space-y-4">
						<div className="flex items-center gap-2 sm:gap-4">
							<div className="flex-1 relative">
								<Search
									className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
									size={18}
								/>
								<Input
									placeholder={language === 'pl' ? 'Szukaj...' : 'Search...'}
									className="pl-10 sm:pl-12 h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg border-2 border-border"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>

						{/* Category Pills */}
						<div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
							<Badge
								variant={mediaType === 'movies' ? 'default' : 'secondary'}
								className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer whitespace-nowrap brutal-shadow hover:translate-x-1 hover:translate-y-1 transition-transform text-xs sm:text-sm flex-shrink-0"
								onClick={() => setMediaType('movies')}>
								{language === 'pl' ? 'Filmy' : 'Movies'}
							</Badge>
							<Badge
								variant={mediaType === 'series' ? 'default' : 'secondary'}
								className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer whitespace-nowrap brutal-shadow hover:translate-x-1 hover:translate-y-1 transition-transform text-xs sm:text-sm flex-shrink-0"
								onClick={() => setMediaType('series')}>
								{language === 'pl' ? 'Seriale' : 'Series'}
							</Badge>
							<Badge
								variant={mediaType === 'games' ? 'default' : 'secondary'}
								className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer whitespace-nowrap brutal-shadow hover:translate-x-1 hover:translate-y-1 transition-transform text-xs sm:text-sm flex-shrink-0"
								onClick={() => setMediaType('games')}>
								{language === 'pl' ? 'Gry' : 'Games'}
							</Badge>
						</div>
					</div>
				</section>

				{/* Genres Filter */}
				{!isSearching && (
					<section className="p-6 border-b-2 border-border">
						<div className="max-w-7xl mx-auto">
							<h3 className="font-heading font-bold text-lg mb-4">{language === 'pl' ? 'Gatunki' : 'Genres'}</h3>
							<div className="flex flex-wrap gap-2">
								{allGenres.map((genre: any) => (
									<Badge
										key={genre.id}
										variant={selectedGenres.includes(genre.id) ? 'default' : 'outline'}
										className="cursor-pointer hover:bg-accent px-3 py-1"
										onClick={() => toggleGenre(genre.id)}>
										{genre.name}
									</Badge>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Advanced Filters */}
				{!isSearching && (
					<section className="p-6 border-b-2 border-border bg-muted/30">
						<div className="max-w-7xl mx-auto">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								{/* Sortowanie */}
								<div>
									<label className="text-sm font-semibold mb-2 block">{language === 'pl' ? 'Sortuj' : 'Sort by'}</label>
									<select
										className="w-full px-3 py-2 border-2 border-border rounded-sm bg-background text-sm"
										value={sortBy}
										onChange={e => setSortBy(e.target.value)}>
										<option value="popularity.desc">{language === 'pl' ? 'Popularność ↓' : 'Popularity ↓'}</option>
										<option value="popularity.asc">{language === 'pl' ? 'Popularność ↑' : 'Popularity ↑'}</option>
										<option value="vote_average.desc">{language === 'pl' ? 'Ocena ↓' : 'Rating ↓'}</option>
										<option value="vote_average.asc">{language === 'pl' ? 'Ocena ↑' : 'Rating ↑'}</option>
										<option value="release_date.desc">{language === 'pl' ? 'Najnowsze' : 'Newest'}</option>
										<option value="release_date.asc">{language === 'pl' ? 'Najstarsze' : 'Oldest'}</option>
									</select>
								</div>

								{/* Rok od */}
								<div>
									<label className="text-sm font-semibold mb-2 block">
										{language === 'pl' ? 'Rok od' : 'Year from'}
									</label>
									<Input
										type="number"
										placeholder="1900"
										min="1900"
										max={new Date().getFullYear()}
										className="border-2 border-border"
										value={yearFrom}
										onChange={e => setYearFrom(e.target.value)}
									/>
								</div>

								{/* Rok do */}
								<div>
									<label className="text-sm font-semibold mb-2 block">{language === 'pl' ? 'Rok do' : 'Year to'}</label>
									<Input
										type="number"
										placeholder={String(new Date().getFullYear())}
										min="1900"
										max={new Date().getFullYear()}
										className="border-2 border-border"
										value={yearTo}
										onChange={e => setYearTo(e.target.value)}
									/>
								</div>

								{/* Minimalna ocena */}
								<div>
									<label className="text-sm font-semibold mb-2 block">
										{language === 'pl' ? 'Min. ocena' : 'Min. rating'}
										{mediaType === 'games' && ' (0-5)'}
										{mediaType !== 'games' && ' (0-10)'}
									</label>
									<select
										className="w-full px-3 py-2 border-2 border-border rounded-sm bg-background text-sm"
										value={minRating}
										onChange={e => setMinRating(e.target.value)}>
										<option value="0">{language === 'pl' ? 'Wszystkie' : 'All'}</option>
										{mediaType === 'games' ? (
											<>
												<option value="1">1+</option>
												<option value="2">2+</option>
												<option value="3">3+</option>
												<option value="4">4+</option>
												<option value="5">5</option>
											</>
										) : (
											<>
												<option value="5">5+</option>
												<option value="6">6+</option>
												<option value="7">7+</option>
												<option value="8">8+</option>
												<option value="9">9+</option>
											</>
										)}
									</select>
								</div>
							</div>
						</div>
					</section>
				)}

				{/* Results Grid */}
				<section className="p-12">
					<div className="max-w-7xl mx-auto space-y-6">
						{isLoading ? (
							<div
								className={
									mediaType === 'games'
										? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
										: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
								}>
								{[...Array(20)].map((_, i) => (
									<div
										key={i}
										className={
											mediaType === 'games'
												? 'aspect-[16/9] bg-muted animate-pulse rounded-sm border-2 border-border'
												: 'aspect-[2/3] bg-muted animate-pulse rounded-sm border-2 border-border'
										}
									/>
								))}
							</div>
						) : results.length === 0 ? (
							<div className="text-center py-20">
								<p className="text-2xl text-muted-foreground">
									{language === 'pl' ? 'Nie znaleziono wyników' : 'No results found'}
								</p>
							</div>
						) : (
							<div
								className={
									mediaType === 'games'
										? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
										: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
								}>
								{results.map((item: any) => {
									const isGame = !!item.background_image || mediaType === 'games'
									const title = item.title || item.name
									const rating = item.vote_average || item.rating || 0
									const image = isGame ? item.background_image : getTMDBImageUrl(item.poster_path, 'w500')
									const currentItemType = isGame ? 'game' : mediaType === 'series' ? 'series' : 'movie'

									return (
										<MediaCardWithWatchlist
											key={item.id}
											item={item}
											isGame={isGame}
											title={title}
											rating={rating}
											image={image}
											currentItemType={currentItemType}
											mediaType={mediaType}
											setSelectedGame={setSelectedGame}
											setSelectedMovie={setSelectedMovie}
											handleAddToCollection={handleAddToCollection}
											handleAddToWatchlist={handleAddToWatchlist}
											actions={actions}
											itemId={item.id}
										/>
									)
								})}
							</div>
						)}

						{/* Load More Button */}
						{!isLoading && results.length > 0 && hasMore && (
							<div className="flex justify-center pt-8">
								<Button variant="brutal" size="lg" onClick={() => setPage(prev => prev + 1)}>
									{language === 'pl' ? 'Załaduj więcej' : 'Load More'}
								</Button>
							</div>
						)}
					</div>
				</section>
			</div>

			{/* Movie/TV Details Modal */}
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
										onClick={() => handleAddToCollection({} as any, (movieDetails as any).title)}>
										<Plus size={18} className="mr-2" />
										{actions.addToCollection}
									</Button>
									<Button
										variant="outline"
										onClick={() => {
											setReviewItem({
												type: mediaType === 'series' ? 'series' : 'movie',
												id: selectedMovie!,
												title: (movieDetails as any).title || (movieDetails as any).name,
												poster: (movieDetails as any).poster_path,
											})
											setReviewDialogOpen(true)
										}}>
										<StarIcon size={18} className="mr-2" />
										{actions.rateThis}
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
										{((movieDetails as any).release_date || (movieDetails as any).first_air_date) && (
											<div className="flex items-center gap-2">
												<Calendar className="text-primary" size={20} />
												<span className="font-semibold">{language === 'pl' ? 'Premiera:' : 'Release:'}</span>
												<span>
													{new Date(
														(movieDetails as any).release_date || (movieDetails as any).first_air_date
													).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}
												</span>
											</div>
										)}

										{/* Czas trwania */}
										{(movieDetails as any).runtime && (
											<div className="flex items-center gap-2">
												<ClockIcon className="text-primary" size={20} />
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
									<Button variant="brutal" onClick={() => handleAddToCollection({} as any, (gameDetails as any).name)}>
										<Plus size={18} className="mr-2" />
										{actions.addToCollection}
									</Button>
									<Button
										variant="outline"
										onClick={() => {
											setReviewItem({
												type: 'game',
												id: selectedGame!,
												title: (gameDetails as any).name,
												poster: (gameDetails as any).background_image,
											})
											setReviewDialogOpen(true)
										}}>
										<StarIcon size={18} className="mr-2" />
										{actions.rateThis}
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
			{reviewItem && (
				<ReviewDialog
					open={reviewDialogOpen}
					onOpenChange={setReviewDialogOpen}
					itemType={reviewItem.type}
					itemId={reviewItem.id}
					itemTitle={reviewItem.title}
					itemPoster={reviewItem.poster}
				/>
			)}
		</Layout>
	)
}

export default Discover
