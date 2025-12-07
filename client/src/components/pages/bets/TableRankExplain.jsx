import { useSelector } from "react-redux";

const TableRankExplain = () => {
  const currentTournament = useSelector((state) =>
    state.tournaments.tournaments.find((t) => t._id === localStorage.getItem("tournamentId"))
  );

	return (
		<div href="#" className="bg-white block max-w-sm p-6 border border-default rounded-lg shadow-xs hover:bg-neutral-secondary-medium">
    <h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">שוברי שויון לקביעת המנצח</h5>
    <p className="text-body">1. מספר הנקודות הכולל</p>
    <p className="text-body">2. מספר ניחושים מדויקים</p>
    <p className="text-body">3. מספר ניחושים נכונים</p>
    <p className="text-body">4. הימור נכון על קבוצה זוכה</p>
    {/* Show this show only if the tournament includes the top scorer bet */}
    {currentTournament.topScorerBet && <p className="text-body">5. הימור נכון על מלך השערים</p>}
</div>
	);
};

export default TableRankExplain;
