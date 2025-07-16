import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/login/Login";    
import Register from "../pages/register/Register";
import MainLayout from "../pages/layout/MainLayout";
import VerifyEmail from "../pages/verifyEmail/VerifyEmail";
import ResetPassword from "../pages/resetPassword/ResetPassword";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";

import AllTournaments from "../pages/tournaments/AllTournaments";

const CreateRouter = () => {
    const router = createBrowserRouter([
        { path: "/", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/reset-password/:token", element: <ResetPassword /> },
        { path: "/verify/:token", element: <VerifyEmail /> },
        {path: "/forgot-password", element: <ForgotPassword />},
        {path: "/layout", element: <MainLayout />, children: [
            {path: "/layout/all-tournaments", element: <AllTournaments />}
        ]},
    ]);

    return router;
};

export default CreateRouter;