import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Database } from '@/types/database'

type UserStats = Database['public']['Tables']['user_stats']['Row']

export const useUserStats = () => {
	const { user } = useAuth()
	const queryClient = useQueryClient()

	const { data: stats, isLoading } = useQuery({
		queryKey: ['user-stats', user?.id],
		queryFn: async () => {
			if (!user) return null

			const { data, error } = await supabase.from('user_stats').select('*').eq('user_id', user.id).single()

			if (error && error.code !== 'PGRST116') throw error
			return data as UserStats | null
		},
		enabled: !!user,
	})

	const updateStats = useMutation({
		mutationFn: async (updates: Partial<Omit<UserStats, 'id' | 'user_id'>>) => {
			if (!user) throw new Error('User not authenticated')

			const { data, error } = await supabase
				.from('user_stats')
				.upsert({
					user_id: user.id,
					...updates,
					updated_at: new Date().toISOString(),
				})
				.select()
				.single()

			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-stats'] })
		},
	})

	return {
		stats,
		isLoading,
		updateStats: updateStats.mutate,
	}
}
