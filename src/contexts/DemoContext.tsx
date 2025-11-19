import { createContext, useContext, ReactNode } from 'react'
import {
	DEMO_MODE,
	DEMO_USER,
	DEMO_PROFILE,
	DEMO_STATS,
	DEMO_MOVIES,
	DEMO_SERIES,
	DEMO_GAMES,
	DEMO_WATCHLIST,
	DEMO_COLLECTIONS,
	DEMO_FRIENDS,
	DEMO_PENDING_REQUESTS,
} from '@/lib/demoMode'

interface DemoContextType {
	isDemoMode: boolean
	getDemoData: (type: string) => any
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export const DemoProvider = ({ children }: { children: ReactNode }) => {
	const getDemoData = (type: string) => {
		if (!DEMO_MODE) return null

		switch (type) {
			case 'user':
				return DEMO_USER
			case 'profile':
				return DEMO_PROFILE
			case 'stats':
				return DEMO_STATS
			case 'movies':
				return DEMO_MOVIES
			case 'series':
				return DEMO_SERIES
			case 'games':
				return DEMO_GAMES
			case 'watchlist':
				return DEMO_WATCHLIST
			case 'collections':
				return DEMO_COLLECTIONS
			case 'friends':
				return DEMO_FRIENDS
			case 'pendingRequests':
				return DEMO_PENDING_REQUESTS
			default:
				return null
		}
	}

	return <DemoContext.Provider value={{ isDemoMode: DEMO_MODE, getDemoData }}>{children}</DemoContext.Provider>
}

export const useDemo = () => {
	const context = useContext(DemoContext)
	if (!context) throw new Error('useDemo must be used within DemoProvider')
	return context
}
