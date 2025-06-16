import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/login/Login";    
import Register from "../pages/register/Register";
import VerifyEmail from "../pages/verifyEmail/VerifyEmail";
import ResetPassword from "../pages/resetPassword/ResetPassword";

const CreateRouter = () => {
    const router = createBrowserRouter([
        { path: "/", element: <Register /> },
        { path: "/register", element: <Register /> },
        { path: "/reset-password/:token", element: <ResetPassword /> },
        { path: "/verify/:token", element: <VerifyEmail /> },
        { path: "/login", element: <Login /> },
    ]);

    return router;
};

export default CreateRouter;