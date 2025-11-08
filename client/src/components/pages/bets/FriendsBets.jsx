import API from "../../utils/Api";
import Loading from "../../UI/loading/Loading";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { betsActions } from "../../store/slices/betSlice";

// TODO: STORE THE USERS BETS IN REDUX AND FIND WAY TO GET IT ONLY IF THE SLICE IS EMPTY AND USE USESELECTOR TO FETCH IT
const FriendsBets = () => {
  const dispatch = useDispatch();
	const matchId = localStorage.getItem("matchId");
	const [isLoading, setIsLoading] = useState(false);

  const bets = useSelector((state) => state.bets);  
  
	useEffect(() => {        
    // Fetch data only once per match that started already. Match that not stored in redux, will br fetchrf from the DB
    if (bets.allUsersBets[matchId]) return;    
    console.log("fetch");
    

		const fetchAllUsersBets = async () => {
			setIsLoading(true);
			try {
        // Fetch all users bet for the specific match(only if not fetched before)
				const usersBets = await API.post("/bets/allUsersBets", {
					tournamentId: localStorage.getItem("tournamentId"),
					groupId: localStorage.getItem("groupId"),
				});        
        
        dispatch(betsActions.load([{type: "allUsersBets", data: usersBets.data.data}]));
        
			} catch (error) {
        console.log(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllUsersBets();
	}, []);

	// TODO: CREATE RETURN BUTTON THAT RETURN US TO THE CLOSED BETS PAGE AND REMOVE THE MATCHID FROM LOCALSTORAGE
	// TODO: WHEN CREATE TABEL WITH ALL FRIENDS BETS, MY BET, WRITE IT AS "ME" IN THE TABLE AND NOT THE USER NAME
	return <div>FriendsBets</div>;
};

export default FriendsBets;
