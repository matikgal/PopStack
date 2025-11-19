import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

// Aktualizuj profil użytkownika
export const useUpdateProfile = () => {
	const { user } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ username, bio }: { username?: string; bio?: string }) => {
			if (!user) throw new Error('User not authenticated')

			// Sprawdź czy profil istnieje
			const { data: existingProfile } = await supabase.from('profiles').select('id').eq('id', user.id).single()

			if (existingProfile) {
				// Aktualizuj istniejący profil
				const { data, error } = await supabase
					.from('profiles')
					.update({
						username: username || null,
						bio: bio || null,
						updated_at: new Date().toISOString(),
					})
					.eq('id', user.id)
					.select()
					.single()

				if (error) throw error
				return data
			} else {
				// Utwórz nowy profil
				const { data, error } = await supabase
					.from('profiles')
					.insert({
						id: user.id,
						username: username || null,
						bio: bio || null,
					})
					.select()
					.single()

				if (error) throw error
				return data
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['profile'] })
		},
	})
}

// Pobierz profil użytkownika
export const useProfile = () => {
	const { user } = useAuth()

	return {
		queryKey: ['profile', user?.id],
		queryFn: async () => {
			if (!user) throw new Error('User not authenticated')

			const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()

			// Jeśli profil nie istnieje, zwróć puste dane
			if (error && error.code === 'PGRST116') {
				return { username: null, bio: null }
			}

			if (error) throw error
			return data
		},
		enabled: !!user,
	}
}
