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

import BetsLayout from "../pages/layouts/BetsLayout";
import MyBets from "../pages/bets/MyBets";
import ClosedMatches from "../pages/bets/ClosedMatches";
import FriendsBets from "../pages/bets/FriendsBets";
import Table from "../pages/bets/Table";

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
				{ path: "/layout/my-tournaments", element: <MyTournaments /> },
				{ path: "/layout/all-tournaments", element: <AllTournaments /> },
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
				{
					path: "/layout/bets-layout",
					element: <BetsLayout />,
					children: [
						{ path: "/layout/bets-layout/my-bets", element: <MyBets /> },
						{ path: "/layout/bets-layout/bets-table", element: <Table /> },
						{ path: "/layout/bets-layout/frients-bets", element: <FriendsBets /> },
						{ path: "/layout/bets-layout/closed-bets", element: <ClosedMatches /> },
					],
				},
			],
		},
	]);

	return router;
};

export default CreateRouter;
