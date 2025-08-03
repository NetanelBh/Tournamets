import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/Api";

import Modal from "../../modal/Modal";

function VerifyEmail() {
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");

	const { token } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const verify = async () => {
			setOpenModal(true);

			try {
				const res = await API.get(`/auth/verify/${token}`);
				if (!res.data.status) {
					setModalText("המייל אומת כבר בעבר, נא להתחבר");
				} else {
					setModalText("מייל אומת בהצלחה, נא להתחבר");
				}
			} catch (error) {
				setModalText("אירעה שגיאה באימות המייל, אנא נסה שנית");
			}
		};

		verify();
	}, [token]);

  const closeModalHandler = () => {
    setOpenModal(false);
    setModalText("");
    navigate("/");
  }

	return (
		<div className="min-h-screen bg-[url('/images/login.jpg')] bg-cover bg-center flex flex-col items-center p-4">
      {openModal && <Modal title="אימות משתמש" text={modalText} onClick={closeModalHandler}/>}
    </div>
	);
}

export default VerifyEmail;
