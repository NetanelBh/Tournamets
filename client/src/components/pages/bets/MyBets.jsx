import { useSelector } from "react-redux"

const MyBets = () => {
    const allTournaments = useSelector((state) => state.tournaments.tournaments);
    // Get the current tournament to use the teams for the winner team prediction of the user
    const currentTourmanent = allTournaments.find((t) => t._id === localStorage.getItem("tournamentId"));
    // console.log(currentTourmanent);
    
    // TODO: CREATE A LIST WITH THE MATCHES THAT DIDN'T START YET
  return (
    <div>MyBets</div>
  )
}

export default MyBets