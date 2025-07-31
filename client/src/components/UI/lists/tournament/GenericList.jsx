import AllTournamentsListItem from "./AllTournamentsListItem";

const GenericList = ({ data }) => {
	return (
		<ul className="overflow-hidden sm:rounded-md max-w-md mx-auto mt-16">
			{data.dataList.map((item, index) => (
				<AllTournamentsListItem
					key={item._id}
					item={item}
					index={index}
					btnText={data.btnText}
					onClick={() => data.onClick(item)}
				/>
			))}
		</ul>
	);
};

export default GenericList;
