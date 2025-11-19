export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string
					username: string | null
					avatar_url: string | null
					bio: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id: string
					username?: string | null
					avatar_url?: string | null
					bio?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					username?: string | null
					avatar_url?: string | null
					bio?: string | null
					created_at?: string
					updated_at?: string
				}
			}
			movie_reviews: {
				Row: {
					id: string
					user_id: string
					movie_id: number
					movie_title: string
					movie_poster: string | null
					rating: number
					review_text: string | null
					watched_date: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					movie_id: number
					movie_title: string
					movie_poster?: string | null
					rating: number
					review_text?: string | null
					watched_date?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					movie_id?: number
					movie_title?: string
					movie_poster?: string | null
					rating?: number
					review_text?: string | null
					watched_date?: string | null
					created_at?: string
					updated_at?: string
				}
			}
			game_reviews: {
				Row: {
					id: string
					user_id: string
					game_id: number
					game_title: string
					game_cover: string | null
					rating: number
					review_text: string | null
					played_date: string | null
					hours_played: number | null
					platform: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					game_id: number
					game_title: string
					game_cover?: string | null
					rating: number
					review_text?: string | null
					played_date?: string | null
					hours_played?: number | null
					platform?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					game_id?: number
					game_title?: string
					game_cover?: string | null
					rating?: number
					review_text?: string | null
					played_date?: string | null
					hours_played?: number | null
					platform?: string | null
					created_at?: string
					updated_at?: string
				}
			}
			series_reviews: {
				Row: {
					id: string
					user_id: string
					series_id: number
					series_title: string
					series_poster: string | null
					rating: number
					review_text: string | null
					watched_date: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					series_id: number
					series_title: string
					series_poster?: string | null
					rating: number
					review_text?: string | null
					watched_date?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					series_id?: number
					series_title?: string
					series_poster?: string | null
					rating?: number
					review_text?: string | null
					watched_date?: string | null
					created_at?: string
					updated_at?: string
				}
			}
			collections: {
				Row: {
					id: string
					user_id: string
					name: string
					description: string | null
					is_public: boolean
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					name: string
					description?: string | null
					is_public?: boolean
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					name?: string
					description?: string | null
					is_public?: boolean
					created_at?: string
					updated_at?: string
				}
			}
			collection_items: {
				Row: {
					id: string
					collection_id: string
					item_type: string
					item_id: number
					item_title: string
					item_poster: string | null
					added_at: string
				}
				Insert: {
					id?: string
					collection_id: string
					item_type: string
					item_id: number
					item_title: string
					item_poster?: string | null
					added_at?: string
				}
				Update: {
					id?: string
					collection_id?: string
					item_type?: string
					item_id?: number
					item_title?: string
					item_poster?: string | null
					added_at?: string
				}
			}
			user_stats: {
				Row: {
					id: string
					user_id: string
					total_movies_watched: number
					total_games_played: number
					total_hours_gaming: number
					favorite_genre: string | null
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					total_movies_watched?: number
					total_games_played?: number
					total_hours_gaming?: number
					favorite_genre?: string | null
					updated_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					total_movies_watched?: number
					total_games_played?: number
					total_hours_gaming?: number
					favorite_genre?: string | null
					updated_at?: string
				}
			}
			activities: {
				Row: {
					id: string
					user_id: string
					activity_type: string
					item_type: string
					item_id: number
					item_title: string
					content: string | null
					created_at: string
				}
				Insert: {
					id?: string
					user_id: string
					activity_type: string
					item_type: string
					item_id: number
					item_title: string
					content?: string | null
					created_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					activity_type?: string
					item_type?: string
					item_id?: number
					item_title?: string
					content?: string | null
					created_at?: string
				}
			}
			watchlist: {
				Row: {
					id: string
					user_id: string
					item_type: string
					item_id: number
					item_title: string
					item_poster: string | null
					item_rating: number | null
					added_at: string
				}
				Insert: {
					id?: string
					user_id: string
					item_type: string
					item_id: number
					item_title: string
					item_poster?: string | null
					item_rating?: number | null
					added_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					item_type?: string
					item_id?: number
					item_title?: string
					item_poster?: string | null
					item_rating?: number | null
					added_at?: string
				}
			}
			friendships: {
				Row: {
					id: string
					user_id: string
					friend_id: string
					status: 'pending' | 'accepted' | 'rejected'
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					friend_id: string
					status?: 'pending' | 'accepted' | 'rejected'
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					friend_id?: string
					status?: 'pending' | 'accepted' | 'rejected'
					created_at?: string
					updated_at?: string
				}
			}
		}
		Views: {
			friend_activities: {
				Row: {
					id: string
					user_id: string
					activity_type: string
					item_type: string
					item_id: number
					item_title: string
					content: string | null
					created_at: string
					username: string | null
					avatar_url: string | null
				}
			}
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
	}
}
