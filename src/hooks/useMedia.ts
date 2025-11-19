import { useQuery } from '@tanstack/react-query'
import * as tmdb from '@/services/tmdb'
import * as rawg from '@/services/rawg'

// Hook do trending mediów (filmy + seriale)
export const useTrendingMovies = (timeWindow: 'day' | 'week' = 'week') => {
	return useQuery({
		queryKey: ['trending-movies', timeWindow],
		queryFn: () => tmdb.getTrending(timeWindow),
		staleTime: 1000 * 60 * 30, // 30 minut cache
	})
}

// Hook do popularnych filmów
export const usePopularMovies = (page: number = 1) => {
	return useQuery({
		queryKey: ['popular-movies', page],
		queryFn: () => tmdb.getPopularMovies(page),
		staleTime: 1000 * 60 * 30,
	})
}

// Hook do popularnych seriali
export const usePopularTVShows = (page: number = 1) => {
	return useQuery({
		queryKey: ['popular-tv', page],
		queryFn: () => tmdb.getPopularTVShows(page),
		staleTime: 1000 * 60 * 30,
	})
}

// Hook do wyszukiwania filmów
export const useSearchMovies = (query: string, page: number = 1) => {
	return useQuery({
		queryKey: ['search-movies', query, page],
		queryFn: () => tmdb.searchMovies(query, page),
		enabled: query.length > 0,
		staleTime: 1000 * 60 * 10,
	})
}

// Hook do wyszukiwania seriali
export const useSearchTVShows = (query: string, page: number = 1) => {
	return useQuery({
		queryKey: ['search-tv', query, page],
		queryFn: () => tmdb.searchTVShows(query, page),
		enabled: query.length > 0,
		staleTime: 1000 * 60 * 10,
	})
}

// Hook do szczegółów filmu
export const useMovieDetails = (movieId: number) => {
	return useQuery({
		queryKey: ['movie-details', movieId],
		queryFn: () => tmdb.getMovieDetails(movieId),
		enabled: movieId > 0,
		staleTime: 1000 * 60 * 60, // 1 godzina
	})
}

// Hook do top rated filmów
export const useTopRatedMovies = (page: number = 1) => {
	return useQuery({
		queryKey: ['top-rated-movies', page],
		queryFn: () => tmdb.getTopRatedMovies(page),
		staleTime: 1000 * 60 * 60,
	})
}

// ============================================
// RAWG - Gry
// ============================================

// Hook do trending gier
export const useTrendingGames = (page: number = 1) => {
	const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY
	const hasValidKey = RAWG_API_KEY && RAWG_API_KEY !== 'your-rawg-key-here'

	return useQuery({
		queryKey: ['trending-games', page],
		queryFn: () => rawg.getTrendingGames(page),
		enabled: hasValidKey,
		staleTime: 1000 * 60 * 30,
	})
}

// Hook do popularnych gier
export const usePopularGames = (page: number = 1) => {
	return useQuery({
		queryKey: ['popular-games', page],
		queryFn: () => rawg.getPopularGames(page),
		staleTime: 1000 * 60 * 30,
	})
}

// Hook do wyszukiwania gier
export const useSearchGames = (query: string, page: number = 1) => {
	return useQuery({
		queryKey: ['search-games', query, page],
		queryFn: () => rawg.searchGames(query, page),
		enabled: query.length > 0,
		staleTime: 1000 * 60 * 10,
	})
}

// Hook do szczegółów gry
export const useGameDetails = (gameId: number) => {
	return useQuery({
		queryKey: ['game-details', gameId],
		queryFn: () => rawg.getGameDetails(gameId),
		enabled: gameId > 0,
		staleTime: 1000 * 60 * 60,
	})
}

// Hook do top rated gier
export const useTopRatedGames = (page: number = 1) => {
	return useQuery({
		queryKey: ['top-rated-games', page],
		queryFn: () => rawg.getTopRatedGames(page),
		staleTime: 1000 * 60 * 60,
	})
}

// Hook do gier z platformy
export const useGamesByPlatform = (platformId: number, page: number = 1) => {
	return useQuery({
		queryKey: ['games-by-platform', platformId, page],
		queryFn: () => rawg.getGamesByPlatform(platformId, page),
		staleTime: 1000 * 60 * 30,
	})
}

// Hook do gier z gatunku
export const useGamesByGenre = (genreId: number, page: number = 1) => {
	return useQuery({
		queryKey: ['games-by-genre', genreId, page],
		queryFn: () => rawg.getGamesByGenre(genreId, page),
		staleTime: 1000 * 60 * 30,
	})
}

// Hook do obsady filmu
export const useMovieCredits = (movieId: number) => {
	return useQuery({
		queryKey: ['movie-credits', movieId],
		queryFn: () => tmdb.getMovieCredits(movieId),
		enabled: movieId > 0,
		staleTime: 1000 * 60 * 60, // 1 godzina
	})
}

// Hook do gatunków filmów
export const useMovieGenres = () => {
	return useQuery({
		queryKey: ['movie-genres'],
		queryFn: () => tmdb.getMovieGenres(),
		staleTime: 1000 * 60 * 60 * 24, // 24 godziny
	})
}

// Hook do gatunków seriali
export const useTVGenres = () => {
	return useQuery({
		queryKey: ['tv-genres'],
		queryFn: () => tmdb.getTVGenres(),
		staleTime: 1000 * 60 * 60 * 24,
	})
}

// Hook do odkrywania filmów
export const useDiscoverMovies = (params: any) => {
	return useQuery({
		queryKey: ['discover-movies', params],
		queryFn: () => tmdb.discoverMovies(params),
		staleTime: 1000 * 60 * 10,
	})
}

// Hook do odkrywania seriali
export const useDiscoverTVShows = (params: any) => {
	return useQuery({
		queryKey: ['discover-tv', params],
		queryFn: () => tmdb.discoverTVShows(params),
		staleTime: 1000 * 60 * 10,
	})
}

// Hook do gatunków gier
export const useGameGenres = () => {
	return useQuery({
		queryKey: ['game-genres'],
		queryFn: () => rawg.getGameGenres(),
		staleTime: 1000 * 60 * 60 * 24, // 24 godziny
	})
}

// Hook do odkrywania gier
export const useDiscoverGames = (params: any) => {
	return useQuery({
		queryKey: ['discover-games', params],
		queryFn: () => rawg.discoverGames(params),
		staleTime: 1000 * 60 * 10,
	})
}
