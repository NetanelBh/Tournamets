import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/Api";
import { useRef, useState } from "react";
import Modal from "../../modal/Modal";

function ResetPassword() {
	const { token } = useParams();
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");
	const navigate = useNavigate();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await API.post(`/auth/reset-password/${token}`, { newPassword: passwordRef.current.value });
			setOpenModal(true);
			setModalText(res.data.data);
		} catch (error) {
			setOpenModal(true);
			setModalText("אירעה שגיאה באיפוס הסיסמה, אנא נסה שנית");
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
				<div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 mt-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">איפוס סיסמא</h2>

					<form className="space-y-4" onSubmit={handleSubmit}>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
								בחר סיסמה חדשה
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

						<button className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors">
							עדכן סיסמה
						</button>
					</form>
				</div>
			)}

			{openModal && <Modal title="איפוס סיסמה" text={modalText} onClick={closeModalHandler} />}
		</div>
	);
}

export default ResetPassword;
