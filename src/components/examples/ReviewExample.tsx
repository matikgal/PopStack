// PRZYKŁAD UŻYCIA - Komponent do dodawania recenzji filmu
// Możesz go użyć jako wzór w swoich komponentach

import { useState } from 'react'
import { useMovieReviews } from '@/hooks/useMovieReviews'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const AddMovieReviewExample = () => {
	const { addReview, reviews, isLoading } = useMovieReviews()
	const [movieId, setMovieId] = useState('')
	const [title, setTitle] = useState('')
	const [rating, setRating] = useState(5)
	const [reviewText, setReviewText] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		addReview({
			movie_id: parseInt(movieId),
			movie_title: title,
			movie_poster: null,
			rating: rating,
			review_text: reviewText,
			watched_date: new Date().toISOString().split('T')[0],
		})

		// Reset form
		setMovieId('')
		setTitle('')
		setRating(5)
		setReviewText('')
	}

	return (
		<div className="space-y-6">
			<div className="border-2 border-border p-6 rounded-lg">
				<h2 className="text-2xl font-bold mb-4">Dodaj recenzję filmu</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="movieId">ID filmu (z TMDB API)</Label>
						<Input id="movieId" type="number" value={movieId} onChange={e => setMovieId(e.target.value)} required />
					</div>

					<div>
						<Label htmlFor="title">Tytuł filmu</Label>
						<Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
					</div>

					<div>
						<Label htmlFor="rating">Ocena (1-10)</Label>
						<Input
							id="rating"
							type="number"
							min="1"
							max="10"
							value={rating}
							onChange={e => setRating(parseInt(e.target.value))}
							required
						/>
					</div>

					<div>
						<Label htmlFor="review">Recenzja</Label>
						<Textarea id="review" value={reviewText} onChange={e => setReviewText(e.target.value)} rows={4} />
					</div>

					<Button type="submit" variant="brutal">
						Dodaj recenzję
					</Button>
				</form>
			</div>

			<div className="border-2 border-border p-6 rounded-lg">
				<h2 className="text-2xl font-bold mb-4">Twoje recenzje</h2>

				{isLoading ? (
					<p>Ładowanie...</p>
				) : reviews && reviews.length > 0 ? (
					<div className="space-y-4">
						{reviews.map(review => (
							<div key={review.id} className="border p-4 rounded">
								<h3 className="font-bold text-lg">{review.movie_title}</h3>
								<p className="text-sm text-muted-foreground">Ocena: {review.rating}/10</p>
								{review.review_text && <p className="mt-2">{review.review_text}</p>}
								<p className="text-xs text-muted-foreground mt-2">
									{new Date(review.created_at).toLocaleDateString('pl-PL')}
								</p>
							</div>
						))}
					</div>
				) : (
					<p className="text-muted-foreground">Nie masz jeszcze żadnych recenzji</p>
				)}
			</div>
		</div>
	)
}
