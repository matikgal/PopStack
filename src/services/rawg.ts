// RAWG API Service - Gry
const RAWG_BASE_URL = 'https://api.rawg.io/api'
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY

export interface RAWGGame {
	id: number
	name: string
	background_image: string | null
	rating: number
	rating_top: number
	ratings_count: number
	released: string
	metacritic: number | null
	playtime: number
	platforms: Array<{
		platform: {
			id: number
			name: string
			slug: string
		}
	}>
	genres: Array<{
		id: number
		name: string
		slug: string
	}>
	short_screenshots?: Array<{
		id: number
		image: string
	}>
}

export interface RAWGResponse {
	count: number
	next: string | null
	previous: string | null
	results: RAWGGame[]
}

// Fetch helper z error handling
const rawgFetch = async <T>(endpoint: string): Promise<T> => {
	try {
		const url = `${RAWG_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}key=${RAWG_API_KEY}`
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(`RAWG API Error: ${response.status}`)
		}

		return response.json()
	} catch (error) {
		console.error('RAWG Fetch Error:', error)
		throw error
	}
}

// Trending gry (ostatnio dodane)
export const getTrendingGames = async (page: number = 1): Promise<RAWGResponse> => {
	return rawgFetch<RAWGResponse>(`/games?ordering=-added&page=${page}&page_size=20`)
}

// Popularne gry (najwyżej oceniane)
export const getPopularGames = async (page: number = 1): Promise<RAWGResponse> => {
	return rawgFetch<RAWGResponse>(`/games?ordering=-rating&page=${page}&page_size=20`)
}

// Najlepiej oceniane gry
export const getTopRatedGames = async (page: number = 1): Promise<RAWGResponse> => {
	return rawgFetch<RAWGResponse>(`/games?ordering=-metacritic&page=${page}&page_size=20`)
}

// Wyszukiwanie gier
export const searchGames = async (query: string, page: number = 1): Promise<RAWGResponse> => {
	return rawgFetch<RAWGResponse>(`/games?search=${encodeURIComponent(query)}&page=${page}&page_size=20`)
}

// Szczegóły gry
export const getGameDetails = async (gameId: number) => {
	return rawgFetch(`/games/${gameId}`)
}

// Gry z określonej platformy
export const getGamesByPlatform = async (platformId: number, page: number = 1): Promise<RAWGResponse> => {
	return rawgFetch<RAWGResponse>(`/games?platforms=${platformId}&page=${page}&page_size=20`)
}

// Gry z określonego gatunku
export const getGamesByGenre = async (genreId: number, page: number = 1): Promise<RAWGResponse> => {
	return rawgFetch<RAWGResponse>(`/games?genres=${genreId}&page=${page}&page_size=20`)
}

// Nadchodzące premiery
export const getUpcomingGames = async (page: number = 1): Promise<RAWGResponse> => {
	const today = new Date().toISOString().split('T')[0]
	const nextYear = new Date()
	nextYear.setFullYear(nextYear.getFullYear() + 1)
	const nextYearDate = nextYear.toISOString().split('T')[0]

	return rawgFetch<RAWGResponse>(`/games?dates=${today},${nextYearDate}&ordering=-added&page=${page}&page_size=20`)
}

// Platformy (PC=4, PS5=187, Xbox Series X=186, Switch=7)
export const PLATFORMS = {
	PC: 4,
	PS5: 187,
	PS4: 18,
	XBOX_SERIES: 186,
	XBOX_ONE: 1,
	SWITCH: 7,
	IOS: 3,
	ANDROID: 21,
}

// Gatunki
export const GENRES = {
	ACTION: 4,
	INDIE: 51,
	ADVENTURE: 3,
	RPG: 5,
	STRATEGY: 10,
	SHOOTER: 2,
	CASUAL: 40,
	SIMULATION: 14,
	PUZZLE: 7,
	ARCADE: 11,
	PLATFORMER: 83,
	RACING: 1,
	SPORTS: 15,
	FIGHTING: 6,
	FAMILY: 19,
	BOARD_GAMES: 28,
	EDUCATIONAL: 34,
	CARD: 17,
}

// Pobierz listę gatunków gier
export const getGameGenres = async () => {
	return rawgFetch(`/genres`)
}

// Odkrywaj gry z filtrami
export const discoverGames = async (params: any) => {
	const queryParams: any = {
		page: String(params.page || 1),
		page_size: '20',
		ordering: params.ordering || '-rating',
	}

	// Dodaj opcjonalne parametry tylko jeśli są zdefiniowane
	if (params.genres) queryParams.genres = params.genres
	if (params.dates) queryParams.dates = params.dates
	if (params.metacritic) queryParams.metacritic = params.metacritic

	const searchParams = new URLSearchParams(queryParams)
	return rawgFetch<RAWGResponse>(`/games?${searchParams}`)
}
