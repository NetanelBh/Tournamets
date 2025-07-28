import { useSelector } from "react-redux";
import TournamentList from "../../UI/lists/tournament/TournamentList";

const MyTournaments = () => {
	const myTournaments = useSelector((state) => state.user.user.tournaments);
    const allTournaments = useSelector((state) => state.tournaments.tournaments);
    
    const filteredTournamets = allTournaments.filter((t) => myTournaments.includes(t._id));
    
    return <TournamentList dataList={filteredTournamets} btnText="כניסה" />
};

export default MyTournaments;
