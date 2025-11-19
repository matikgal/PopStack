import { createContext, useContext, useState, ReactNode } from 'react'
import type { Language } from '@/lib/i18n'
import { translations } from '@/lib/i18n'

interface LanguageContextType {
	language: Language
	setLanguage: (lang: Language) => void
	t: typeof translations.en & { language: Language }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	// Pobierz język z localStorage lub użyj domyślnego (polski)
	const [language, setLanguageState] = useState<Language>(() => {
		const saved = localStorage.getItem('language')
		return (saved as Language) || 'pl'
	})

	// Zapisz język do localStorage przy zmianie
	const setLanguage = (lang: Language) => {
		setLanguageState(lang)
		localStorage.setItem('language', lang)
	}

	return (
		<LanguageContext.Provider
			value={{
				language,
				setLanguage,
				t: { ...translations[language], language },
			}}>
			{children}
		</LanguageContext.Provider>
	)
}

export const useLanguage = () => {
	const context = useContext(LanguageContext)
	if (context === undefined) {
		throw new Error('useLanguage must be used within a LanguageProvider')
	}
	return context
}
