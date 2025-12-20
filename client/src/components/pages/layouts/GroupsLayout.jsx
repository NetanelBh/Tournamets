import { Outlet } from "react-router-dom";
import GroupsHeader from "../groups/GroupsHeader";

const GroupsLayout = () => {
	return (
		<>
			<GroupsHeader />
			<Outlet />
		</>
	);
};

export default GroupsLayout;
