import { useRef } from "react";
import API from "../../utils/Api";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const usernameRef = useRef();
	const passwordRef = useRef();
	const navigate = useNavigate();

	const loginHandler = async (e) => {
		e.preventDefault();

		const username = usernameRef.current.value;
		const password = passwordRef.current.value;
		const res = await API.post("/auth/login", { username, password });
		if (!res.data.status) {
			alert(res.data.data);
			return;
		}

		localStorage.setItem("token", res.data.data);
		navigate("/");
	};

	return (
		<form onSubmit={loginHandler}>
			<label htmlFor="username">שם משתמש</label>
			<input
				name="username"
				id="username"
				autoComplete="name"
				type="text"
				placeholder="הזן שם משתמש"
				ref={usernameRef}
			/>

			<label htmlFor="password">סיסמה</label>
			<input
				name="password"
				id="password"
				autoComplete="name"
				type="text"
				placeholder="הזן סיסמה"
				ref={passwordRef}
			/>

			<button type="submit">התחבר</button>
			<button type="button" onClick={() => navigate("/register")}>הרשמה</button>
			<button type="button" onClick={() => navigate("/forgot-password")}>שכחתי סיסמה</button>
		</form>
	);
};

export default Login;
