import { useState } from "react";
import { NavLink } from "react-router-dom";

const Header = ({ name, logout }) => {
	// When using small screens like mobile, When click the menu button I want to open the menu.
	const [isOpenMenu, setIsOpenMenu] = useState(false);

	// I did the condition because the data stored in the session storage is a string and not as boolean
	const isAdmin = sessionStorage.getItem("isAdmin") === "true";	

	const getClass = (isActiveLink) => {
		return `hover:text-gray-300 transition-all ${
			isActiveLink ? "text-yellow-400 font-semibold hover:text-yellow-400" : ""
		}`;
	};

	return (
		<header className="bg-gray-700 text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
				<div className="flex items-center justify-between">
					{/* Logo Section */}
					<div className="flex-shrink-0">
						<p className="text-2xl font-bold text-yellow-400">{name} </p>
					</div>

					{/* Navigation Menu */}
					<nav className="hidden md:flex space-x-10 text-lg">
						<NavLink to="/layout/all-tournaments" end className={({ isActive }) => getClass(isActive)}>
							כל הטורנירים
						</NavLink>

						<NavLink to="/layout/my-tournaments" end className={({ isActive }) => getClass(isActive)}>
							הטורנירים שלי
						</NavLink>

						{/* Only for admin, the option of create tournament is valid */}
						{isAdmin && (
							<NavLink to="/layout/bla" end className={({ isActive }) => getClass(isActive)}>
								צור טורניר
							</NavLink>
						)}
					</nav>

					{/* Call to action button */}
					<div className="hidden md:block">
						<button
							className="bg-yellow-400 hover:bg-red-500 hover:text-white text-black py-1 px-4 rounded-full text-lg transition-all"
							onClick={logout}
						>
							התנתק
						</button>
					</div>

					{/* Mobile Menu Button (for smaller screens)  */}
					<div className="md:hidden flex items-center">
						<button
							id="menu-button"
							className="text-white focus:outline-none"
							onClick={() => setIsOpenMenu(!isOpenMenu)}
						>
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h16"
								></path>
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Navigation Menu  */}
				{isOpenMenu && (
					<div id="mobile-menu" className="md:hidden mt-5 space-y-4">
						<a href="#" className="block text-lg active:text-gray-300 transition-all">
							כל הטורנירים
						</a>
						<a href="#הטורנירים שלי" className="block text-lg active:text-gray-300 transition-all">
							הטורנירים שלי
						</a>
						<a href="#about" className="block text-lg active:text-gray-300 transition-all">
							צור טורניר
						</a>
						<a href="#contact" className="block text-lg active:text-gray-300 transition-all">
							התנתק
						</a>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
