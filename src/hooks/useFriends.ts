import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

// Pobierz listę znajomych (zaakceptowanych)
export const useFriends = () => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['friends', user?.id],
		queryFn: async () => {
			if (!user?.id) return []

			// Pobierz friendships
			const { data: friendships, error: friendshipsError } = await supabase
				.from('friendships')
				.select('*')
				.or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
				.eq('status', 'accepted')

			if (friendshipsError) throw friendshipsError
			if (!friendships || friendships.length === 0) return []

			// Pobierz profile znajomych
			const friendIds = friendships.map(f => (f.user_id === user.id ? f.friend_id : f.user_id))

			const { data: profiles, error: profilesError } = await supabase
				.from('profiles')
				.select('id, username, avatar_url')
				.in('id', friendIds)

			if (profilesError) throw profilesError

			// Połącz dane
			return friendships.map(friendship => {
				const friendId = friendship.user_id === user.id ? friendship.friend_id : friendship.user_id
				const friendProfile = profiles?.find(p => p.id === friendId) || {
					id: friendId,
					username: 'Unknown',
					avatar_url: null,
				}
				return {
					...friendship,
					friendProfile,
				}
			})
		},
		enabled: !!user?.id,
		staleTime: 5 * 60 * 1000, // Cache na 5 minut
		gcTime: 10 * 60 * 1000, // Trzymaj w pamięci 10 minut
		refetchOnWindowFocus: false, // Nie odświeżaj przy powrocie do okna
		refetchOnMount: false, // Nie odświeżaj przy montowaniu
	})
}

// Pobierz oczekujące zaproszenia (otrzymane)
export const usePendingFriendRequests = () => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['pendingFriendRequests', user?.id],
		queryFn: async () => {
			if (!user?.id) return []

			// Pobierz friendships
			const { data: friendships, error: friendshipsError } = await supabase
				.from('friendships')
				.select('*')
				.eq('friend_id', user.id)
				.eq('status', 'pending')

			if (friendshipsError) throw friendshipsError
			if (!friendships || friendships.length === 0) return []

			// Pobierz profile nadawców
			const userIds = friendships.map(f => f.user_id)

			const { data: profiles, error: profilesError } = await supabase
				.from('profiles')
				.select('id, username, avatar_url')
				.in('id', userIds)

			if (profilesError) throw profilesError

			// Połącz dane
			return friendships.map(friendship => ({
				...friendship,
				user: profiles?.find(p => p.id === friendship.user_id) || {
					id: friendship.user_id,
					username: 'Unknown',
					avatar_url: null,
				},
			}))
		},
		enabled: !!user?.id,
		staleTime: 2 * 60 * 1000, // Cache na 2 minuty
		gcTime: 5 * 60 * 1000, // Trzymaj w pamięci 5 minut
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	})
}

// Pobierz wysłane zaproszenia
export const useSentFriendRequests = () => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['sentFriendRequests', user?.id],
		queryFn: async () => {
			if (!user?.id) return []

			// Pobierz friendships
			const { data: friendships, error: friendshipsError } = await supabase
				.from('friendships')
				.select('*')
				.eq('user_id', user.id)
				.eq('status', 'pending')

			if (friendshipsError) throw friendshipsError
			if (!friendships || friendships.length === 0) return []

			// Pobierz profile odbiorców
			const friendIds = friendships.map(f => f.friend_id)

			const { data: profiles, error: profilesError } = await supabase
				.from('profiles')
				.select('id, username, avatar_url')
				.in('id', friendIds)

			if (profilesError) throw profilesError

			// Połącz dane
			return friendships.map(friendship => ({
				...friendship,
				friend: profiles?.find(p => p.id === friendship.friend_id) || {
					id: friendship.friend_id,
					username: 'Unknown',
					avatar_url: null,
				},
			}))
		},
		enabled: !!user?.id,
		staleTime: 5 * 60 * 1000, // Cache na 5 minut
		gcTime: 10 * 60 * 1000,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	})
}

// Wyślij zaproszenie do znajomych
export const useSendFriendRequest = () => {
	const queryClient = useQueryClient()
	const { user } = useAuth()

	return useMutation({
		mutationFn: async (friendId: string) => {
			if (!user?.id) throw new Error('Not authenticated')

			// Sprawdź czy zaproszenie już istnieje
			const { data: existing } = await supabase
				.from('friendships')
				.select('id, status')
				.or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`)
				.maybeSingle()

			if (existing) {
				if (existing.status === 'pending') {
					throw new Error('Request already sent')
				} else if (existing.status === 'accepted') {
					throw new Error('Already friends')
				}
			}

			const { data, error } = await supabase.from('friendships').insert({
				user_id: user.id,
				friend_id: friendId,
				status: 'pending',
			})

			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['sentFriendRequests'] })
			queryClient.invalidateQueries({ queryKey: ['friends'] })
		},
	})
}

// Akceptuj zaproszenie
export const useAcceptFriendRequest = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (friendshipId: string) => {
			const { data, error } = await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId)

			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['friends'] })
			queryClient.invalidateQueries({ queryKey: ['pendingFriendRequests'] })
		},
	})
}

// Odrzuć zaproszenie
export const useRejectFriendRequest = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (friendshipId: string) => {
			const { data, error } = await supabase.from('friendships').delete().eq('id', friendshipId)

			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pendingFriendRequests'] })
		},
	})
}

// Usuń znajomego
export const useRemoveFriend = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (friendshipId: string) => {
			const { data, error } = await supabase.from('friendships').delete().eq('id', friendshipId)

			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['friends'] })
		},
	})
}

// Wyszukaj użytkowników po username
export const useSearchUsers = (searchQuery: string) => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['searchUsers', searchQuery],
		queryFn: async () => {
			if (!searchQuery || searchQuery.length < 2) return []

			const { data, error } = await supabase
				.from('profiles')
				.select('id, username, avatar_url')
				.ilike('username', `%${searchQuery}%`)
				.neq('id', user?.id || '')
				.limit(10)

			if (error) throw error
			return data
		},
		enabled: searchQuery.length >= 2,
		staleTime: 30000, // Cache na 30 sekund
		gcTime: 60000,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	})
}

// Pobierz aktywności znajomych
export const useFriendActivities = () => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['friendActivities', user?.id],
		queryFn: async () => {
			if (!user?.id) return []

			const { data, error } = await supabase.from('friend_activities').select('*').limit(20)

			if (error) throw error
			return data
		},
		enabled: !!user?.id,
		staleTime: 2 * 60 * 1000,
		gcTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	})
}
