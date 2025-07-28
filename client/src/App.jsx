import { RouterProvider } from "react-router-dom";
import CreateRouter from "./components/utils/CreateRouter";

const App = () => {
	const router = CreateRouter();

	return (
		<div className="bg-gray-600 min-h-screen">
			<RouterProvider router={router} />
		</div>
	);
};

export default App;
