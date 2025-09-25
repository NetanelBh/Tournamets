import MatchListItem from "./matchListItem";

// TODO: READ HERE THE MATCHES_PREDICTED_SCORES OF THE USER. IF THE USER ALREADY BET ON SOME MATCH, WE WANT TO SHOW THE PREDICTED SCORE FIRST, IF DIDN'T BET YET, THE DEFAULT IS 0-0

const MatchesList = ({ matches }) => {
	return (
		<ul className="w-full sm:w-5/8 mt-12" >
			{matches.map((match) => (
				<MatchListItem key={match._id} match={match} />
			))}
		</ul>
	);
};

export default MatchesList;
