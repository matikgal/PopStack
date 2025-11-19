// System tłumaczeń PL/EN
export type Language = 'pl' | 'en'

export const translations = {
	pl: {
		// Sidebar
		appName: 'PopStack',
		appSubtitle: 'Panel Mediów',
		dashboard: 'Panel',
		discover: 'Odkrywaj',
		watchlist: 'Lista',
		myCollection: 'Moja Kolekcja',
		profile: 'Profil',
		settings: 'Ustawienia',
		signOut: 'Wyloguj',
		signIn: 'Zaloguj',

		// Footer links
		terms: 'Regulamin',
		about: 'O aplikacji',

		// Dashboard
		welcomeBack: 'Witaj ponownie',
		yourMedia: 'Twoje Media,',
		trackedStacked: 'Śledzone i Uporządkowane',
		dashboardSubtitle: 'Odkrywaj, zbieraj i dziel się swoją podróżą przez filmy, seriale i gry.',
		exploreNow: 'Odkrywaj teraz',
		trendingNow: 'Popularne teraz',
		trendingSubtitle: 'Co wszyscy oglądają i grają',
		viewAll: 'Zobacz wszystko',
		featuredCollections: 'Wyróżnione Kolekcje',
		collectionsSubtitle: 'Wyselekcjonowane listy na każdy nastrój',
		items: 'elementów',

		// Login
		createAccount: 'Utwórz konto',
		welcomeBackLogin: 'Witaj ponownie',
		joinUs: 'Dołącz do nas i zacznij śledzić swoją podróż medialną',
		signInSubtitle: 'Zaloguj się, aby kontynuować śledzenie swojej podróży medialnej',
		email: 'Email',
		password: 'Hasło',
		signUp: 'Zarejestruj się',
		loading: 'Ładowanie...',
		orContinueWith: 'LUB KONTYNUUJ Z',
		continueWithGoogle: 'Kontynuuj z Google',
		alreadyHaveAccount: 'Masz już konto?',
		dontHaveAccount: 'Nie masz konta?',
		trackEverything: 'Śledź Wszystko',
		youLove: 'Co Kochasz',
		loginHeroText: 'Filmy, seriale i gry w jednym miejscu. Dołącz do tysięcy entuzjastów mediów.',

		// Friends
		friends: 'Znajomi',
		searchUsers: 'Szukaj użytkowników...',
		noFriendsYet: 'Nie masz jeszcze znajomych',
		searchForUsers: 'Wyszukaj użytkowników powyżej',
		requests: 'Zaproszenia',
		noPendingRequests: 'Brak oczekujących zaproszeń',
		wantsToBeFriend: 'Chce być Twoim znajomym',
		accept: 'Akceptuj',
		reject: 'Odrzuć',
		friend: 'Znajomy',
		sent: 'Wysłano',
		accepted: 'Zaakceptowano',
		rejected: 'Odrzucono',
		removed: 'Usunięto',
		requestSent: 'Wysłano zaproszenie',
		requestAccepted: 'Jesteś teraz znajomym',
		requestRejected: 'Zaproszenie zostało odrzucone',
		friendRemoved: 'Usunięto ze znajomych',
	},
	en: {
		// Sidebar
		appName: 'PopStack',
		appSubtitle: 'Media Dashboard',
		dashboard: 'Dashboard',
		discover: 'Discover',
		watchlist: 'My List',
		myCollection: 'My Collection',
		profile: 'Profile',
		settings: 'Settings',
		signOut: 'Sign Out',
		signIn: 'Sign In',

		// Footer links
		terms: 'Terms',
		about: 'About',

		// Dashboard
		welcomeBack: 'Welcome Back',
		yourMedia: 'Your Media,',
		trackedStacked: 'Tracked & Stacked',
		dashboardSubtitle: 'Discover, collect, and share your journey through movies, series, and games.',
		exploreNow: 'Explore Now',
		trendingNow: 'Trending Now',
		trendingSubtitle: "What everyone's watching and playing",
		viewAll: 'View All',
		featuredCollections: 'Featured Collections',
		collectionsSubtitle: 'Curated lists for every mood',
		items: 'items',

		// Login
		createAccount: 'Create Account',
		welcomeBackLogin: 'Welcome Back',
		joinUs: 'Join us and start tracking your media journey',
		signInSubtitle: 'Sign in to continue tracking your media journey',
		email: 'Email',
		password: 'Password',
		signUp: 'Sign Up',
		loading: 'Loading...',
		orContinueWith: 'OR CONTINUE WITH',
		continueWithGoogle: 'Continue with Google',
		alreadyHaveAccount: 'Already have an account?',
		dontHaveAccount: "Don't have an account?",
		trackEverything: 'Track Everything',
		youLove: 'You Love',
		loginHeroText: 'Movies, series, and games all in one place. Join thousands of media enthusiasts.',

		// Friends
		friends: 'Friends',
		searchUsers: 'Search users...',
		noFriendsYet: 'No friends yet',
		searchForUsers: 'Search for users above',
		requests: 'Requests',
		noPendingRequests: 'No pending requests',
		wantsToBeFriend: 'Wants to be your friend',
		accept: 'Accept',
		reject: 'Reject',
		friend: 'Friend',
		sent: 'Sent',
		accepted: 'Accepted',
		rejected: 'Rejected',
		removed: 'Removed',
		requestSent: 'Request sent',
		requestAccepted: 'You are now friends',
		requestRejected: 'Request has been rejected',
		friendRemoved: 'Removed from friends',
	},
}

export const useTranslation = (lang: Language = 'en') => {
	return {
		t: translations[lang],
		lang,
	}
}

// Dodatkowe tłumaczenia dla akcji
export const actionTranslations = {
	pl: {
		addToCollection: 'Dodaj do kolekcji',
		addToWatchlist: 'Dodaj do listy',
		removeFromWatchlist: 'Usuń z listy',
		markAsWatched: 'Obejrzane',
		markAsPlayed: 'Zagrane',
		rateThis: 'Oceń',
		addReview: 'Dodaj opinię',
	},
	en: {
		addToCollection: 'Add to Collection',
		addToWatchlist: 'Add to Watchlist',
		removeFromWatchlist: 'Remove from Watchlist',
		markAsWatched: 'Mark as Watched',
		markAsPlayed: 'Mark as Played',
		rateThis: 'Rate',
		addReview: 'Add Review',
	},
}
