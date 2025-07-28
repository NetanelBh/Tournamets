import "../../../App.css";

import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";

import API from "../../utils/Api";
import Modal from "../../errorModal/Modal";
import { userActions } from "../../store/slices/userSlice";

const Login = () => {
	const [isEmailVerified, setIsEmailVerified] = useState(true);
	const [isPasswordVerified, setIsPasswordVerified] = useState(true);
	const [isError, setIsError] = useState(false);
	const emailRef = useRef();
	const passwordRef = useRef();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Clear session storage when reach to login page
	sessionStorage.clear();

	const loginHandler = async (e) => {
		e.preventDefault();

		setIsEmailVerified(true);
		setIsPasswordVerified(true);

		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		try {
			const res = (await API.post("/auth/login", { email, password })).data;

			if (!res.status && res.data.includes("מייל")) {
				setIsEmailVerified(false);
				return;
			}

			if (!res.status && res.data.includes("סיסמא")) {
				setIsPasswordVerified(false);
				return;
			}

			if (!res.status) {
				setIsEmailVerified(false);
				return;
			}

			// Session storage persists when refresh the page, clear only when close the tab in contrast to localStorage
			sessionStorage.setItem("token", res.data.token);
			sessionStorage.setItem("isAdmin", res.data.admin);

			// Extract the data from the response to remove the token and the isAdmin from the response(store in redux)
			const { token, admin, isVerified, ...data } = res.data;
			dispatch(userActions.load(data));

			navigate("/layout/all-tournaments");
		} catch (error) {
			setIsError(true);
		}
	};

	const closeModal = () => {
		setIsError(false);
		navigate("/");
	};

	return (
		<div className="min-h-screen bg-[url('/images/login.jpg')] bg-cover bg-center flex flex-col items-center p-4">
			{!isError && (
				<div className="fade_up max-w-md w-full bg-white rounded-xl shadow-lg shadow-gray-600/100 p-8 mt-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">כניסה</h2>

					<form className="space-y-4" onSubmit={loginHandler}>
						<>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
								מייל
							</label>
							<input
								type="email"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
								placeholder="your@email.com"
								id="email"
								autoComplete="email"
								ref={emailRef}
							/>
							{!isEmailVerified && (
								<p className="font-bold text-red-500 text-sm mt-1">{"כתובת מייל שגויה"}</p>
							)}
						</>

						<>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
								סיסמא
							</label>
							<input
								type="password"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
								placeholder="••••••••"
								id="password"
								autoComplete="current-password"
								ref={passwordRef}
							/>
							{!isPasswordVerified && (
								<p className="font-bold text-red-500 text-sm mt-1">{"סיסמה שגויה"}</p>
							)}
						</>

						<div className="flex items-center justify-between">
							<NavLink
								end
								to={"/forgot-password"}
								className="text-sm text-indigo-600 hover:text-indigo-500"
							>
								שכחת סיסמא ?
							</NavLink>
						</div>

						<button className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors">
							כניסה
						</button>
					</form>

					<div className="mt-6 text-center text-sm text-gray-600">
						אין לך חשבון?
						<NavLink
							end
							to={"/register"}
							className="text-indigo-600 hover:text-indigo-500 font-medium mr-1"
						>
							הירשם
						</NavLink>
					</div>
				</div>
			)}

			{isError && <Modal title="שגיאה" text="שגיאה בהתחברות, אנא נסה שנית" onClick={closeModal} />}
		</div>
	);
};

export default Login;
