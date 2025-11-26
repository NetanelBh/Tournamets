import { useState } from "react";
import API from "../utils/Api";

const useFetch = (fetchFunction) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	// config = {url, method, params, body}
	const fetchApi = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		setData(null);

		try {
			const response = await fetchFunction();
			setData(response.data.data);
		} catch (error) {
			setError(error);
		} finally {
			setIsLoading(false);
		}
	}, [fetchFunction]);

	return { data, error, isLoading, fetchApi };
};

export default useFetch;
