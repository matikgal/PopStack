import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/types/database'

type MovieReview = Database['public']['Tables']['movie_reviews']['Row']
type MovieReviewInsert = Database['public']['Tables']['movie_reviews']['Insert']

export const useMovieReviews = () => {
	const { user } = useAuth()
	const { toast } = useToast()
	const queryClient = useQueryClient()

	// Get all reviews for current user
	const { data: reviews, isLoading } = useQuery({
		queryKey: ['movie-reviews', user?.id],
		queryFn: async () => {
			if (!user) return []

			const { data, error } = await supabase
				.from('movie_reviews')
				.select('*')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false })

			if (error) throw error
			return data as MovieReview[]
		},
		enabled: !!user,
	})

	// Add new review
	const addReview = useMutation({
		mutationFn: async (review: Omit<MovieReviewInsert, 'user_id'>) => {
			if (!user) throw new Error('User not authenticated')

			const { data, error } = await supabase
				.from('movie_reviews')
				.insert({ ...review, user_id: user.id })
				.select()
				.single()

			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['movie-reviews'] })
			toast({
				title: 'Success!',
				description: 'Review added successfully',
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

	// Update review
	const updateReview = useMutation({
		mutationFn: async ({ id, ...updates }: Partial<MovieReview> & { id: string }) => {
			const { data, error } = await supabase.from('movie_reviews').update(updates).eq('id', id).select().single()

			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['movie-reviews'] })
			toast({
				title: 'Success!',
				description: 'Review updated successfully',
			})
		},
	})

	// Delete review
	const deleteReview = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase.from('movie_reviews').delete().eq('id', id)

			if (error) throw error
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['movie-reviews'] })
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
