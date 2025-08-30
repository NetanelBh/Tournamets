import { useSelector } from "react-redux"

const MyBets = () => {
    const allTournaments = useSelector((state) => state.tournaments.tournaments);
    const currentTourmanent = allTournaments.find((t) => t._id === localStorage.getItem("tournamentId"));
    console.log(currentTourmanent);
    
    // TODO: CREATE A LIST WITH THE MATCHES THAT DIDN'T START YET
  return (
    <div>MyBets</div>
  )
}

export default MyBets