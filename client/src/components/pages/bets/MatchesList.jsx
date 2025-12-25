import MatchListItem from "./MatchListItem";

const MatchesList = ({ matches }) => {
	return (
		<ul className="w-full sm:w-5/8 mt-4 pb-26">
			{matches.map((m) => (
				<MatchListItem key={m._id} match={m} />
			))}
		</ul>
	);
};

export default MatchesList;
