import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const NotFound = () => {
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		console.error('404 Error: User attempted to access non-existent route:', location.pathname)
		// Redirect to home after 1 second
		const timer = setTimeout(() => {
			navigate('/', { replace: true })
		}, 1000)

		return () => clearTimeout(timer)
	}, [location.pathname, navigate])

	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<div className="text-center space-y-4">
				<h1 className="text-6xl font-heading font-bold text-primary">404</h1>
				<p className="text-xl text-muted-foreground">Przekierowywanie na stronę główną...</p>
				<p className="text-sm text-muted-foreground">Redirecting to home page...</p>
			</div>
		</div>
	)
}

export default NotFound
