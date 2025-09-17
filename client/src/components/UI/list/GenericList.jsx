import MatchListItem from "../../pages/bets/MatchListItem";
import GroupListItem from "../../pages/groups/GroupListItem";
import TournamentsListItem from "../../pages/tournaments/TournamentsListItem";

const GenericList = ({ data, type }) => {
	// data is an object which contains the list properties
	// type determines which component to render
	return (
		<ul className="overflow-hidden sm:rounded-md max-w-md mx-auto mt-16">
			{type === "tournament" &&
				data.dataList.map((item, index) => (
					<TournamentsListItem
						key={index}
						item={item}
						index={index}
						btnText={data.btnText}
						onClick={() => data.onClick(item)}
						leave={data.leave}
					/>
				))}

			{type === "group" &&
				data.dataList.map((item, index) => (
					<GroupListItem
						key={item._id}
						item={item}
						index={index}
						btnText={data.btnText}
						onClick={data.onClick}
						leave={data.leave}
					/>
				))}

			{type === "matches" &&
				data.dataList.map((item, index) => <MatchListItem key={index} />)}
		</ul>
	);
};

export default GenericList;
