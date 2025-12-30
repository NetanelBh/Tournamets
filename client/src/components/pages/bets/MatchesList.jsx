import MatchListItem from "./MatchListItem";

const MatchesList = ({ matches, onClick, buttonStatus, actionText, user }) => {
	return (
		<ul className="w-full sm:w-5/8 lg:w-4/10 mt-4 pb-26">
			{matches.map((m) => (
				<MatchListItem key={m._id} match={m} onClick={onClick} buttonStatus={buttonStatus[m._id] || actionText} actionText={actionText} user={user} />
			))}
		</ul>
	);
};

export default MatchesList;
