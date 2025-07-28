import { NavLink, useLocation } from "react-router-dom";

const GroupsHeader = () => {
    const { pathname } = useLocation();
    
	return (
		<header className="text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:mt-4">
				<div className="flex justify-center">
					{/* Navigation Menu */}
					<nav className="md:flex space-x-10 text-lg">
						<NavLink
							to="/layout/groups-layout/my-groups"
							className={`hover:text-gray-300 transition-all ${
								pathname.includes("my-groups")
									? "text-yellow-400 font-semibold hover:text-yellow-400"
									: ""
							}`}
						>
							הקבוצות שלי
						</NavLink>

						<NavLink
							to="/layout/groups-layout/join-groups"
							className={`hover:text-gray-300 transition-all ${
								pathname.includes("join-groups")
									? "text-yellow-400 font-semibold hover:text-yellow-400"
									: ""
							}`}
						>
							הצטרף לקבוצה
						</NavLink>
					</nav>
				</div>
			</div>
		</header>
	);
};

export default GroupsHeader;
