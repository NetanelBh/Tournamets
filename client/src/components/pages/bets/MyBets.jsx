import { useSelector } from "react-redux";

import Dropdown from "../../UI/Dropdown";

const MyBets = () => {
	const allTournaments = useSelector((state) => state.tournaments.tournaments);
	// Get the current tournament to use the teams for the winner team prediction of the user
	const currentTourmanent = allTournaments.find((t) => t._id === localStorage.getItem("tournamentId"));
	console.log(currentTourmanent);

  // TODO: 1) USE THE USEEFFECT TO FETCH THE PLAYERS FROM DB ONLY IF THE TOURNAMENT DEFINED WITH TOP SCORER BETS
	// TODO: 2) CREATE A LIST WITH THE MATCHES THAT DIDN'T START YET
	return (
		<div className="flex flex-col">
			<div className="flex gap-8">
        <Dropdown data={currentTourmanent.teams}/>
        
        {/* Show the topScorer dropdown only if the tournament defined to be with top scorer bet */}
        {currentTourmanent.includesTopScorer && <Dropdown data={[]}/>}
      </div>
		</div>
	);
};

export default MyBets;
