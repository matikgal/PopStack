import { ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { FriendsSidebar } from './FriendsSidebar'
import { DemoBanner } from './DemoBanner'
import { Button } from './ui/button'
import { Menu, Users, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

interface LayoutProps {
	children: ReactNode
	showFriendsSidebar?: boolean
}

export const Layout = ({ children, showFriendsSidebar = true }: LayoutProps) => {
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false)

	return (
		<>
			<DemoBanner />
			<div className="flex h-screen w-full bg-background overflow-hidden">
				{/* Desktop Left Sidebar - ukryty na < lg */}
				<div className="hidden lg:block">
					<Sidebar />
				</div>

				{/* Mobile/Tablet Header z hamburgerami */}
				<div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-background border-b-2 border-border flex items-center justify-between px-4">
					{/* Left hamburger - menu */}
					<Sheet open={leftSidebarOpen} onOpenChange={setLeftSidebarOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="lg:hidden">
								<Menu size={24} />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="p-0 w-64 border-r-2">
							<Sidebar />
						</SheetContent>
					</Sheet>

					{/* Logo w środku */}
					<h1 className="text-2xl logo-text text-primary font-bold">PopStack</h1>

					{/* Right hamburger - znajomi */}
					{showFriendsSidebar && (
						<Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="xl:hidden">
									<Users size={24} />
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="p-0 w-80 border-l-2">
								<FriendsSidebar />
							</SheetContent>
						</Sheet>
					)}
				</div>

				{/* Main content */}
				<main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-w-0 pt-16 lg:pt-0">
					{children}
				</main>

				{/* Desktop Right Sidebar - ukryty na < xl, z przyciskiem na lg-xl */}
				{showFriendsSidebar && (
					<>
						{/* Przycisk do wysuwania na lg-xl */}
						<div className="hidden lg:block xl:hidden fixed right-4 top-4 z-30">
							<Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
								<SheetTrigger asChild>
									<Button variant="brutal" size="icon" className="h-12 w-12">
										<Users size={24} />
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="p-0 w-80 border-l-2">
									<FriendsSidebar />
								</SheetContent>
							</Sheet>
						</div>

						{/* Stały sidebar na xl+ */}
						<aside className="hidden xl:block flex-shrink-0">
							<FriendsSidebar />
						</aside>
					</>
				)}
			</div>
		</>
	)
}
