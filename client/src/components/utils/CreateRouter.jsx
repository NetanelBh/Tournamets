import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import VerifyEmail from "../pages/verifyEmail/VerifyEmail";
import ResetPassword from "../pages/resetPassword/ResetPassword";
import ForgotPassword from "../pages/forgotPassword/ForgotPassword";

import MainLayout from "../pages/layouts/MainLayout";

import MyTournaments from "../pages/tournaments/MyTournaments";
import AllTournaments from "../pages/tournaments/AllTournaments";
import CreateTournament from "../pages/tournaments/CreateTournament";

import MyGroups from "../pages/groups/MyGroups";
import JoinGroup from "../pages/groups/JoinGroup";
import CreateGroup from "../pages/groups/CreateGroup";
import GroupsLayout from "../pages/layouts/GroupsLayout";

const CreateRouter = () => {
	const router = createBrowserRouter([
		{ path: "/", element: <Login /> },
		{ path: "/register", element: <Register /> },
		{ path: "/reset-password/:token", element: <ResetPassword /> },
		{ path: "/verify/:token", element: <VerifyEmail /> },
		{ path: "/forgot-password", element: <ForgotPassword /> },
		{
			path: "/layout",
			element: <MainLayout />,
			children: [
				{ path: "/layout/all-tournaments", element: <AllTournaments /> },
				{ path: "/layout/my-tournaments", element: <MyTournaments /> },
				{ path: "/layout/create-tournament", element: <CreateTournament /> },
				{
					path: "/layout/groups-layout",
					element: <GroupsLayout />,
					children: [
						{ path: "/layout/groups-layout/my-groups", element: <MyGroups /> },
						{ path: "/layout/groups-layout/join-group", element: <JoinGroup /> },
						{ path: "/layout/groups-layout/create-group", element: <CreateGroup /> },
					],
				},
			],
		},
	]);

	return router;
};

export default CreateRouter;
