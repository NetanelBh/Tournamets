import { useState } from "react";

const Header = () => {
	const [activeLink, setActiveLink] = useState("home");
	// When using small screens like mobile, When click the menu button I want to open the menu.
	const [isOpenMenu, setIsOpenMenu] = useState(false);

	const getLinkClass = (key) =>
		`hover:text-gray-300 transition-all ${activeLink === key ? "text-yellow-400 font-semibold" : ""}`;

	return (
		<header class="bg-blue-900 text-white">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
				<div class="flex items-center justify-between">
					{/* Logo Section */}
					<div class="flex-shrink-0">
						<a href="#" class="text-2xl font-bold">
							Tailwind{" "}
						</a>
					</div>

					{/* Navigation Menu */}
					<nav class="hidden md:flex space-x-10 text-lg">
						<a href="#" class={getLinkClass("home")} onClick={() => setActiveLink("home")}>
							Home
						</a>
						<a href="#services" class={getLinkClass("services")} onClick={() => setActiveLink("services")}>
							Services
						</a>
						<a href="#about" class={getLinkClass("about")} onClick={() => setActiveLink("about")}>
							About Us
						</a>
						<a href="#contact" class={getLinkClass("contact")} onClick={() => setActiveLink("contact")}>
							Contact
						</a>
					</nav>

					{/* Call to action button */}
					<div class="hidden md:block">
						<a
							href="#contact"
							class="bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-6 rounded-full text-lg transition-all"
						>
							Get in Touch
						</a>
					</div>

					{/* Mobile Menu Button (for smaller screens)  */}
					<div class="md:hidden flex items-center">
						<button
							id="menu-button"
							class="text-white focus:outline-none"
							onClick={() => setIsOpenMenu(!isOpenMenu)}
						>
							<svg
								class="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								></path>
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Navigation Menu  */}
				{isOpenMenu && (
					<div id="mobile-menu" class="md:hidden mt-5 space-y-4">
						<a href="#" class="block text-lg hover:text-gray-300 transition-all">
							Home
						</a>
						<a href="#services" class="block text-lg hover:text-gray-300 transition-all">
							Services
						</a>
						<a href="#about" class="block text-lg hover:text-gray-300 transition-all">
							About Us
						</a>
						<a href="#contact" class="block text-lg hover:text-gray-300 transition-all">
							Contact
						</a>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
