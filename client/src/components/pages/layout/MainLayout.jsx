import { Outlet, useNavigate } from "react-router-dom";
import Header from "../header/Header";

const MainLayout = () => {
	return (
		<>
            <Header />
			<div>MainLayout</div>
			{Outlet}
		</>
	);
};

export default MainLayout;
