import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import BetsHeader from "../bets/BetsHeader";
import Loading from "../../UI/loading/Loading";
import { selectIsLoading } from "../../store/slices/loadingSlice";

const BetsLayout = () => {
	// If still loading, don't show the layout header
	const isLoading = useSelector(selectIsLoading);

	return (
		<>
			{isLoading && <Loading />}

			{!isLoading && (
				<div className="flex flex-col items-center">
					<BetsHeader />
					<Outlet />
				</div>
			)}
		</>
	);
};

export default BetsLayout;
