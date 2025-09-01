import { Outlet } from "react-router-dom";
import BetsHeader from "../bets/BetsHeader";

const BetsLayout = () => {
	return (
		<div className="flex flex-col items-center">
			<BetsHeader />
			<Outlet />
		</div>
	);
};

export default BetsLayout;
