import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GenericList from "../../UI/list/GenericList";
import Modal from "../../modal/Modal";

const MyTournaments = () => {
	const myTournaments = useSelector((state) => state.user.user.tournaments);
	const allTournaments = useSelector((state) => state.tournaments.tournaments);
	const navigate = useNavigate();

	const filteredTournamets = allTournaments.filter((t) => myTournaments.includes(t._id));

	// When enter to some tournament, it keep the id in localStorage in case we will create group.
	localStorage.removeItem("tournamentId");

	const enterGroupHandler = () => {
		navigate("/layout/groups-layout/my-groups");
	};

	// send props object to generic list component
	const data = {
		dataList: filteredTournamets,
		btnText: "כניסה",
		onClick: enterGroupHandler,
	};

    const joinTournamentHandler = () => {
        navigate("/layout/all-tournaments");
    };

	return (
		<>
			{filteredTournamets.length > 0 && <GenericList data={data} />}
			{filteredTournamets.length === 0 && <Modal title="הטורנירים שלי" text="לא הצטרפת עדיין לאף טורניר" onClick={joinTournamentHandler}/>}
		</>
	);
};

export default MyTournaments;
