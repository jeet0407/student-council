"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Navbar() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	function goToDashboard(e) {
		e.preventDefault()
		if (status === "authenticated") {
			router.push("/dashboard")
		} else {
			router.push("/login")
		}
		setIsMenuOpen(false)
	}

	return (
		<header className="py-4 px-4 md:px-8 border-b border-white/20">
			<nav className="flex items-center justify-between">
				<Link href="/" className="font-bold flex items-center gap-2 text-base md:text-lg">
					<img src="/logo-svnit.png" alt="SVNIT Logo" className="h-8 w-8 md:h-10 md:w-10" />
					<span className="hidden sm:inline text-black">SVNIT SAMPARK</span>
					<span className="sm:hidden text-black">SAMPARK</span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex gap-8 items-center text-black text-lg">
					<a 
						href="#" 
						onClick={goToDashboard} 
						className="cursor-pointer hover:text-black hover:underline underline-offset-4 transition-all py-2 px-3"
					>
						Dashboard
					</a>

					<Link href="/dashboard/dean-swo/announcements" className="hover:text-black hover:underline underline-offset-4 transition-all py-2 px-3">
						Announcements
					</Link>

					<Link href="/dashboard/dean-swo/upcoming-event" className="hover:text-black hover:underline underline-offset-4 transition-all py-2 px-3">
						Events
					</Link>

					{status === "authenticated" && (
						<>
							<span className="text-base text-gray-200 ml-2 bg-green-500 rounded-4xl px-4 py-2  ">
								{session?.user?.name}
							</span>
							<button
								onClick={() => signOut({ callbackUrl: '/login' })}
								className="text-base text-white bg-red-500 hover:bg-red-700 rounded-1xl transition-all py-2 px-3"
							>
								Sign Out
							</button>
						</>
					)}
				</div>

				{/* Hamburger Button */}
				<button
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-white/20 rounded transition-colors"
					aria-label="Toggle menu"
				>
					<span className={`block w-6 h-0.5 bg-black transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
					<span className={`block w-6 h-0.5 bg-black transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
					<span className={`block w-6 h-0.5 bg-black transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
				</button>
			</nav>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="md:hidden mt-3 py-3 border-t border-white/20 flex flex-col gap-4 text-base bg-black/40 backdrop-blur-sm rounded-lg px-4">
					<a 
						href="#" 
						onClick={goToDashboard} 
						className="cursor-pointer hover:text-black hover:underline underline-offset-4 transition-all py-2"
					>
						Dashboard
					</a>

					<Link 
						href="/dashboard/dean-swo/announcements" 
						className="hover:text-black hover:underline underline-offset-4 transition-all py-2"
						onClick={() => setIsMenuOpen(false)}
					>
						Announcements
					</Link>

					<Link 
						href="/dashboard/dean-swo/upcoming-event" 
						className="hover:text-black hover:underline underline-offset-4 transition-all py-2"
						onClick={() => setIsMenuOpen(false)}
					>
						Events
					</Link>

					{status === "authenticated" && (
						<>
							<div className="border-t border-white/20 pt-3 mt-2">
								<p className="text-xs text-gray-300 mb-2">Signed in as:</p>
								<p className="text-sm font-medium text-white mb-3">{session?.user?.name}</p>
								<button
									onClick={() => {
										setIsMenuOpen(false);
										signOut({ callbackUrl: '/login' });
									}}
									className="w-full text-left text-sm text-red-400 hover:text-red-300 hover:underline underline-offset-4 transition-all py-2"
								>
									Sign Out
								</button>
							</div>
						</>
					)}
				</div>
			)}
		</header>
	)
}

