import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../../UI/loading/Loading";
import GroupsHeader from "../groups/GroupsHeader";
import { selectIsLoading } from "../../store/slices/loadingSlice";

const GroupsLayout = () => {
	// If still loading, don't show the layout header
	const isLoading = useSelector(selectIsLoading);

	return (
		<>
			{isLoading && <Loading />}
			
			{!isLoading && (
				<>
					<GroupsHeader />
					<Outlet />
				</>
			)}
		</>
	);
};

export default GroupsLayout;
