import { Layout } from '@/components/Layout'
import { useLanguage } from '@/contexts/LanguageContext'
import { FileText } from 'lucide-react'

const Terms = () => {
	const { language } = useLanguage()

	return (
		<Layout showFriendsSidebar={false}>
			<div className="min-h-screen p-4 sm:p-6 lg:p-12">
				<div className="max-w-4xl mx-auto space-y-8">
					{/* Header */}
					<div className="space-y-4 pb-6 border-b-4 border-primary">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-primary/10 border-2 border-primary rounded-sm">
								<FileText size={32} className="text-primary" />
							</div>
							<div>
								<h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
									{language === 'pl' ? 'Regulamin' : 'Terms of Service'}
								</h1>
								<p className="text-sm text-muted-foreground">
									{language === 'pl' ? 'Ostatnia aktualizacja: Styczeń 2024' : 'Last updated: January 2024'}
								</p>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="prose prose-sm sm:prose lg:prose-lg max-w-none space-y-6">
						{language === 'pl' ? (
							<>
								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">1. Akceptacja Warunków</h2>
									<p className="text-muted-foreground leading-relaxed">
										Korzystając z PopStack, akceptujesz niniejszy regulamin. Jeśli nie zgadzasz się z którymkolwiek z
										punktów, prosimy o zaprzestanie korzystania z aplikacji.
									</p>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">2. Opis Usługi</h2>
									<p className="text-muted-foreground leading-relaxed">
										PopStack to platforma społecznościowa umożliwiająca użytkownikom:
									</p>
									<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
										<li>Odkrywanie i przeglądanie filmów, seriali i gier</li>
										<li>Ocenianie i recenzowanie treści</li>
										<li>Tworzenie list i kolekcji</li>
										<li>Łączenie się ze znajomymi i dzielenie się opiniami</li>
										<li>Śledzenie swojej aktywności i statystyk</li>
									</ul>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">3. Konto Użytkownika</h2>
									<p className="text-muted-foreground leading-relaxed">
										Aby korzystać z pełnej funkcjonalności PopStack, musisz utworzyć konto. Jesteś odpowiedzialny za:
									</p>
									<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
										<li>Zachowanie poufności hasła</li>
										<li>Wszystkie działania wykonywane na Twoim koncie</li>
										<li>Natychmiastowe powiadomienie nas o nieautoryzowanym dostępie</li>
									</ul>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">4. Treści Użytkownika</h2>
									<p className="text-muted-foreground leading-relaxed">
										Publikując recenzje, komentarze lub inne treści, zgadzasz się, że:
									</p>
									<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
										<li>Posiadasz prawa do publikowanych treści</li>
										<li>Treści nie naruszają praw osób trzecich</li>
										<li>Treści nie zawierają materiałów nielegalnych lub obraźliwych</li>
										<li>Udzielasz nam licencji na wyświetlanie i dystrybucję tych treści</li>
									</ul>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">5. Zabronione Działania</h2>
									<p className="text-muted-foreground leading-relaxed">Zabrania się:</p>
									<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
										<li>Publikowania treści obraźliwych, dyskryminujących lub nielegalnych</li>
										<li>Podszywania się pod inne osoby</li>
										<li>Spamowania lub nadużywania systemu</li>
										<li>Próby włamania lub naruszenia bezpieczeństwa</li>
										<li>Automatycznego zbierania danych (scraping)</li>
									</ul>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">6. Prywatność</h2>
									<p className="text-muted-foreground leading-relaxed">
										Twoje dane osobowe są przetwarzane zgodnie z naszą Polityką Prywatności. Używamy Supabase do
										przechowywania danych, które są szyfrowane i chronione.
									</p>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">7. Dane z API Zewnętrznych</h2>
									<p className="text-muted-foreground leading-relaxed">
										PopStack wykorzystuje dane z TMDB (The Movie Database) i RAWG dla informacji o filmach, serialach i
										grach. Te dane są własnością odpowiednich dostawców.
									</p>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">8. Ograniczenie Odpowiedzialności</h2>
									<p className="text-muted-foreground leading-relaxed">
										PopStack jest dostarczany "tak jak jest". Nie gwarantujemy nieprzerwanego działania ani braku
										błędów. Nie ponosimy odpowiedzialności za:
									</p>
									<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
										<li>Utratę danych</li>
										<li>Przerwy w działaniu serwisu</li>
										<li>Treści publikowane przez użytkowników</li>
										<li>Szkody wynikające z korzystania z serwisu</li>
									</ul>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">9. Zmiany w Regulaminie</h2>
									<p className="text-muted-foreground leading-relaxed">
										Zastrzegamy sobie prawo do modyfikacji niniejszego regulaminu. O istotnych zmianach poinformujemy
										użytkowników z odpowiednim wyprzedzeniem.
									</p>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">10. Kontakt</h2>
									<p className="text-muted-foreground leading-relaxed">
										W przypadku pytań dotyczących regulaminu, skontaktuj się z nami poprzez formularz kontaktowy w
										aplikacji.
									</p>
								</section>
							</>
						) : (
							<>
								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">1. Acceptance of Terms</h2>
									<p className="text-muted-foreground leading-relaxed">
										By using PopStack, you accept these terms of service. If you do not agree with any part of these
										terms, please discontinue use of the application.
									</p>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">2. Service Description</h2>
									<p className="text-muted-foreground leading-relaxed">
										PopStack is a social platform that enables users to:
									</p>
									<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
										<li>Discover and browse movies, TV shows, and games</li>
										<li>Rate and review content</li>
										<li>Create lists and collections</li>
										<li>Connect with friends and share opinions</li>
										<li>Track activity and statistics</li>
									</ul>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">3. User Account</h2>
									<p className="text-muted-foreground leading-relaxed">
										To use PopStack's full functionality, you must create an account. You are responsible for:
									</p>
									<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
										<li>Maintaining password confidentiality</li>
										<li>All activities performed on your account</li>
										<li>Immediately notifying us of unauthorized access</li>
									</ul>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">4. User Content</h2>
									<p className="text-muted-foreground leading-relaxed">
										By publishing reviews, comments, or other content, you agree that:
									</p>
									<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
										<li>You own the rights to published content</li>
										<li>Content does not violate third-party rights</li>
										<li>Content does not contain illegal or offensive material</li>
										<li>You grant us a license to display and distribute this content</li>
									</ul>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">5. Prohibited Activities</h2>
									<p className="text-muted-foreground leading-relaxed">The following are prohibited:</p>
									<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
										<li>Publishing offensive, discriminatory, or illegal content</li>
										<li>Impersonating others</li>
										<li>Spamming or system abuse</li>
										<li>Attempting to breach security</li>
										<li>Automated data collection (scraping)</li>
									</ul>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">6. Privacy</h2>
									<p className="text-muted-foreground leading-relaxed">
										Your personal data is processed in accordance with our Privacy Policy. We use Supabase for data
										storage, which is encrypted and protected.
									</p>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">7. External API Data</h2>
									<p className="text-muted-foreground leading-relaxed">
										PopStack uses data from TMDB (The Movie Database) and RAWG for movie, TV show, and game information.
										This data is owned by respective providers.
									</p>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">8. Limitation of Liability</h2>
									<p className="text-muted-foreground leading-relaxed">
										PopStack is provided "as is". We do not guarantee uninterrupted operation or absence of errors. We
										are not liable for:
									</p>
									<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
										<li>Data loss</li>
										<li>Service interruptions</li>
										<li>User-published content</li>
										<li>Damages resulting from service use</li>
									</ul>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">9. Changes to Terms</h2>
									<p className="text-muted-foreground leading-relaxed">
										We reserve the right to modify these terms. Users will be notified of significant changes with
										adequate notice.
									</p>
								</section>

								<section className="space-y-4">
									<h2 className="text-2xl font-heading font-bold">10. Contact</h2>
									<p className="text-muted-foreground leading-relaxed">
										For questions regarding these terms, contact us through the application's contact form.
									</p>
								</section>
							</>
						)}
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default Terms
