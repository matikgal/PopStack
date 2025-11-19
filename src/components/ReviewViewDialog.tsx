import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Star, Calendar, Clock, Gamepad2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ReviewViewDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	review: {
		rating: number
		review_text?: string | null
		watched_date?: string | null
		hours_played?: number | null
		platform?: string | null
		movie_title?: string
		series_title?: string
		game_title?: string
		movie_poster?: string
		series_poster?: string
		game_cover?: string
	} | null
	type: 'movie' | 'series' | 'game'
}

export const ReviewViewDialog = ({ open, onOpenChange, review, type }: ReviewViewDialogProps) => {
	const { language } = useLanguage()

	if (!review) return null

	const title = review.movie_title || review.series_title || review.game_title || ''
	const poster = review.movie_poster || review.series_poster || review.game_cover || ''

	const getTypeLabel = () => {
		if (type === 'movie') return language === 'pl' ? 'filmu' : 'movie'
		if (type === 'series') return language === 'pl' ? 'serialu' : 'series'
		return language === 'pl' ? 'gry' : 'game'
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl border-2 border-border">
				<DialogHeader>
					<DialogTitle className="text-2xl font-heading font-bold">
						{language === 'pl' ? `Recenzja ${getTypeLabel()}` : `${getTypeLabel()} review`}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Tytuł i poster */}
					<div className="flex gap-4">
						{poster && (
							<img
								src={poster}
								alt={title}
								className="w-24 h-36 object-cover rounded border-2 border-border flex-shrink-0"
							/>
						)}
						<div className="flex-1 space-y-3">
							<h3 className="text-xl font-bold">{title}</h3>

							{/* Ocena */}
							<div className="flex items-center gap-2">
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
										<Star
											key={star}
											size={20}
											className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}
										/>
									))}
								</div>
								<span className="text-lg font-bold">{review.rating}/10</span>
							</div>

							{/* Dodatkowe informacje */}
							<div className="space-y-2 text-sm text-muted-foreground">
								{review.watched_date && (
									<div className="flex items-center gap-2">
										<Calendar size={16} />
										<span>
											{type === 'game'
												? language === 'pl'
													? 'Data zagrania:'
													: 'Date played:'
												: language === 'pl'
												? 'Data obejrzenia:'
												: 'Date watched:'}{' '}
											{new Date(review.watched_date).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}
										</span>
									</div>
								)}
								{type === 'game' && review.hours_played && (
									<div className="flex items-center gap-2">
										<Clock size={16} />
										<span>
											{language === 'pl' ? 'Godziny gry:' : 'Hours played:'} {review.hours_played}h
										</span>
									</div>
								)}
								{type === 'game' && review.platform && (
									<div className="flex items-center gap-2">
										<Gamepad2 size={16} />
										<span>
											{language === 'pl' ? 'Platforma:' : 'Platform:'} {review.platform}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Recenzja tekstowa */}
					{review.review_text && (
						<div className="space-y-2">
							<h4 className="font-semibold text-base">{language === 'pl' ? 'Opinia:' : 'Review:'}</h4>
							<div className="p-4 bg-muted rounded border-2 border-border">
								<p className="text-sm leading-relaxed whitespace-pre-wrap">{review.review_text}</p>
							</div>
						</div>
					)}

					{!review.review_text && (
						<div className="text-center py-4 text-muted-foreground">
							<p>{language === 'pl' ? 'Brak opinii tekstowej' : 'No text review'}</p>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
