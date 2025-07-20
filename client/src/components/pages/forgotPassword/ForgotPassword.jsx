import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../utils/Api";
import Modal from "../../errorModal/Modal";

const ForgotPassword = () => {
	const emailRef = useRef();
	const navigate = useNavigate();
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");

	const resetPasswordHandler = async (e) => {
		e.preventDefault();

		const resp = await API.post("/auth/forgot-password", { email: emailRef.current.value });
		setOpenModal(true);
		setModalText(resp.data.data)
	};

	const closeModalHandler = () => {
		setOpenModal(false)
		setModalText("")
		navigate("/")
	}

	return (
		<div className="min-h-screen bg-[url('/images/login.jpg')] bg-cover bg-center flex flex-col items-center p-4">
			{!openModal && <>
			<div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 mt-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">איפוס סיסמא</h2>

				<form className="space-y-4" onSubmit={resetPasswordHandler}>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
							הזן את כתובת המייל שלך
						</label>
						<input
							type="email"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
							placeholder="your@mail.com"
							id="email"
							autoComplete="email"
							ref={emailRef}
						/>
					</div>

					<button className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors">
						שלח
					</button>
				</form>
			</div>
			</>}
			

			{openModal && <Modal title={"איפוס סיסמה"} text={modalText} onClick={closeModalHandler} />}
		</div>
	);
};

export default ForgotPassword;
