import TournamentListItem from "./TournamentListItem";

const TournamentList = ({ dataList, btnText, onClick }) => {	
	return (
		<ul className="overflow-hidden sm:rounded-md max-w-md mx-auto mt-16">
			{dataList.map((item, index) => (
				<TournamentListItem key={item._id} item={item} index={index} btnText={btnText} onClick={() =>onClick(item)} />
			))}
		</ul>
	);
};

export default TournamentList;
