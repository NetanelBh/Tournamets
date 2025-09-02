import { useSelector } from "react-redux";
import axios from "axios";

import Dropdown from "../../UI/Dropdown";
import { useEffect } from "react";

const MyBets = () => {
	const allTournaments = useSelector((state) => state.tournaments.tournaments);
	// Get the current tournament to use the teams for the winner team prediction of the user
	const currentTourmanent = allTournaments.find((t) => t._id === localStorage.getItem("tournamentId"));
	console.log(currentTourmanent);

  const data = {
    dropdownHeader: "הקבוצה הזוכה",
    list: currentTourmanent.teams
  };

  // TODO: FETCH THE PLAYERS FROM DB ONLY IF THE TOURNAMENT DEFINED WITH TOP SCORER BETS
  useEffect(() => {
    const fetchPlayers = async () => {
      const players = await axios.get()
    };

    if(currentTourmanent.topScorerBet) {
      fetchPlayers();
    };

  }, []);

	// TODO: 2) CREATE A LIST WITH THE MATCHES THAT DIDN'T START YET
	return (
		<div className="flex flex-col">
			<div className="flex gap-8">
        <Dropdown data={data}/>

        {/* Show the topScorer dropdown only if the tournament defined to be with top scorer bet */}
        {currentTourmanent.topScorerBet && <Dropdown data={data}/>}
      </div>
		</div>
	);
};

export default MyBets;
