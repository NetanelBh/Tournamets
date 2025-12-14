import API from "../../utils/Api";
import { useRef, useState } from "react";

import Modal from "../../modal/Modal";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");
	const firstNameRef = useRef();
	const lastNameRef = useRef();
	const usernameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();

	const navigate = useNavigate();

	const registerHandler = async (e) => {
		e.preventDefault();

		try {
			const userData = {
				firstname: firstNameRef.current.value,
				lastname: lastNameRef.current.value,
				username: usernameRef.current.value,
				email: emailRef.current.value,
				password: passwordRef.current.value,
			};
		
			const resp = await API.post("/auth/register", userData);
			setOpenModal(true);
			setModalText(resp.data.data);
		} catch (error) {
			setOpenModal(true);
			setModalText("אירעה שגיאה בהרשמה, אנא נסה שנית");
		}
	};

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText("");
		navigate("/");
	};

	return (
		<div className="min-h-screen bg-[url('/images/login.jpg')] bg-cover bg-center flex flex-col items-center p-4">
			{!openModal && (
				<>
					<header className="w-full text-center mt-6 mb-10">
						<h1 className="text-5xl font-bold text-white">מלך הטורנירים</h1>
					</header>

					<div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">כניסה</h2>

						<form className="space-y-4" onSubmit={registerHandler}>
							<>
								<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="f_name">
									שם פרטי
								</label>
								<input
									type="text"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
									id="f_name"
									autoComplete="name"
									ref={firstNameRef}
								/>
							</>

							<>
								<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="l_name">
									שם משפחה
								</label>
								<input
									type="text"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
									id="l_name"
									autoComplete="name"
									ref={lastNameRef}
								/>
							</>

							<>
								<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
									בחר שם משתמש
								</label>
								<input
									type="text"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
									placeholder="יוצג בטבלאות הניקוד"
									id="username"
									autoComplete="username"
									ref={usernameRef}
								/>
							</>

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
							</>

							<button className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-600 text-white font-medium py-2.5 rounded-lg transition-colors">
								הרשמה
							</button>
						</form>
					</div>
				</>
			)}

			{openModal && <Modal title="הרשמה" text={modalText} onClick={closeModalHandler} />}
		</div>
	);
};

export default Register;
