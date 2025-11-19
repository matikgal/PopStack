import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/types/database'

type GameReview = Database['public']['Tables']['game_reviews']['Row']
type GameReviewInsert = Database['public']['Tables']['game_reviews']['Insert']

export const useGameReviews = () => {
	const { user } = useAuth()
	const { toast } = useToast()
	const queryClient = useQueryClient()

	const { data: reviews, isLoading } = useQuery({
		queryKey: ['game-reviews', user?.id],
		queryFn: async () => {
			if (!user) return []

			const { data, error } = await supabase
				.from('game_reviews')
				.select('*')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false })

			if (error) throw error
			return data as GameReview[]
		},
		enabled: !!user,
	})

	const addReview = useMutation({
		mutationFn: async (review: Omit<GameReviewInsert, 'user_id'>) => {
			if (!user) throw new Error('User not authenticated')

			const { data, error } = await supabase
				.from('game_reviews')
				.insert({ ...review, user_id: user.id })
				.select()
				.single()

			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['game-reviews'] })
			toast({
				title: 'Success!',
				description: 'Game review added successfully',
			})
		},
		onError: error => {
			toast({
				title: 'Error',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	const updateReview = useMutation({
		mutationFn: async ({ id, ...updates }: Partial<GameReview> & { id: string }) => {
			const { data, error } = await supabase.from('game_reviews').update(updates).eq('id', id).select().single()

			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['game-reviews'] })
			toast({
				title: 'Success!',
				description: 'Review updated successfully',
			})
		},
	})

	const deleteReview = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase.from('game_reviews').delete().eq('id', id)

			if (error) throw error
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['game-reviews'] })
			toast({
				title: 'Success!',
				description: 'Review deleted successfully',
			})
		},
	})

	return {
		reviews,
		isLoading,
		addReview: addReview.mutate,
		updateReview: updateReview.mutate,
		deleteReview: deleteReview.mutate,
	}
}
