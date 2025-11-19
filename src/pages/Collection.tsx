import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import {
	useCollections,
	useCreateCollection,
	useDeleteCollection,
	useCollection,
	useAddToCollection,
	useRemoveFromCollection,
} from '@/hooks/useCollections'
import { Plus, Folder, Trash2, ArrowLeft, Star, Search } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { getTMDBImageUrl } from '@/services/tmdb'
import {
	useSearchMovies,
	useSearchTVShows,
	useSearchGames,
	useMovieDetails,
	useMovieCredits,
	useGameDetails,
} from '@/hooks/useMedia'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock as ClockIcon, MessageSquare } from 'lucide-react'

const Collection = () => {
	const { language } = useLanguage()
	const { toast } = useToast()
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
	const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
	const [newCollectionName, setNewCollectionName] = useState('')
	const [newCollectionDescription, setNewCollectionDescription] = useState('')
	const [searchQuery, setSearchQuery] = useState('')
	const [searchType, setSearchType] = useState<'movie' | 'series' | 'game'>('movie')
	const [selectedItemForDetails, setSelectedItemForDetails] = useState<{ type: string; id: number } | null>(null)
	const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null)

	const { data: collections, isLoading } = useCollections()
	const { data: selectedCollection } = useCollection(selectedCollectionId || '')
	const createCollection = useCreateCollection()
	const deleteCollection = useDeleteCollection()
	const addToCollection = useAddToCollection()
	const removeFromCollection = useRemoveFromCollection()

	// Wyszukiwanie
	const { data: movieResults } = useSearchMovies(searchQuery, 1)
	const { data: tvResults } = useSearchTVShows(searchQuery, 1)
	const { data: gameResults } = useSearchGames(searchQuery, 1)

	const searchResults =
		searchType === 'movie'
			? movieResults?.results || []
			: searchType === 'series'
			? tvResults?.results || []
			: gameResults?.results || []

	// Pobierz szczegóły dla modala
	const { data: movieDetails, isLoading: movieDetailsLoading } = useMovieDetails(
		selectedItemForDetails?.type === 'movie' ? selectedItemForDetails.id : 0
	)
	const { data: movieCredits } = useMovieCredits(
		selectedItemForDetails?.type === 'movie' ? selectedItemForDetails.id : 0
	)
	const { data: gameDetails, isLoading: gameDetailsLoading } = useGameDetails(
		selectedItemForDetails?.type === 'game' ? selectedItemForDetails.id : 0
	)

	const handleRemoveItem = async () => {
		if (!selectedCollectionId || !itemToDelete) return

		try {
			await removeFromCollection.mutateAsync({
				collectionId: selectedCollectionId,
				itemId: itemToDelete.id,
			})
			toast({
				title: language === 'pl' ? 'Usunięto' : 'Removed',
				description: `"${itemToDelete.title}" ${language === 'pl' ? 'usunięto z kolekcji' : 'removed from collection'}`,
			})
			setItemToDelete(null)
		} catch (error) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Nie udało się usunąć' : 'Failed to remove',
				variant: 'destructive',
			})
		}
	}

	const handleCreateCollection = async () => {
		if (!newCollectionName.trim()) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Nazwa kolekcji jest wymagana' : 'Collection name is required',
				variant: 'destructive',
			})
			return
		}

		try {
			await createCollection.mutateAsync({
				name: newCollectionName,
				description: newCollectionDescription,
			})
			toast({
				title: language === 'pl' ? 'Sukces' : 'Success',
				description: language === 'pl' ? 'Kolekcja została utworzona' : 'Collection created successfully',
			})
			setIsCreateDialogOpen(false)
			setNewCollectionName('')
			setNewCollectionDescription('')
		} catch (error) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Nie udało się utworzyć kolekcji' : 'Failed to create collection',
				variant: 'destructive',
			})
		}
	}

	const [collectionToDelete, setCollectionToDelete] = useState<{ id: string; name: string } | null>(null)

	const handleDeleteCollection = async () => {
		if (!collectionToDelete) return

		try {
			await deleteCollection.mutateAsync(collectionToDelete.id)
			toast({
				title: language === 'pl' ? 'Usunięto' : 'Deleted',
				description: language === 'pl' ? 'Kolekcja została usunięta' : 'Collection deleted successfully',
			})
			if (selectedCollectionId === collectionToDelete.id) {
				setSelectedCollectionId(null)
			}
			setCollectionToDelete(null)
		} catch (error) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Nie udało się usunąć kolekcji' : 'Failed to delete collection',
				variant: 'destructive',
			})
		}
	}

	// Widok pojedynczej kolekcji
	if (selectedCollectionId && selectedCollection) {
		const items = (selectedCollection as any).collection_items || []

		return (
			<Layout>
				<div className="min-h-screen p-4 sm:p-6 lg:p-12">
					<div className="max-w-7xl mx-auto space-y-8">
						{/* Header */}
						<div className="space-y-4 pb-6 border-b-4 border-primary">
							<Button variant="ghost" onClick={() => setSelectedCollectionId(null)} className="mb-4">
								<ArrowLeft size={20} className="mr-2" />
								{language === 'pl' ? 'Powrót' : 'Back'}
							</Button>
							<div className="flex items-start justify-between">
								<div>
									<h1 className="text-5xl font-heading font-bold">{(selectedCollection as any).name}</h1>
									{(selectedCollection as any).description && (
										<p className="text-xl text-muted-foreground mt-2">{(selectedCollection as any).description}</p>
									)}
									<p className="text-sm text-muted-foreground mt-4">
										{items.length} {language === 'pl' ? 'elementów' : 'items'}
									</p>
								</div>
								<div className="flex gap-3">
									<Button variant="brutal" size="lg" onClick={() => setIsSearchDialogOpen(true)}>
										<Plus size={20} className="mr-2" />
										{language === 'pl' ? 'Dodaj' : 'Add'}
									</Button>
									<Button
										variant="destructive"
										size="lg"
										onClick={() =>
											setCollectionToDelete({
												id: selectedCollectionId,
												name: (selectedCollection as any).name,
											})
										}>
										<Trash2 size={18} className="mr-2" />
										{language === 'pl' ? 'Usuń' : 'Delete'}
									</Button>
								</div>
							</div>
						</div>

						{/* Items Grid */}
						{items.length === 0 ? (
							<div className="text-center py-20 space-y-4">
								<p className="text-2xl text-muted-foreground">
									{language === 'pl' ? 'Ta kolekcja jest pusta' : 'This collection is empty'}
								</p>
								<p className="text-muted-foreground">
									{language === 'pl'
										? 'Dodaj filmy, seriale lub gry z zakładki Odkrywaj'
										: 'Add movies, series, or games from the Discover page'}
								</p>
							</div>
						) : (
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
								{items.map((item: any) => {
									const isGame = item.item_type === 'game'
									const image = isGame ? item.item_poster : getTMDBImageUrl(item.item_poster || '', 'w500')

									return (
										<div
											key={item.id}
											className={`group relative ${
												isGame ? 'aspect-[16/9]' : 'aspect-[2/3]'
											} rounded-sm border-2 border-border overflow-hidden brutal-shadow-hover bg-card`}>
											<img
												src={image || 'https://via.placeholder.com/500x750'}
												alt={item.item_title}
												className="w-full h-full object-cover"
												loading="lazy"
											/>

											{/* Remove button */}
											<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
												<Button
													size="icon"
													variant="destructive"
													className="h-9 w-9 border-2 border-border shadow-lg"
													onClick={e => {
														e.stopPropagation()
														setItemToDelete({ id: item.id, title: item.item_title })
													}}>
													<Trash2 size={18} />
												</Button>
											</div>

											{/* Clickable area for details */}
											<div
												className="absolute inset-0 cursor-pointer"
												onClick={() =>
													setSelectedItemForDetails({
														type: item.item_type,
														id: item.item_id,
													})
												}
											/>

											{/* Info */}
											<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-3 pointer-events-none">
												<h3 className="text-white font-bold text-sm line-clamp-2">{item.item_title}</h3>
											</div>
										</div>
									)
								})}
							</div>
						)}
					</div>
				</div>

				{/* Search & Add Dialog - dla pojedynczej kolekcji */}
				<Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
					<DialogContent className="border-2 border-border max-w-4xl max-h-[80vh]">
						<DialogHeader>
							<DialogTitle className="text-2xl font-heading font-bold">
								{language === 'pl' ? 'Dodaj do kolekcji' : 'Add to Collection'}
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 py-4">
							{/* Search Type Tabs */}
							<div className="flex gap-2">
								<Badge
									variant={searchType === 'movie' ? 'default' : 'secondary'}
									className="px-4 py-2 cursor-pointer brutal-shadow hover:translate-x-1 hover:translate-y-1 transition-transform"
									onClick={() => setSearchType('movie')}>
									{language === 'pl' ? 'Filmy' : 'Movies'}
								</Badge>
								<Badge
									variant={searchType === 'series' ? 'default' : 'secondary'}
									className="px-4 py-2 cursor-pointer brutal-shadow hover:translate-x-1 hover:translate-y-1 transition-transform"
									onClick={() => setSearchType('series')}>
									{language === 'pl' ? 'Seriale' : 'Series'}
								</Badge>
								<Badge
									variant={searchType === 'game' ? 'default' : 'secondary'}
									className="px-4 py-2 cursor-pointer brutal-shadow hover:translate-x-1 hover:translate-y-1 transition-transform"
									onClick={() => setSearchType('game')}>
									{language === 'pl' ? 'Gry' : 'Games'}
								</Badge>
							</div>

							{/* Search Input */}
							<div className="relative">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
								<Input
									placeholder={language === 'pl' ? 'Szukaj...' : 'Search...'}
									className="pl-12 h-12 text-lg border-2 border-border"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
								/>
							</div>

							{/* Search Results */}
							<div className="max-h-96 overflow-y-auto custom-scrollbar space-y-2">
								{searchQuery.length === 0 ? (
									<div className="text-center py-12 text-muted-foreground">
										{language === 'pl' ? 'Wpisz nazwę aby wyszukać' : 'Type to search'}
									</div>
								) : searchResults.length === 0 ? (
									<div className="text-center py-12 text-muted-foreground">
										{language === 'pl' ? 'Nie znaleziono wyników' : 'No results found'}
									</div>
								) : (
									searchResults.map((item: any) => {
										const isGame = searchType === 'game'
										const title = item.title || item.name
										const rating = item.vote_average || item.rating || 0
										const image = isGame ? item.background_image : getTMDBImageUrl(item.poster_path, 'w200')

										return (
											<button
												key={item.id}
												onClick={async () => {
													if (!selectedCollectionId) return
													try {
														await addToCollection.mutateAsync({
															collectionId: selectedCollectionId,
															itemType: searchType,
															itemId: item.id,
															itemTitle: title,
															itemPoster: image,
														})
														toast({
															title: language === 'pl' ? 'Dodano' : 'Added',
															description: `"${title}" ${
																language === 'pl' ? 'dodano do kolekcji' : 'added to collection'
															}`,
														})
														setIsSearchDialogOpen(false)
														setSearchQuery('')
													} catch (error) {
														toast({
															title: language === 'pl' ? 'Błąd' : 'Error',
															description: language === 'pl' ? 'Nie udało się dodać' : 'Failed to add',
															variant: 'destructive',
														})
													}
												}}
												className="w-full flex items-center gap-4 p-3 rounded-sm border-2 border-border hover:bg-accent transition-colors text-left">
												<img
													src={image || 'https://via.placeholder.com/100x150'}
													alt={title}
													className="w-16 h-24 object-cover rounded-sm border-2 border-border"
												/>
												<div className="flex-1">
													<h3 className="font-bold text-lg line-clamp-1">{title}</h3>
													<div className="flex items-center gap-2 mt-1">
														<Star className="text-yellow-400 fill-yellow-400" size={16} />
														<span className="font-semibold">{rating.toFixed(1)}</span>
													</div>
													{item.release_date && (
														<p className="text-sm text-muted-foreground mt-1">
															{new Date(item.release_date).getFullYear()}
														</p>
													)}
													{item.first_air_date && (
														<p className="text-sm text-muted-foreground mt-1">
															{new Date(item.first_air_date).getFullYear()}
														</p>
													)}
													{item.released && (
														<p className="text-sm text-muted-foreground mt-1">
															{new Date(item.released).getFullYear()}
														</p>
													)}
												</div>
												<Plus size={24} className="text-primary" />
											</button>
										)
									})
								)}
							</div>
						</div>
					</DialogContent>
				</Dialog>

				{/* Movie/TV Details Modal */}
				<Dialog
					open={selectedItemForDetails?.type === 'movie' && !!selectedItemForDetails}
					onOpenChange={() => setSelectedItemForDetails(null)}>
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
				<Dialog
					open={selectedItemForDetails?.type === 'game' && !!selectedItemForDetails}
					onOpenChange={() => setSelectedItemForDetails(null)}>
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

				{/* Delete Confirmation Dialog */}
				<Dialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
					<DialogContent className="border-2 border-border">
						<DialogHeader>
							<DialogTitle className="text-2xl font-heading font-bold">
								{language === 'pl' ? 'Potwierdź usunięcie' : 'Confirm Deletion'}
							</DialogTitle>
						</DialogHeader>
						<div className="py-4">
							<p className="text-lg">
								{language === 'pl' ? 'Czy na pewno chcesz usunąć' : 'Are you sure you want to remove'}{' '}
								<span className="font-bold">"{itemToDelete?.title}"</span>{' '}
								{language === 'pl' ? 'z tej kolekcji?' : 'from this collection?'}
							</p>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setItemToDelete(null)}>
								{language === 'pl' ? 'Anuluj' : 'Cancel'}
							</Button>
							<Button variant="destructive" onClick={handleRemoveItem}>
								<Trash2 size={18} className="mr-2" />
								{language === 'pl' ? 'Usuń' : 'Delete'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</Layout>
		)
	}

	// Widok listy kolekcji
	return (
		<Layout>
			<div className="min-h-screen p-4 sm:p-6 lg:p-12">
				<div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
					{/* Header */}
					<div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 lg:pb-6 border-b-4 border-primary">
						<div className="space-y-2 flex-1">
							<h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
								{language === 'pl' ? 'Moje Kolekcje' : 'My Collections'}
							</h1>
							<p className="text-sm sm:text-base lg:text-xl text-muted-foreground">
								{language === 'pl'
									? 'Twórz własne foldery i organizuj swoje media'
									: 'Create custom folders and organize your media'}
							</p>
						</div>
						<Button
							variant="brutal"
							size="lg"
							onClick={() => setIsCreateDialogOpen(true)}
							className="w-full sm:w-auto flex-shrink-0">
							<Plus size={18} className="mr-2" />
							<span className="hidden sm:inline">{language === 'pl' ? 'Nowa Kolekcja' : 'New Collection'}</span>
							<span className="sm:hidden">{language === 'pl' ? 'Nowa' : 'New'}</span>
						</Button>
					</div>

					{/* Collections Grid */}
					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
							{[...Array(8)].map((_, i) => (
								<div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-sm border-2 border-border" />
							))}
						</div>
					) : !collections || collections.length === 0 ? (
						<div className="text-center py-12 sm:py-16 lg:py-20 space-y-3 lg:space-y-4 px-4">
							<Folder size={48} className="mx-auto text-muted-foreground sm:w-16 sm:h-16" />
							<p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground">
								{language === 'pl' ? 'Nie masz jeszcze żadnych kolekcji' : "You don't have any collections yet"}
							</p>
							<p className="text-sm sm:text-base text-muted-foreground">
								{language === 'pl' ? 'Utwórz swoją pierwszą kolekcję' : 'Create your first collection'}
							</p>
							<Button
								variant="brutal"
								size="lg"
								onClick={() => setIsCreateDialogOpen(true)}
								className="w-full sm:w-auto">
								<Plus size={18} className="mr-2" />
								{language === 'pl' ? 'Utwórz Kolekcję' : 'Create Collection'}
							</Button>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
							{collections.map(collection => (
								<div
									key={collection.id}
									onClick={() => setSelectedCollectionId(collection.id)}
									className="group relative aspect-[4/3] rounded-sm border-2 border-border overflow-hidden brutal-shadow-hover cursor-pointer bg-gradient-to-br from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 transition-all">
									<div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
										<Folder size={48} className="text-primary mb-4" />
										<h3 className="font-heading font-bold text-xl mb-2 line-clamp-2">{collection.name}</h3>
										{collection.description && (
											<p className="text-sm text-muted-foreground line-clamp-2 mb-3">{collection.description}</p>
										)}
										<p className="text-xs mono text-muted-foreground">
											{collection.items_count || 0} {language === 'pl' ? 'elementów' : 'items'}
										</p>
									</div>

									{/* Delete button */}
									<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
										<Button
											size="icon"
											variant="destructive"
											className="h-8 w-8 border-2 border-border shadow-lg"
											onClick={e => {
												e.stopPropagation()
												setCollectionToDelete({ id: collection.id, name: collection.name })
											}}>
											<Trash2 size={16} />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Create Collection Dialog */}
			<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
				<DialogContent className="border-2 border-border">
					<DialogHeader>
						<DialogTitle className="text-2xl font-heading font-bold">
							{language === 'pl' ? 'Nowa Kolekcja' : 'New Collection'}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">{language === 'pl' ? 'Nazwa' : 'Name'}</Label>
							<Input
								id="name"
								placeholder={language === 'pl' ? 'np. Ulubione Filmy' : 'e.g. Favorite Movies'}
								value={newCollectionName}
								onChange={e => setNewCollectionName(e.target.value)}
								className="border-2 border-border"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">{language === 'pl' ? 'Opis (opcjonalnie)' : 'Description (optional)'}</Label>
							<Textarea
								id="description"
								placeholder={language === 'pl' ? 'Krótki opis kolekcji...' : 'Short description...'}
								value={newCollectionDescription}
								onChange={e => setNewCollectionDescription(e.target.value)}
								className="border-2 border-border resize-none"
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
							{language === 'pl' ? 'Anuluj' : 'Cancel'}
						</Button>
						<Button variant="brutal" onClick={handleCreateCollection} disabled={createCollection.isPending}>
							{createCollection.isPending
								? language === 'pl'
									? 'Tworzenie...'
									: 'Creating...'
								: language === 'pl'
								? 'Utwórz'
								: 'Create'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Collection Confirmation Dialog */}
			<Dialog open={!!collectionToDelete} onOpenChange={() => setCollectionToDelete(null)}>
				<DialogContent className="border-2 border-border">
					<DialogHeader>
						<DialogTitle className="text-2xl font-heading font-bold">
							{language === 'pl' ? 'Potwierdź usunięcie' : 'Confirm Deletion'}
						</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<p className="text-lg">
							{language === 'pl'
								? 'Czy na pewno chcesz usunąć kolekcję'
								: 'Are you sure you want to delete the collection'}{' '}
							<span className="font-bold">"{collectionToDelete?.name}"</span>?
						</p>
						<p className="text-sm text-muted-foreground mt-2">
							{language === 'pl'
								? 'Wszystkie elementy w tej kolekcji zostaną usunięte. Ta akcja jest nieodwracalna.'
								: 'All items in this collection will be removed. This action cannot be undone.'}
						</p>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setCollectionToDelete(null)}>
							{language === 'pl' ? 'Anuluj' : 'Cancel'}
						</Button>
						<Button variant="destructive" onClick={handleDeleteCollection}>
							<Trash2 size={18} className="mr-2" />
							{language === 'pl' ? 'Usuń kolekcję' : 'Delete Collection'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Layout>
	)
}

export default Collection
