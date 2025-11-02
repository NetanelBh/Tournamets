import MatchListItem from "./matchListItem";

const MatchesList = ({ matches }) => {	
	return (
		<ul className="w-full sm:w-5/8 mt-4 pb-26">
			{matches.map((match) => (
				<MatchListItem key={match._id} match={match} />
			))}
		</ul>
	);
};

export default MatchesList;
