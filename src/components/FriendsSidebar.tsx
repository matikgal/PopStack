import { useState, useEffect } from 'react'
import { Users, UserPlus, Check, X, Search, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
import {
	useFriends,
	usePendingFriendRequests,
	useSentFriendRequests,
	useAcceptFriendRequest,
	useRejectFriendRequest,
	useRemoveFriend,
	useSendFriendRequest,
	useSearchUsers,
} from '@/hooks/useFriends'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

export const FriendsSidebar = () => {
	const { language } = useLanguage()
	const { toast } = useToast()
	const [searchQuery, setSearchQuery] = useState('')
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
	const [activeTab, setActiveTab] = useState('friends')

	// Debounce search query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery)
		}, 300)

		return () => clearTimeout(timer)
	}, [searchQuery])

	const { data: friends, isLoading: friendsLoading } = useFriends()
	const { data: pendingRequests, isLoading: pendingLoading } = usePendingFriendRequests()
	const { data: sentRequests } = useSentFriendRequests()
	const { data: searchResults } = useSearchUsers(debouncedSearchQuery)

	const acceptRequest = useAcceptFriendRequest()
	const rejectRequest = useRejectFriendRequest()
	const removeFriend = useRemoveFriend()
	const sendRequest = useSendFriendRequest()

	const handleAccept = async (friendshipId: string, username: string) => {
		try {
			await acceptRequest.mutateAsync(friendshipId)
			toast({
				title: language === 'pl' ? 'Zaakceptowano' : 'Accepted',
				description: language === 'pl' ? `Jesteś teraz znajomym z ${username}` : `You are now friends with ${username}`,
			})
		} catch (error) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Nie udało się zaakceptować' : 'Failed to accept',
				variant: 'destructive',
			})
		}
	}

	const handleReject = async (friendshipId: string) => {
		try {
			await rejectRequest.mutateAsync(friendshipId)
			toast({
				title: language === 'pl' ? 'Odrzucono' : 'Rejected',
				description: language === 'pl' ? 'Zaproszenie zostało odrzucone' : 'Request has been rejected',
			})
		} catch (error) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Nie udało się odrzucić' : 'Failed to reject',
				variant: 'destructive',
			})
		}
	}

	const handleRemove = async (friendshipId: string, username: string) => {
		try {
			await removeFriend.mutateAsync(friendshipId)
			toast({
				title: language === 'pl' ? 'Usunięto' : 'Removed',
				description: language === 'pl' ? `Usunięto ${username} ze znajomych` : `Removed ${username} from friends`,
			})
		} catch (error) {
			toast({
				title: language === 'pl' ? 'Błąd' : 'Error',
				description: language === 'pl' ? 'Nie udało się usunąć' : 'Failed to remove',
				variant: 'destructive',
			})
		}
	}

	const handleSendRequest = async (friendId: string, username: string) => {
		try {
			await sendRequest.mutateAsync(friendId)
			toast({
				title: language === 'pl' ? 'Wysłano' : 'Sent',
				description: language === 'pl' ? `Wysłano zaproszenie do ${username}` : `Sent request to ${username}`,
			})
			setSearchQuery('')
		} catch (error: any) {
			const errorMessage = error?.message || ''

			// Sprawdź typ błędu
			if (errorMessage.includes('already sent') || errorMessage.includes('duplicate')) {
				toast({
					title: language === 'pl' ? 'Już wysłano' : 'Already sent',
					description: language === 'pl' ? 'Zaproszenie zostało już wysłane' : 'Request already sent',
				})
			} else if (errorMessage.includes('Already friends')) {
				toast({
					title: language === 'pl' ? 'Już znajomi' : 'Already friends',
					description:
						language === 'pl' ? `Jesteś już znajomym z ${username}` : `You are already friends with ${username}`,
				})
			} else {
				toast({
					title: language === 'pl' ? 'Błąd' : 'Error',
					description: language === 'pl' ? 'Nie udało się wysłać zaproszenia' : 'Failed to send request',
					variant: 'destructive',
				})
			}
		}
	}

	const isAlreadyFriend = (userId: string) => {
		return friends?.some(f => f.friendProfile.id === userId)
	}

	const hasPendingRequest = (userId: string) => {
		return sentRequests?.some(r => r.friend_id === userId)
	}

	return (
		<aside className="w-full xl:w-80 border-l-2 border-border flex flex-col h-full glass-panel flex-shrink-0">
			{/* Header */}
			<div className="p-4 lg:p-6 border-b-2 border-border flex-shrink-0">
				<div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
					<div className="p-1.5 lg:p-2 bg-primary/10 border-2 border-primary rounded-sm flex-shrink-0">
						<Users className="text-primary" size={20} />
					</div>
					<div className="flex-1 min-w-0">
						<h2 className="text-xl lg:text-2xl font-heading font-bold truncate">
							{language === 'pl' ? 'Znajomi' : 'Friends'}
						</h2>
						<p className="text-xs text-muted-foreground">
							{friends?.length || 0} {language === 'pl' ? 'znajomych' : 'friends'}
						</p>
					</div>
				</div>

				{/* Search */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
					<Input
						placeholder={language === 'pl' ? 'Szukaj użytkowników...' : 'Search users...'}
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>

				{/* Search Results */}
				{debouncedSearchQuery && (
					<div className="mt-2 border-2 border-border rounded-sm bg-card max-h-48 lg:max-h-60 overflow-y-auto custom-scrollbar">
						{searchResults && searchResults.length > 0 ? (
							searchResults.map(user => (
								<div
									key={user.id}
									className="p-2 lg:p-3 hover:bg-accent transition-colors flex items-center justify-between gap-2">
									<div className="flex items-center gap-2 flex-1 min-w-0">
										<Avatar className="h-7 w-7 lg:h-8 lg:w-8 border-2 border-border flex-shrink-0">
											<AvatarImage src={user.avatar_url || undefined} />
											<AvatarFallback className="bg-primary text-primary-foreground text-xs">
												{user.username?.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<span className="text-xs lg:text-sm font-semibold truncate">{user.username}</span>
									</div>
									{isAlreadyFriend(user.id) ? (
										<Badge variant="secondary" className="text-xs flex-shrink-0">
											{language === 'pl' ? 'Znajomy' : 'Friend'}
										</Badge>
									) : hasPendingRequest(user.id) ? (
										<Badge variant="outline" className="text-xs flex-shrink-0">
											{language === 'pl' ? 'Wysłano' : 'Sent'}
										</Badge>
									) : (
										<Button
											size="sm"
											variant="ghost"
											onClick={() => handleSendRequest(user.id, user.username || '')}
											className="h-7 px-2 flex-shrink-0">
											<UserPlus size={14} />
										</Button>
									)}
								</div>
							))
						) : (
							<div className="p-4 text-center text-sm text-muted-foreground">
								{language === 'pl' ? 'Nie znaleziono użytkowników' : 'No users found'}
							</div>
						)}
					</div>
				)}
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
				<div className="px-3 lg:px-4 pt-3 lg:pt-4 pb-2">
					<TabsList className="w-full grid grid-cols-2">
						<TabsTrigger value="friends" className="relative text-xs lg:text-sm">
							{language === 'pl' ? 'Znajomi' : 'Friends'}
						</TabsTrigger>
						<TabsTrigger
							value="requests"
							className="relative flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-sm">
							<span>{language === 'pl' ? 'Zaproszenia' : 'Requests'}</span>
							{pendingRequests && pendingRequests.length > 0 && (
								<Badge
									variant="destructive"
									className="h-4 lg:h-5 min-w-4 lg:min-w-5 px-1 lg:px-1.5 flex items-center justify-center text-xs">
									{pendingRequests.length}
								</Badge>
							)}
						</TabsTrigger>
					</TabsList>
				</div>

				{/* Friends List */}
				<TabsContent value="friends" className="flex-1 overflow-y-auto custom-scrollbar p-3 lg:p-4 space-y-2 mt-0">
					{friendsLoading ? (
						<div className="space-y-2">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="h-16 bg-muted animate-pulse rounded-sm" />
							))}
						</div>
					) : !friends || friends.length === 0 ? (
						<div className="text-center py-12 space-y-3">
							<Users className="mx-auto text-muted-foreground" size={48} />
							<p className="text-muted-foreground">
								{language === 'pl' ? 'Nie masz jeszcze znajomych' : 'No friends yet'}
							</p>
							<p className="text-sm text-muted-foreground">
								{language === 'pl' ? 'Wyszukaj użytkowników powyżej' : 'Search for users above'}
							</p>
						</div>
					) : (
						friends.map(friendship => (
							<div
								key={friendship.id}
								className="p-2 lg:p-3 border-2 border-border rounded-sm hover:bg-accent transition-colors group cursor-pointer"
								onClick={() => (window.location.href = `/profile/${friendship.friendProfile.id}`)}>
								<div className="flex items-center gap-2 lg:gap-3">
									<Avatar className="h-9 w-9 lg:h-10 lg:w-10 border-2 border-border flex-shrink-0">
										<AvatarImage src={friendship.friendProfile.avatar_url || undefined} />
										<AvatarFallback className="bg-primary text-primary-foreground text-sm">
											{friendship.friendProfile.username?.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<p className="text-sm lg:text-base font-semibold truncate">{friendship.friendProfile.username}</p>
										<p className="text-xs text-muted-foreground">{language === 'pl' ? 'Znajomy' : 'Friend'}</p>
									</div>
									<Button
										size="sm"
										variant="ghost"
										onClick={e => {
											e.stopPropagation()
											handleRemove(friendship.id, friendship.friendProfile.username || '')
										}}
										className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
										<X size={16} />
									</Button>
								</div>
							</div>
						))
					)}
				</TabsContent>

				{/* Pending Requests */}
				<TabsContent value="requests" className="flex-1 overflow-y-auto custom-scrollbar p-3 lg:p-4 space-y-2 mt-0">
					{pendingLoading ? (
						<div className="space-y-2">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="h-20 bg-muted animate-pulse rounded-sm" />
							))}
						</div>
					) : !pendingRequests || pendingRequests.length === 0 ? (
						<div className="text-center py-12 space-y-3">
							<Clock className="mx-auto text-muted-foreground" size={48} />
							<p className="text-muted-foreground">
								{language === 'pl' ? 'Brak oczekujących zaproszeń' : 'No pending requests'}
							</p>
						</div>
					) : (
						pendingRequests.map(request => (
							<div key={request.id} className="p-2 lg:p-3 border-2 border-border rounded-sm bg-card">
								<div className="flex items-center gap-2 mb-2">
									<Avatar className="h-8 w-8 lg:h-9 lg:w-9 border-2 border-border flex-shrink-0">
										<AvatarImage src={request.user.avatar_url || undefined} />
										<AvatarFallback className="bg-primary text-primary-foreground text-xs lg:text-sm">
											{request.user.username?.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-xs lg:text-sm truncate">{request.user.username}</p>
										<p className="text-xs text-muted-foreground truncate">
											{language === 'pl' ? 'Zaproszenie' : 'Friend request'}
										</p>
									</div>
								</div>
								<div className="flex gap-2">
									<Button
										size="sm"
										variant="default"
										className="flex-1 h-8 text-xs"
										onClick={() => handleAccept(request.id, request.user.username || '')}>
										<Check size={14} className="mr-1" />
										{language === 'pl' ? 'Akceptuj' : 'Accept'}
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="flex-1 h-8 text-xs"
										onClick={() => handleReject(request.id)}>
										<X size={14} className="mr-1" />
										{language === 'pl' ? 'Odrzuć' : 'Reject'}
									</Button>
								</div>
							</div>
						))
					)}
				</TabsContent>
			</Tabs>
		</aside>
	)
}
