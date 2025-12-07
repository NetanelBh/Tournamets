import { RouterProvider } from "react-router-dom";
import CreateRouter from "./components/utils/CreateRouter";

import initSocketListener from "./components/UI/finalResultUpdate/socketUpdate";
import { useEffect } from "react";

const App = () => {
	const router = CreateRouter();

	useEffect(() => {
		// starts socket listener once
		initSocketListener();
	}, []);

	return (
		<div className="bg-[url('/images/background.jpg')] bg-top bg-[length:100%] bg-repeat-y min-h-screen">
			<RouterProvider router={router} />
		</div>
	);
};

export default App;
