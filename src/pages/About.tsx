import { Layout } from '@/components/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import { Info, Heart } from 'lucide-react'

const About = () => {
	const { language } = useLanguage()

	return (
		<Layout showFriendsSidebar={false}>
			<div className="min-h-screen p-4 sm:p-6 lg:p-12">
				<div className="max-w-4xl mx-auto space-y-8">
					{/* Header */}
					<div className="space-y-4 pb-6 border-b-4 border-primary">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-primary/10 border-2 border-primary rounded-sm">
								<Info size={32} className="text-primary" />
							</div>
							<div>
								<h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
									{language === 'pl' ? 'O PopStack' : 'About PopStack'}
								</h1>
								<p className="text-sm sm:text-base text-muted-foreground">
									{language === 'pl'
										? 'Twoja społeczność filmów, seriali i gier'
										: 'Your movies, TV shows, and games community'}
								</p>
							</div>
						</div>
					</div>

					{/* Main Description */}
					<div className="space-y-6">
						<section className="p-6 border-2 border-border rounded-sm brutal-shadow bg-card">
							<h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
								<Heart className="text-primary" size={24} />
								{language === 'pl' ? 'Czym jest PopStack?' : 'What is PopStack?'}
							</h2>
							<p className="text-muted-foreground leading-relaxed">
								{language === 'pl'
									? 'PopStack to nowoczesna platforma społecznościowa stworzona dla pasjonatów filmów, seriali i gier wideo. Nasza misja to umożliwienie użytkownikom łatwego śledzenia, oceniania i dzielenia się swoimi ulubionymi tytułami ze znajomymi.'
									: 'PopStack is a modern social platform created for movie, TV show, and video game enthusiasts. Our mission is to enable users to easily track, rate, and share their favorite titles with friends.'}
							</p>
						</section>

						{/* Features Grid */}
						<div className="grid sm:grid-cols-2 gap-4">
							<div className="p-6 border-2 border-border rounded-sm brutal-shadow bg-card">
								<h3 className="text-xl font-heading font-bold mb-2">
									{language === 'pl' ? 'Szybkie i Intuicyjne' : 'Fast & Intuitive'}
								</h3>
								<p className="text-sm text-muted-foreground">
									{language === 'pl'
										? 'Przeglądaj tysiące tytułów, oceniaj je w sekundę i twórz własne kolekcje bez wysiłku.'
										: 'Browse thousands of titles, rate them in seconds, and create your own collections effortlessly.'}
								</p>
							</div>

							<div className="p-6 border-2 border-border rounded-sm brutal-shadow bg-card">
								<h3 className="text-xl font-heading font-bold mb-2">
									{language === 'pl' ? 'Społeczność' : 'Community'}
								</h3>
								<p className="text-sm text-muted-foreground">
									{language === 'pl'
										? 'Łącz się ze znajomymi, dziel się opiniami i odkrywaj nowe tytuły dzięki rekomendacjom.'
										: 'Connect with friends, share opinions, and discover new titles through recommendations.'}
								</p>
							</div>

							<div className="p-6 border-2 border-border rounded-sm brutal-shadow bg-card">
								<h3 className="text-xl font-heading font-bold mb-2">
									{language === 'pl' ? 'Bezpieczeństwo' : 'Security'}
								</h3>
								<p className="text-sm text-muted-foreground">
									{language === 'pl'
										? 'Twoje dane są chronione dzięki nowoczesnym technologiom szyfrowania i bezpiecznej autentykacji.'
										: 'Your data is protected with modern encryption technologies and secure authentication.'}
								</p>
							</div>

							<div className="p-6 border-2 border-border rounded-sm brutal-shadow bg-card">
								<h3 className="text-xl font-heading font-bold mb-2">
									{language === 'pl' ? 'Nowoczesne Tech' : 'Modern Tech'}
								</h3>
								<p className="text-sm text-muted-foreground">
									{language === 'pl'
										? 'Zbudowane z React, TypeScript i Supabase dla najlepszej wydajności i niezawodności.'
										: 'Built with React, TypeScript, and Supabase for best performance and reliability.'}
								</p>
							</div>
						</div>

						{/* Key Features */}
						<section className="p-6 border-2 border-border rounded-sm brutal-shadow bg-card">
							<h2 className="text-2xl font-heading font-bold mb-4">
								{language === 'pl' ? 'Główne Funkcje' : 'Key Features'}
							</h2>
							<div className="grid sm:grid-cols-2 gap-4">
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">•</span>
										<span>
											{language === 'pl'
												? 'Odkrywanie tysięcy filmów, seriali i gier'
												: 'Discover thousands of movies, TV shows, and games'}
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">•</span>
										<span>
											{language === 'pl'
												? 'System ocen 1-10 gwiazdek z recenzjami'
												: '1-10 star rating system with reviews'}
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">•</span>
										<span>
											{language === 'pl'
												? 'Watchlist - lista do obejrzenia/zagrania'
												: 'Watchlist - to watch/play list'}
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">•</span>
										<span>{language === 'pl' ? 'Własne kolekcje tematyczne' : 'Custom thematic collections'}</span>
									</li>
								</ul>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">•</span>
										<span>{language === 'pl' ? 'System znajomych' : 'Friends system'}</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">•</span>
										<span>
											{language === 'pl' ? 'Szczegółowe statystyki aktywności' : 'Detailed activity statistics'}
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">•</span>
										<span>{language === 'pl' ? 'Tryb ciemny i jasny' : 'Dark and light mode'}</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">•</span>
										<span>
											{language === 'pl' ? 'Pełna responsywność (mobile-first)' : 'Full responsiveness (mobile-first)'}
										</span>
									</li>
								</ul>
							</div>
						</section>

						{/* Tech Stack */}
						<section className="p-6 border-2 border-border rounded-sm brutal-shadow bg-card">
							<h2 className="text-2xl font-heading font-bold mb-4">
								{language === 'pl' ? 'Technologie' : 'Technology Stack'}
							</h2>
							<div className="grid sm:grid-cols-3 gap-4 text-sm">
								<div>
									<h3 className="font-semibold mb-2 text-primary">Frontend</h3>
									<ul className="space-y-1 text-muted-foreground">
										<li>React 18</li>
										<li>TypeScript</li>
										<li>TailwindCSS</li>
										<li>React Query</li>
									</ul>
								</div>
								<div>
									<h3 className="font-semibold mb-2 text-secondary">Backend</h3>
									<ul className="space-y-1 text-muted-foreground">
										<li>Supabase</li>
										<li>PostgreSQL</li>
										<li>Row Level Security</li>
										<li>Real-time Updates</li>
									</ul>
								</div>
								<div>
									<h3 className="font-semibold mb-2 text-accent">APIs</h3>
									<ul className="space-y-1 text-muted-foreground">
										<li>TMDB (Movies/TV)</li>
										<li>RAWG (Games)</li>
										<li>Google OAuth</li>
									</ul>
								</div>
							</div>
						</section>

						{/* Contact */}
						<section className="p-6 border-2 border-border rounded-sm brutal-shadow bg-gradient-to-br from-primary/10 to-secondary/10">
							<h2 className="text-2xl font-heading font-bold mb-2">{language === 'pl' ? 'Kontakt' : 'Contact'}</h2>
							<p className="text-muted-foreground">
								{language === 'pl'
									? 'Masz pytania lub sugestie? Skontaktuj się z nami poprzez formularz w ustawieniach aplikacji.'
									: 'Have questions or suggestions? Contact us through the form in application settings.'}
							</p>
						</section>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default About
