import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GenericList from "../../UI/lists/tournament/GenericList";

const MyTournaments = () => {
	const myTournaments = useSelector((state) => state.user.user.tournaments);
    const allTournaments = useSelector((state) => state.tournaments.tournaments);
    const navigate = useNavigate();
    
    const filteredTournamets = allTournaments.filter((t) => myTournaments.includes(t._id));

    const enterGroupHandler = () => {
        navigate("/layout/groups-layout/my-groups");
    };

    	// send props object to generic list component
	const data = {
		dataList: filteredTournamets,
		btnText: "כניסה",
		onClick: enterGroupHandler
	}
    
    return <GenericList data={data}/>
};

export default MyTournaments;
