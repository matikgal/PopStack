import { Info } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { DEMO_MODE } from '@/lib/demoMode'

export const DemoBanner = () => {
	const { language } = useLanguage()

	if (!DEMO_MODE) return null

	return (
		<div className="fixed top-4 right-4 z-50 bg-yellow-400 text-black px-3 py-1.5 rounded-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
			<div className="flex items-center gap-1.5 text-xs font-bold">
				<Info size={14} />
				<span>{language === 'pl' ? 'DEMO' : 'DEMO'}</span>
			</div>
		</div>
	)
}
