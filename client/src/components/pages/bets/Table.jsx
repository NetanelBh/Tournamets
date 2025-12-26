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
	const [modalText, setModalText] = useState({});
	const [navigateTo, setNavigateTo] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [usersWinnerTeam, setUsersWinnerTeam] = useState([]);
	const [usersTopScorer, setUsersTopScorer] = useState([]);

	const tournamentId = localStorage.getItem("tournamentId");
	const groupId = localStorage.getItem("groupId");

	// Fetch all users top scorer and winner team bets(only once)
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const [allUsersTopScorers, allUsersWinnerTeams] = await Promise.all([
					API.post("/topScorerBet/getAllByGroup", { tournamentId, groupId }),
					API.post("/winnerTeamBet/getAllByGroup", { tournamentId, groupId }),
				]);

				setUsersTopScorer(allUsersTopScorers.data.data);
				setUsersWinnerTeam(allUsersWinnerTeams.data.data);
			} catch (error) {
				setOpenModal(true);
				setModalText({ title: "טבלה", text: "אירעה שגיאה בטעינת הטבלה אנא נסה שנית" });
				setNavigateTo("/layout/bets-table");
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
		groupPointsRules: useSelector((state) => state.user.user.groups.find((g) => g._id === groupId)).points,
		// Get the current tournament to get the top scorer bonus and the winner team bonus
		tournamentTopScorerId: useSelector(
			(state) => state.tournaments.tournaments.find((t) => t._id === tournamentId).topScorer
		),
		usersTopScorers: usersTopScorer,
		usersWinnerTeams: usersWinnerTeam,
	};

	// Sorted users points list to display in table
	const usersTableData = usersPoints(data);

	return (
		<>
			{isLoading && <Loading />}

			{!isLoading && (
				<div className="flex flex-col items-center">
					<BetsLayout />

					{!openModal && (
						<div className="flex justify-center w-full sm:px-4">
							<div className="w-fit overflow-x-auto bg-white shadow sm:rounded-lg border border-gray-200">
								<table className="w-fit text-sm text-left rtl:text-right">
									<TableHeader
										data={tableHeaders}
										theadClass="bg-[#A3E5FF] text-black text-xs font-bold border-b border-gray-200"
									/>

									<tbody className="divide-y divide-gray-200">
										{usersTableData.map((user, index) => (
											<TableRow
												key={index}
												data={{ user, i: index }}
												trClass="bg-white hover:bg-gray-200 text-xs"
												thClass="px-6 py-4 whitespace-nowrap border border-l-black"
												tdClass="px-6 py-4 border border-l-black"
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
