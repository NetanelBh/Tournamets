import API from "../../utils/Api";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { usersPoints } from "./betsUtils";
import { tableHeaders } from "./betsUtils";

import TableRow from "./TableRow";
import Modal from "../../modal/Modal";
import TableHeader from "./TableHeader";
import BetsLayout from "../layouts/BetsLayout";
import Loading from "../../UI/loading/Loading";
import { useNavigate } from "react-router-dom";

const Table = () => {
	const navigate = useNavigate();
	const groupId = localStorage.getItem("groupId");
	const user = useSelector((state) => state.user.user);
	const tournamentId = localStorage.getItem("tournamentId");

	// In case the tournament started and the user sent out of tournament and he inside some page, redirect to muGroups
	const isUserExistInGroup = user.groups.some((g) => g._id === groupId);
	if (!isUserExistInGroup) {
		navigate("/layout/groups-layout/my-groups");
		return null;
	}

	const [modalText, setModalText] = useState({});
	const [navigateTo, setNavigateTo] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [usersWinnerTeam, setUsersWinnerTeam] = useState([]);
	const [usersTopScorer, setUsersTopScorer] = useState([]);


	// Fetch all users top scorer and winner team bets(only once)
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const [allUsersTopScorers, allUsersWinnerTeams] = await Promise.all([
					API.post("/topScorerBet/getAllByGroup", { tournamentId, groupId }),
					API.post("/winnerTeamBet/getAllByGroup", { tournamentId, groupId }),
				]);

				if (!allUsersTopScorers.data.status || !allUsersWinnerTeams.data.status) {
					setOpenModal(true);
					if (allUsersTopScorers.data.data === "SESSION_EXPIRED" || allUsersWinnerTeams.data.data === "SESSION_EXPIRED") {
						setModalText({ title: "זמן חיבור עבר", text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש" });
					} else {
						setModalText({ title: "טבלה", text: "אירעה שגיאה, אנא התחבר שנית" });
					}
					
					setNavigateTo("/");
					return;
				}

				setUsersTopScorer(allUsersTopScorers.data.data);
				setUsersWinnerTeam(allUsersWinnerTeams.data.data);
			} catch (error) {
				setOpenModal(true);
				setModalText({ title: "טבלה", text: "אירעה שגיאה, אנא התחבר שנית" });
				setNavigateTo("/");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const closeModalHandler = () => {
		setOpenModal(false);
		navigate(navigateTo);
	};

	// Create an object with all required data to calculate the points from external function
	const data = {
		// Get all users to calculate the points in the table
		allUsers: useSelector((state) => state.user.allUsers),
		// Get all matches for the current tournament
		matches: useSelector((state) => state.matches.matches),
		// Get all users bets for the current tournament - it's an object {matchId: [bets]}
		usersBets: useSelector((state) => state.bets),
		// Get the current group points rules(calculate the points for the each user in the table and exact/directions bets)
		groupPointsRules: useSelector((state) => user.groups.find((g) => g._id === groupId)).points,
		// Get the current tournament to get the top scorer bonus
		tournamentTopScorerId: useSelector(
			(state) => state.tournaments.tournaments.find((t) => t._id === tournamentId).topScorer
		),
		// Get the current tournament to get the winner team bonus
		tournamentWinnerTeam: useSelector(
			(state) => state.tournaments.tournaments.find((t) => t._id === tournamentId).winnerTeam
		),
		
		usersTopScorers: usersTopScorer,
		usersWinnerTeams: usersWinnerTeam,
	};

	// Sorted users points list to display in table
	const usersTableData = usersPoints(data);

	// Get the kickoff time to determine if the tournament is already started and show the total money in the group
	const tournamentKickoffTime = useSelector((state) => state.tournaments.tournaments).find(
		(tournament) => tournament._id === tournamentId
	).startTime;

	const currentTime = useSelector((state) => state.clock.now);

	// Calculate the total money
	const totalMoney = data.allUsers.length * 150;

	return (
		<>
			{isLoading && <Loading />}

			{!isLoading && (
				<div className="flex flex-col items-center">
					<BetsLayout />

					{tournamentKickoffTime < currentTime && (
						<p className="text-red-700 text-xl mb-6 font-bold bg-yellow-200 px-4 py-2 rounded-sm">{` הסכום בקופה: ₪${totalMoney}`}</p>
					)}

					{!openModal && (
						<div className="flex justify-center w-full sm:px-4">
							<div className="w-fit overflow-x-auto bg-transparent shadow sm:rounded-lg border-t border-r md:border-l border-red-300">
								<table className="w-fit text-sm text-left rtl:text-right">
									<TableHeader
										data={tableHeaders}
										theadClass="text-center bg-gray-900/90 text-white text-xs font-bold border-b border-gray-200 w-fit"
									/>

									<tbody className="divide-y divide-gray-200">
										{usersTableData.map((user, index) => (
											<TableRow
												key={index}
												data={{ user, i: index }}
												trClass="bg-white hover:bg-gray-200 text-xs"
												thClass="px-6 py-4 whitespace-nowrap"
												tdClass="px-6 text-center py-4 w-fit whitespace-nowrap"
												type="points"
											/>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{openModal && <Modal title={modalText.title} text={modalText.text} onClick={closeModalHandler} />}
				</div>
			)}
		</>
	);
};

export default Table;
