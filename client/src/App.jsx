import { RouterProvider } from "react-router-dom";
import CreateRouter from "./components/utils/CreateRouter";

const App = () => {
	const router = CreateRouter();

	return (
		<>
			<RouterProvider router={router} />
		</>
	);
};

export default App;
