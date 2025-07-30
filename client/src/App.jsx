import { RouterProvider } from "react-router-dom";
import CreateRouter from "./components/utils/CreateRouter";

const App = () => {
	const router = CreateRouter();

	return (
		<div className="bg-[url('/images/background.jpg')] bg-cover min-h-screen">
			<RouterProvider router={router} />
		</div>
	);
};

export default App;
