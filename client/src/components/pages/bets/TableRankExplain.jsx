import { useSelector } from "react-redux";

import ExplainData from "./ExplainData";
import BetsLayout from "../layouts/BetsLayout";
import ExplainDataHeader from "./ExplainDataHeader";

const TableRankExplain = () => {
	const currentTournament = useSelector((state) =>
		state.tournaments.tournaments.find((t) => t._id === localStorage.getItem("tournamentId"))
	);

	const data = ["מספר הנקודות הכולל", "מספר ניחושים מדויקים", "מספר ניחושים נכונים", "הימור נכון על קבוצה זוכה"];

	return (
		<div className="flex flex-col items-center">
			<BetsLayout />

			<div className="bg-white block max-w-sm p-6 border border-default rounded-lg shadow-[0_0_8px_3px_theme(colors.teal.200)] hover:bg-neutral-secondary-medium fade_up">
				<ExplainDataHeader header="שוברי שויון לקביעת המנצח" />
				<ExplainData data={data} />

				{/* Show this show only if the tournament includes the top scorer bet */}
				{currentTournament.topScorerBet && <p className="text-body">5) הימור נכון על מלך השערים</p>}
			</div>
		</div>
	);
};

export default TableRankExplain;
