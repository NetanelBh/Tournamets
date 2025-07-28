import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TournamentList from "../../UI/lists/tournament/TournamentList";

const MyTournaments = () => {
	const myTournaments = useSelector((state) => state.user.user.tournaments);
    const allTournaments = useSelector((state) => state.tournaments.tournaments);
    const navigate = useNavigate();
    
    const filteredTournamets = allTournaments.filter((t) => myTournaments.includes(t._id));

    const enterGroupHandler = () => {
        navigate("/layout/groups-layout/my-groups");
    };
    
    return <TournamentList dataList={filteredTournamets} btnText="כניסה" onClick={enterGroupHandler}/>
};

export default MyTournaments;
