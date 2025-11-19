import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export const useTheme = () => {
	const [theme, setThemeState] = useState<Theme>(() => {
		const stored = localStorage.getItem('theme')
		return (stored as Theme) || 'dark'
	})

	useEffect(() => {
		const root = window.document.documentElement
		root.classList.remove('light', 'dark')

		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
			root.classList.add(systemTheme)
		} else {
			root.classList.add(theme)
		}

		localStorage.setItem('theme', theme)
	}, [theme])

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme)
	}

	return { theme, setTheme }
}
