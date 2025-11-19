import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Star, Trash2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAddOrUpdateReview, useDeleteReview, useUserReview } from '@/hooks/useReviews'
import { useToast } from '@/hooks/use-toast'

interface ReviewDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	itemType: 'movie' | 'series' | 'game'
	itemId: number
	itemTitle: string
	itemPoster: string | null
}

export const ReviewDialog = ({ open, onOpenChange, itemType, itemId, itemTitle, itemPoster }: ReviewDialogProps) => {
	const { language } = useLanguage()
	const { toast } = useToast()

	const [rating, setRating] = useState(0)
	const [hoverRating, setHoverRating] = useState(0)
	const [reviewText, setReviewText] = useState('')
	const [watchedDate, setWatchedDate] = useState('')
	const [hoursPlayed, setHoursPlayed] = useState('')
	const [platform, setPlatform] = useState('')

	const { data: existingReview } = useUserReview(itemType, itemId)
	const addOrUpdateReview = useAddOrUpdateReview()
	const deleteReview = useDeleteReview()

	// Załaduj istniejącą recenzję
	useEffect(() => {
		if (existingReview) {
			setRating(existingReview.rating)
			setReviewText(existingReview.review_text || '')
			setWatchedDate(existingReview.watched_date || '')
			if (itemType === 'game') {
				setHoursPlayed(existingReview.hours_played?.toString() || '')
				setPlatform(existingReview.platform || '')
			}
		} else {
			// Reset formularza
			setRating(0)
			setReviewText('')
			setWatchedDate('')
			setHoursPlayed('')
			setPlatform('')
		}
	}, [existingReview, itemType, open])

	const handleSubmit = async () => {
		if (rating === 0) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Wybierz ocenę' : 'Please select a rating',
				variant: 'destructive',
			})
			return
		}

		try {
			await addOrUpdateReview.mutateAsync({
				itemType,
				itemId,
				itemTitle,
				itemPoster,
				rating,
				reviewText: reviewText.trim() || undefined,
				watchedDate: watchedDate || undefined,
				hoursPlayed: hoursPlayed ? parseInt(hoursPlayed) : undefined,
				platform: platform || undefined,
			})

			toast({
				title: language === 'pl' ? 'Zapisano' : 'Saved',
				description: language === 'pl' ? 'Twoja recenzja została zapisana' : 'Your review has been saved',
			})

			onOpenChange(false)
		} catch (error) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Nie udało się zapisać recenzji' : 'Failed to save review',
				variant: 'destructive',
			})
		}
	}

	const handleDelete = async () => {
		try {
			await deleteReview.mutateAsync({ itemType, itemId })

			toast({
				title: language === 'pl' ? 'Usunięto' : 'Deleted',
				description: language === 'pl' ? 'Recenzja została usunięta' : 'Review has been deleted',
			})

			onOpenChange(false)
		} catch (error) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Nie udało się usunąć recenzji' : 'Failed to delete review',
				variant: 'destructive',
			})
		}
	}

	const getTypeLabel = () => {
		if (itemType === 'movie') return language === 'pl' ? 'filmu' : 'movie'
		if (itemType === 'series') return language === 'pl' ? 'serialu' : 'series'
		return language === 'pl' ? 'gry' : 'game'
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl border-2 border-border">
				<DialogHeader>
					<DialogTitle className="text-2xl font-heading font-bold">
						{language === 'pl' ? `Oceń ${getTypeLabel()}` : `Rate ${getTypeLabel()}`}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Tytuł */}
					<div>
						<h3 className="text-lg font-semibold mb-2">{itemTitle}</h3>
					</div>

					{/* Ocena */}
					<div className="space-y-2">
						<Label className="text-base font-semibold">{language === 'pl' ? 'Twoja ocena' : 'Your rating'} *</Label>
						<div className="flex gap-2">
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoverRating(star)}
									onMouseLeave={() => setHoverRating(0)}
									className="transition-transform hover:scale-110">
									<Star
										size={32}
										className={
											star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
										}
									/>
								</button>
							))}
						</div>
						<p className="text-sm text-muted-foreground">{rating > 0 && `${rating}/10`}</p>
					</div>

					{/* Data obejrzenia/zagrania */}
					<div className="space-y-2">
						<Label htmlFor="watchedDate" className="text-base font-semibold">
							{itemType === 'game'
								? language === 'pl'
									? 'Data zagrania'
									: 'Date played'
								: language === 'pl'
								? 'Data obejrzenia'
								: 'Date watched'}
						</Label>
						<Input
							id="watchedDate"
							type="date"
							value={watchedDate}
							onChange={e => setWatchedDate(e.target.value)}
							className="border-2"
						/>
					</div>

					{/* Pola specyficzne dla gier */}
					{itemType === 'game' && (
						<>
							<div className="space-y-2">
								<Label htmlFor="hoursPlayed" className="text-base font-semibold">
									{language === 'pl' ? 'Godziny gry' : 'Hours played'}
								</Label>
								<Input
									id="hoursPlayed"
									type="number"
									min="0"
									value={hoursPlayed}
									onChange={e => setHoursPlayed(e.target.value)}
									placeholder="0"
									className="border-2"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="platform" className="text-base font-semibold">
									{language === 'pl' ? 'Platforma' : 'Platform'}
								</Label>
								<Input
									id="platform"
									type="text"
									value={platform}
									onChange={e => setPlatform(e.target.value)}
									placeholder="PC, PlayStation, Xbox..."
									className="border-2"
								/>
							</div>
						</>
					)}

					{/* Recenzja tekstowa */}
					<div className="space-y-2">
						<Label htmlFor="reviewText" className="text-base font-semibold">
							{language === 'pl' ? 'Twoja opinia' : 'Your review'}{' '}
							<span className="text-muted-foreground font-normal">
								({language === 'pl' ? 'opcjonalne' : 'optional'})
							</span>
						</Label>
						<Textarea
							id="reviewText"
							value={reviewText}
							onChange={e => setReviewText(e.target.value)}
							placeholder={language === 'pl' ? 'Podziel się swoją opinią...' : 'Share your thoughts...'}
							rows={5}
							className="border-2 resize-none"
						/>
						<p className="text-xs text-muted-foreground">
							{reviewText.length} {language === 'pl' ? 'znaków' : 'characters'}
						</p>
					</div>

					{/* Przyciski */}
					<div className="flex gap-3 pt-4">
						<Button
							variant="brutal"
							size="lg"
							onClick={handleSubmit}
							disabled={addOrUpdateReview.isPending}
							className="flex-1">
							{addOrUpdateReview.isPending
								? language === 'pl'
									? 'Zapisywanie...'
									: 'Saving...'
								: existingReview
								? language === 'pl'
									? 'Zaktualizuj'
									: 'Update'
								: language === 'pl'
								? 'Zapisz'
								: 'Save'}
						</Button>

						{existingReview && (
							<Button variant="destructive" size="lg" onClick={handleDelete} disabled={deleteReview.isPending}>
								<Trash2 size={18} />
							</Button>
						)}

						<Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
							{language === 'pl' ? 'Anuluj' : 'Cancel'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
