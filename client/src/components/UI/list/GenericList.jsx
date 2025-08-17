import AllTournamentsListItem from "../../pages/tournaments/AllTournamentsListItem";
import GroupListItem from "../../pages/groups/GroupListItem";
// TODO: IT COULD BE ALLTOURNAMENTSLISTITEM OR TABLELISTITEM(FOR THE POINTS TABLE AND ETC..)

const GenericList = ({ data, type }) => {
	// data is an object which contains the list properties
	// type determines which component to render
	return (
		<ul className="overflow-hidden sm:rounded-md max-w-md mx-auto mt-16">
			{type === "tournament" &&
				data.dataList.map((item, index) => (
					<AllTournamentsListItem
						key={item._id}
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
		</ul>
	);
};

export default GenericList;
