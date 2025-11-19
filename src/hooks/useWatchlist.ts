import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_MODE, DEMO_WATCHLIST } from '@/lib/demoMode'

export interface WatchlistItem {
	id: string
	user_id: string
	item_type: 'movie' | 'series' | 'game'
	item_id: number
	item_title: string
	item_poster: string | null
	item_rating: number | null
	added_at: string
}

// Pobierz watchlistę użytkownika
export const useWatchlist = (itemType?: 'movie' | 'series' | 'game') => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['watchlist', user?.id, itemType],
		queryFn: async () => {
			if (!user) throw new Error('User not authenticated')

			// Demo mode - return fake watchlist
			if (DEMO_MODE) {
				const watchlist = DEMO_WATCHLIST as WatchlistItem[]
				return itemType ? watchlist.filter(item => item.item_type === itemType) : watchlist
			}

			let query = supabase.from('watchlist').select('*').eq('user_id', user.id).order('added_at', { ascending: false })

			if (itemType) {
				query = query.eq('item_type', itemType)
			}

			const { data, error } = await query

			if (error) throw error
			return data as WatchlistItem[]
		},
		enabled: !!user,
	})
}

// Sprawdź czy item jest w watchliście
export const useIsInWatchlist = (itemType: string, itemId: number) => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['watchlist-check', user?.id, itemType, itemId],
		queryFn: async () => {
			if (!user) return false

			const { data, error } = await supabase
				.from('watchlist')
				.select('id')
				.eq('user_id', user.id)
				.eq('item_type', itemType)
				.eq('item_id', itemId)
				.maybeSingle()

			if (error) throw error
			return !!data
		},
		enabled: !!user,
	})
}

// Dodaj do watchlisty
export const useAddToWatchlist = () => {
	const { user } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			itemType,
			itemId,
			itemTitle,
			itemPoster,
			itemRating,
		}: {
			itemType: 'movie' | 'series' | 'game'
			itemId: number
			itemTitle: string
			itemPoster?: string
			itemRating?: number
		}) => {
			if (!user) throw new Error('User not authenticated')

			const { data, error } = await supabase
				.from('watchlist')
				.insert({
					user_id: user.id,
					item_type: itemType,
					item_id: itemId,
					item_title: itemTitle,
					item_poster: itemPoster || null,
					item_rating: itemRating || null,
				})
				.select()
				.single()

			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['watchlist'] })
			queryClient.invalidateQueries({ queryKey: ['watchlist-check'] })
		},
	})
}

// Usuń z watchlisty
export const useRemoveFromWatchlist = () => {
	const { user } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ itemType, itemId }: { itemType: string; itemId: number }) => {
			if (!user) throw new Error('User not authenticated')

			const { error } = await supabase
				.from('watchlist')
				.delete()
				.eq('user_id', user.id)
				.eq('item_type', itemType)
				.eq('item_id', itemId)

			if (error) throw error
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['watchlist'] })
			queryClient.invalidateQueries({ queryKey: ['watchlist-check'] })
		},
	})
}
