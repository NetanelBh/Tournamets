import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/Api";
import { useRef } from "react";

function ResetPassword() {
	const { token } = useParams();
	const navigate = useNavigate();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await API.post(`/auth/reset-password/${token}`, { newPassword: passwordRef.current.value });
			alert(res.data.data);
			navigate("/");
		} catch (error) {
			alert("אירעה שגיאה באיפוס הסיסמה, אנא נסה שנית");
			navigate("/");
		}
	};

	return (
		<div>
			<h1>Reset Your Password</h1>
			<form onSubmit={handleSubmit}>
				<input type="password" placeholder="בחר סיסמה חדשה" ref={passwordRef} required />
				<button type="submit">עדכן סיסמה</button>
			</form>
		</div>
	);
}

export default ResetPassword;
