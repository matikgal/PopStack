import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_MODE, DEMO_COLLECTIONS } from '@/lib/demoMode'

export interface Collection {
	id: string
	user_id: string
	name: string
	description: string | null
	is_public: boolean
	created_at: string
	updated_at: string
	items_count?: number
}

export interface CollectionItem {
	id: string
	collection_id: string
	item_type: string
	item_id: number
	item_title: string
	item_poster: string | null
	added_at: string
}

// Pobierz wszystkie kolekcje użytkownika
export const useCollections = () => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['collections', user?.id],
		queryFn: async () => {
			if (!user) throw new Error('User not authenticated')

			// Demo mode - return fake collections
			if (DEMO_MODE) {
				console.log('🎬 DEMO MODE: Returning fake collections', DEMO_COLLECTIONS)
				return DEMO_COLLECTIONS as Collection[]
			}

			const { data, error } = await supabase
				.from('collections')
				.select('*, collection_items(count)')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false })

			if (error) throw error

			// Dodaj licznik itemów
			return (data || []).map((col: any) => ({
				...col,
				items_count: col.collection_items?.[0]?.count || 0,
			})) as Collection[]
		},
		enabled: !!user,
	})
}

// Pobierz pojedynczą kolekcję z itemami
export const useCollection = (collectionId: string) => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['collection', collectionId],
		queryFn: async () => {
			if (!user) throw new Error('User not authenticated')

			// Demo mode - return fake collection
			if (DEMO_MODE) {
				const collection = DEMO_COLLECTIONS.find(c => c.id === collectionId)
				return collection || null
			}

			const { data, error } = await supabase
				.from('collections')
				.select('*, collection_items(*)')
				.eq('id', collectionId)
				.eq('user_id', user.id)
				.single()

			if (error) throw error
			return data
		},
		enabled: !!user && !!collectionId,
	})
}

// Utwórz nową kolekcję
export const useCreateCollection = () => {
	const { user } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ name, description, isPublic }: { name: string; description?: string; isPublic?: boolean }) => {
			if (!user) throw new Error('User not authenticated')

			const { data, error } = await supabase
				.from('collections')
				.insert({
					user_id: user.id,
					name,
					description: description || null,
					is_public: isPublic || false,
				})
				.select()
				.single()

			if (error) throw error
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['collections'] })
		},
	})
}

// Usuń kolekcję
export const useDeleteCollection = () => {
	const { user } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (collectionId: string) => {
			if (!user) throw new Error('User not authenticated')

			const { error } = await supabase.from('collections').delete().eq('id', collectionId).eq('user_id', user.id)

			if (error) throw error
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['collections'] })
		},
	})
}

// Dodaj item do kolekcji
export const useAddToCollection = () => {
	const { user } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			collectionId,
			itemType,
			itemId,
			itemTitle,
			itemPoster,
		}: {
			collectionId: string
			itemType: string
			itemId: number
			itemTitle: string
			itemPoster?: string
		}) => {
			if (!user) throw new Error('User not authenticated')

			const { data, error } = await supabase
				.from('collection_items')
				.insert({
					collection_id: collectionId,
					item_type: itemType,
					item_id: itemId,
					item_title: itemTitle,
					item_poster: itemPoster || null,
				})
				.select()
				.single()

			if (error) throw error
			return data
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['collections'] })
			queryClient.invalidateQueries({ queryKey: ['collection', variables.collectionId] })
		},
	})
}

// Usuń item z kolekcji
export const useRemoveFromCollection = () => {
	const { user } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ collectionId, itemId }: { collectionId: string; itemId: string }) => {
			if (!user) throw new Error('User not authenticated')

			const { error } = await supabase
				.from('collection_items')
				.delete()
				.eq('id', itemId)
				.eq('collection_id', collectionId)

			if (error) throw error
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['collections'] })
			queryClient.invalidateQueries({ queryKey: ['collection', variables.collectionId] })
		},
	})
}

// Sprawdź czy item jest w jakiejś kolekcji
export const useItemCollections = (itemType: string, itemId: number) => {
	const { user } = useAuth()

	return useQuery({
		queryKey: ['item-collections', user?.id, itemType, itemId],
		queryFn: async () => {
			if (!user) return []

			const { data, error } = await supabase
				.from('collection_items')
				.select('collection_id, collections(name)')
				.eq('item_type', itemType)
				.eq('item_id', itemId)

			if (error) throw error
			return data || []
		},
		enabled: !!user,
	})
}
