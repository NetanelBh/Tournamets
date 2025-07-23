import GenericListItem from "./GenericListItem";

const GenericList = ({ dataList }) => {
	return (
		<ul className="overflow-hidden sm:rounded-md min-w-sm max-w-md mx-auto mt-16">
			{dataList.map((item, index) => (
				<GenericListItem key={item._id} item={item} index={index} />
			))}
		</ul>
	);
};

export default GenericList;
