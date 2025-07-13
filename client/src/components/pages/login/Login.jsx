import { useRef } from "react";
import API from "../../utils/Api";
import { useNavigate } from "react-router-dom";

import styles from './styles.js';

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
		<div className={styles.background}>
			<header className={styles.header_container}>
				<h1 className={styles.header_text}>ברוך הבא</h1>
			</header>

			<div className={styles.login_container}>
				<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

				<form className="space-y-4" onSubmit={loginHandler}>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
							Email
						</label>
						<input
							type="email"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
							placeholder="your@email.com"
							id="email"
							autoComplete="email"
							ref={usernameRef}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
							Password
						</label>
						<input
							type="password"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
							placeholder="••••••••"
							id="password"
							autoComplete="current-password"
							ref={passwordRef}
						/>
					</div>

					<div className="flex items-center justify-between">
						<a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
							Forgot password?
						</a>
					</div>

					<button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
						Sign In
					</button>
				</form>

				<div className="mt-6 text-center text-sm text-gray-600" >
					Don't have an account?
					<a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium ml-1">
						Sign up
					</a>
				</div>
			</div>
		</div>
	);
};

export default Login;
