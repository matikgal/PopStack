import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { Badge } from '@/components/ui/badge'
import { Star, Trash2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useWatchlist, useRemoveFromWatchlist } from '@/hooks/useWatchlist'
import { getTMDBImageUrl } from '@/services/tmdb'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

type FilterType = 'all' | 'movie' | 'series' | 'game'

const Watchlist = () => {
	const { language } = useLanguage()
	const { toast } = useToast()
	const [filter, setFilter] = useState<FilterType>('all')

	const filterType = filter === 'all' ? undefined : filter
	const { data: watchlistItems, isLoading } = useWatchlist(filterType as any)
	const removeFromWatchlist = useRemoveFromWatchlist()

	const handleRemove = async (itemType: string, itemId: number, title: string) => {
		try {
			await removeFromWatchlist.mutateAsync({ itemType, itemId })
			toast({
				title: language === 'pl' ? 'Usunięto' : 'Removed',
				description: `"${title}" ${language === 'pl' ? 'usunięto z listy' : 'removed from watchlist'}`,
			})
		} catch (error) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Nie udało się usunąć' : 'Failed to remove',
				variant: 'destructive',
			})
		}
	}

	return (
		<Layout>
			<div className="min-h-screen p-4 sm:p-6 lg:p-12">
				<div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
					{/* Header */}
					<div className="space-y-3 lg:space-y-4 pb-4 lg:pb-6 border-b-4 border-primary">
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
							{language === 'pl' ? 'Moja Lista' : 'My List'}
						</h1>
						<p className="text-sm sm:text-base lg:text-xl text-muted-foreground">
							{language === 'pl'
								? 'Filmy, seriale i gry, które chcesz obejrzeć lub zagrać'
								: 'Movies, series, and games you want to watch or play'}
						</p>
					</div>

					{/* Filters */}
					<div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
						<Badge
							variant={filter === 'all' ? 'default' : 'secondary'}
							className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer brutal-shadow hover:translate-x-1 hover:translate-y-1 transition-transform text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
							onClick={() => setFilter('all')}>
							{language === 'pl' ? 'Wszystko' : 'All'}
						</Badge>
						<Badge
							variant={filter === 'movie' ? 'default' : 'secondary'}
							className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer brutal-shadow hover:translate-x-1 hover:translate-y-1 transition-transform text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
							onClick={() => setFilter('movie')}>
							{language === 'pl' ? 'Filmy' : 'Movies'}
						</Badge>
						<Badge
							variant={filter === 'series' ? 'default' : 'secondary'}
							className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer brutal-shadow hover:translate-x-1 hover:translate-y-1 transition-transform text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
							onClick={() => setFilter('series')}>
							{language === 'pl' ? 'Seriale' : 'Series'}
						</Badge>
						<Badge
							variant={filter === 'game' ? 'default' : 'secondary'}
							className="px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer brutal-shadow hover:translate-x-1 hover:translate-y-1 transition-transform text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
							onClick={() => setFilter('game')}>
							{language === 'pl' ? 'Gry' : 'Games'}
						</Badge>
					</div>

					{/* Content */}
					{isLoading ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
							{[...Array(10)].map((_, i) => (
								<div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-sm border-2 border-border" />
							))}
						</div>
					) : !watchlistItems || watchlistItems.length === 0 ? (
						<div className="text-center py-12 sm:py-16 lg:py-20 space-y-3 lg:space-y-4 px-4">
							<p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground">
								{language === 'pl' ? 'Twoja lista jest pusta' : 'Your watchlist is empty'}
							</p>
							<p className="text-sm sm:text-base text-muted-foreground">
								{language === 'pl'
									? 'Dodaj filmy, seriale lub gry z zakładki Odkrywaj'
									: 'Add movies, series, or games from the Discover page'}
							</p>
						</div>
					) : (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
							{watchlistItems.map(item => {
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
										<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<Button
												size="icon"
												variant="destructive"
												className="h-9 w-9 border-2 border-border shadow-lg"
												onClick={() => handleRemove(item.item_type, item.item_id, item.item_title)}>
												<Trash2 size={18} />
											</Button>
										</div>

										{/* Info */}
										<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-3">
											<h3 className="text-white font-bold text-sm line-clamp-2 mb-1">{item.item_title}</h3>
											{item.item_rating && (
												<div className="flex items-center gap-1">
													<Star className="text-yellow-400 fill-yellow-400" size={14} />
													<span className="text-white text-xs font-semibold">{item.item_rating.toFixed(1)}</span>
												</div>
											)}
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>
			</div>
		</Layout>
	)
}

export default Watchlist
