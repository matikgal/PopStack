import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

type MediaType = 'movie' | 'series' | 'game'

interface ReviewData {
	itemType: MediaType
	itemId: number
	itemTitle: string
	itemPoster: string | null
	rating: number
	reviewText?: string
	watchedDate?: string
	hoursPlayed?: number
	platform?: string
}

// Pobierz recenzję użytkownika dla danego elementu
export const useUserReview = (itemType: MediaType, itemId: number) => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['userReview', itemType, itemId, user?.id],
		queryFn: async () => {
			if (!user?.id) return null

			const tableName = `${itemType}_reviews`
			const idColumn = `${itemType}_id`

			const { data, error } = await supabase
				.from(tableName)
				.select('*')
				.eq('user_id', user.id)
				.eq(idColumn, itemId)
				.maybeSingle()

			if (error && error.code !== 'PGRST116') throw error
			return data
		},
		enabled: !!user?.id && !!itemId,
	})
}

// Dodaj lub zaktualizuj recenzję
export const useAddOrUpdateReview = () => {
	const queryClient = useQueryClient()
	const { user } = useAuth()

	return useMutation({
		mutationFn: async (reviewData: ReviewData) => {
			if (!user?.id) throw new Error('Not authenticated')

			const { itemType, itemId, itemTitle, itemPoster, rating, reviewText, watchedDate, hoursPlayed, platform } =
				reviewData

			const tableName = `${itemType}_reviews`
			const idColumn = `${itemType}_id`
			const titleColumn = `${itemType}_title`
			const posterColumn = `${itemType}_poster`

			// Sprawdź czy recenzja już istnieje
			const { data: existing } = await supabase
				.from(tableName)
				.select('id')
				.eq('user_id', user.id)
				.eq(idColumn, itemId)
				.maybeSingle()

			const reviewPayload: any = {
				user_id: user.id,
				[idColumn]: itemId,
				[titleColumn]: itemTitle,
				[posterColumn]: itemPoster,
				rating,
				review_text: reviewText || null,
				watched_date: watchedDate || null,
			}

			// Dodaj pola specyficzne dla gier
			if (itemType === 'game') {
				reviewPayload.hours_played = hoursPlayed || null
				reviewPayload.platform = platform || null
			}

			if (existing) {
				// Aktualizuj istniejącą recenzję
				const { data, error } = await supabase.from(tableName).update(reviewPayload).eq('id', existing.id).select()

				if (error) throw error
				return data
			} else {
				// Dodaj nową recenzję
				const { data, error } = await supabase.from(tableName).insert(reviewPayload).select()

				if (error) throw error
				return data
			}
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['userReview', variables.itemType, variables.itemId] })
			queryClient.invalidateQueries({ queryKey: ['userReviews'] })
		},
	})
}

// Usuń recenzję
export const useDeleteReview = () => {
	const queryClient = useQueryClient()
	const { user } = useAuth()

	return useMutation({
		mutationFn: async ({ itemType, itemId }: { itemType: MediaType; itemId: number }) => {
			if (!user?.id) throw new Error('Not authenticated')

			const tableName = `${itemType}_reviews`
			const idColumn = `${itemType}_id`

			const { error } = await supabase.from(tableName).delete().eq('user_id', user.id).eq(idColumn, itemId)

			if (error) throw error
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['userReview', variables.itemType, variables.itemId] })
			queryClient.invalidateQueries({ queryKey: ['userReviews'] })
		},
	})
}

// Pobierz wszystkie recenzje użytkownika
export const useUserReviews = () => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['userReviews', user?.id],
		queryFn: async () => {
			if (!user?.id) return []

			// Pobierz wszystkie typy recenzji
			const [movies, series, games] = await Promise.all([
				supabase.from('movie_reviews').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
				supabase.from('series_reviews').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
				supabase.from('game_reviews').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
			])

			const allReviews = [
				...(movies.data?.map(r => ({ ...r, type: 'movie' as const })) || []),
				...(series.data?.map(r => ({ ...r, type: 'series' as const })) || []),
				...(games.data?.map(r => ({ ...r, type: 'game' as const })) || []),
			]

			// Sortuj po dacie utworzenia
			return allReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
		},
		enabled: !!user?.id,
	})
}
