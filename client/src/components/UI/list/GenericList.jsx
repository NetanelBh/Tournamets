import AllTournamentsListItem from "../../pages/tournaments/AllTournamentsListItem";
// TODO: to use it generic, in the data obj, will insert property type to check which component to render in map
// TODO: IT COULD BE ALLTOURNAMENTSLISTITEM OR TABLELISTITEM(FOR THE POINTS TABLE AND ETC..)

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
