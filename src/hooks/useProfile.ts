import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_MODE, DEMO_STATS, DEMO_MOVIES, DEMO_GAMES } from '@/lib/demoMode'

export interface UserStats {
	total_items: number
	total_ratings: number
	total_text_reviews: number
	watchlist_count: number
	collections_count: number
	total_movies_watched: number
	total_games_played: number
	total_hours_gaming: number
	total_reviews: number
}

// Pobierz statystyki użytkownika
export const useUserStats = () => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['user-stats', user?.id],
		queryFn: async () => {
			if (!user) throw new Error('User not authenticated')

			// Demo mode - return fake stats
			if (DEMO_MODE) {
				console.log('📊 DEMO MODE: Returning fake stats', DEMO_STATS)
				return DEMO_STATS as UserStats
			}

			// Pobierz wszystkie recenzje z tekstem
			const [movies, series, games, watchlist, collections] = await Promise.all([
				supabase.from('movie_reviews').select('review_text').eq('user_id', user.id),
				supabase.from('series_reviews').select('review_text').eq('user_id', user.id),
				supabase.from('game_reviews').select('review_text, hours_played').eq('user_id', user.id),
				supabase.from('watchlist').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
				supabase.from('collections').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
			])

			const allReviews = [...(movies.data || []), ...(series.data || []), ...(games.data || [])]

			const totalRatings = allReviews.length
			const totalTextReviews = allReviews.filter(r => r.review_text && r.review_text.trim()).length

			// Suma godzin grania
			const totalHours = (games.data || []).reduce((sum, game) => sum + (game.hours_played || 0), 0)

			return {
				total_items: totalRatings,
				total_ratings: totalRatings,
				total_text_reviews: totalTextReviews,
				watchlist_count: watchlist.count || 0,
				collections_count: collections.count || 0,
				total_movies_watched: (movies.data?.length || 0) + (series.data?.length || 0),
				total_games_played: games.data?.length || 0,
				total_hours_gaming: Math.round(totalHours),
				total_reviews: totalReviews,
			} as UserStats
		},
		enabled: !!user,
	})
}

// Pobierz ulubione filmy/gry użytkownika (najwyżej ocenione)
export const useFavoriteMedia = () => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['favorite-media', user?.id],
		queryFn: async () => {
			if (!user) throw new Error('User not authenticated')

			// Demo mode - return fake data
			if (DEMO_MODE) {
				console.log('🎮 DEMO MODE: Returning fake favorites', {
					movies: DEMO_MOVIES.slice(0, 6),
					games: DEMO_GAMES.slice(0, 4),
				})
				return {
					movies: DEMO_MOVIES.slice(0, 6),
					games: DEMO_GAMES.slice(0, 4),
				}
			}

			// Pobierz top 6 filmów
			const { data: movies } = await supabase
				.from('movie_reviews')
				.select('*')
				.eq('user_id', user.id)
				.order('rating', { ascending: false })
				.limit(3)

			// Pobierz top 3 gier
			const { data: games } = await supabase
				.from('game_reviews')
				.select('*')
				.eq('user_id', user.id)
				.order('rating', { ascending: false })
				.limit(3)

			return {
				movies: movies || [],
				games: games || [],
			}
		},
		enabled: !!user,
	})
}
