import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import CreateRouter from "./components/utils/CreateRouter";

import { tick } from "./components/store/slices/clockSlice";
import initSocketListener from "./components/UI/finalResultUpdate/socketUpdate";

const App = () => {
	const router = CreateRouter();
	const dispatch = useDispatch();

	useEffect(() => {
		// starts socket listener once
		initSocketListener();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			dispatch(tick());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<div className="bg-[url('/images/background.jpg')] bg-top bg-[length:100%] bg-repeat-y min-h-screen">
			<RouterProvider router={router} />
		</div>
	);
};

export default App;
