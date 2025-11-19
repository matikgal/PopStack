import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useTheme } from '@/hooks/useTheme'
import Dashboard from './pages/Dashboard'
import Discover from './pages/Discover'
import Watchlist from './pages/Watchlist'
import Collection from './pages/Collection'
import Profile from './pages/Profile'
import FriendProfile from './pages/FriendProfile'
import Settings from './pages/Settings'
import Login from './pages/Login'
import About from './pages/About'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

// Komponent który stosuje motyw globalnie
function ThemeProvider({ children }: { children: React.ReactNode }) {
	useTheme() // Automatycznie ładuje i stosuje motyw
	return <>{children}</>
}

const App = () => (
	<QueryClientProvider client={queryClient}>
		<ThemeProvider>
			<TooltipProvider>
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<LanguageProvider>
						<AuthProvider>
							<Routes>
								<Route path="/login" element={<Login />} />
								<Route
									path="/"
									element={
										<ProtectedRoute>
											<Dashboard />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/discover"
									element={
										<ProtectedRoute>
											<Discover />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/watchlist"
									element={
										<ProtectedRoute>
											<Watchlist />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/collection"
									element={
										<ProtectedRoute>
											<Collection />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/profile"
									element={
										<ProtectedRoute>
											<Profile />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/profile/:userId"
									element={
										<ProtectedRoute>
											<FriendProfile />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/settings"
									element={
										<ProtectedRoute>
											<Settings />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/about"
									element={
										<ProtectedRoute>
											<About />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/terms"
									element={
										<ProtectedRoute>
											<Terms />
										</ProtectedRoute>
									}
								/>
								{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
								<Route path="*" element={<NotFound />} />
							</Routes>
						</AuthProvider>
					</LanguageProvider>
				</BrowserRouter>
			</TooltipProvider>
		</ThemeProvider>
	</QueryClientProvider>
)

export default App
