import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../utils/Api";

const ForgotPassword = () => {
    const emailRef = useRef();
    const navigate = useNavigate();

    const resetPasswordHandler = async (e) => {
        e.preventDefault();

        const resp = await API.post("/auth/forgot-password", { email: emailRef.current.value });
        alert(resp.data.data);
        navigate("/");
    }

	return (
		<form onSubmit={resetPasswordHandler}>
			<label htmlFor="email">מייל</label>
			<input
				name="email"
				id="email"
				autoComplete="name"
				type="text"
				placeholder="הזן מייל"
				ref={emailRef}
			/>

			<button type="submit">שלח</button>
		</form>
	);
};

export default ForgotPassword;
