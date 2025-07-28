import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../header/Header";

const MainLayout = () => {
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.user);
    
    const logout = () => {
        sessionStorage.clear();
        navigate("/");
    };

	return (
		<>
            <Header name={`${user.firstname} ${user.lastname}`} logout={logout}/>
            <Outlet />
		</>
	);
};

export default MainLayout;
