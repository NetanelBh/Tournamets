import { Outlet, useNavigate } from "react-router-dom";
import Header from "../header/Header";

const MainLayout = () => {
    const navigate = useNavigate();

    const userData = JSON.parse(sessionStorage.getItem("user"));
    
    const logout = () => {
        sessionStorage.clear();
        navigate("/");
    };

	return (
		<>
            <Header name={`${userData.firstname} ${userData.lastname}`} isAdmin={userData.admin} logout={logout}/>
            <Outlet />
		</>
	);
};

export default MainLayout;
