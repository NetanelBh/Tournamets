import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/login/Login";    
import Register from "../pages/register/Register";
import VerifyEmail from "../pages/verifyEmail/VerifyEmail";
import ResetPassword from "../pages/resetPassword/ResetPassword";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";

const CreateRouter = () => {
    const router = createBrowserRouter([
        { path: "/", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/reset-password/:token", element: <ResetPassword /> },
        { path: "/verify/:token", element: <VerifyEmail /> },
        {path: "/forgot-password", element: <ForgotPassword />}
    ]);

    return router;
};

export default CreateRouter;