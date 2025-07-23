import { useEffect, useState } from "react";
import API from "../../utils/Api";

import Modal from "../../errorModal/Modal";
import GenericList from "../../UI/lists/generic/GenericList";

const AllTournaments = () => {
	const [tournaments, setTournaments] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const token = JSON.parse(sessionStorage.getItem("user")).token;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedTournaments = await API.get("/tournament/getAll", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setTournaments(fetchedTournaments.data.data);
			} catch (error) {
                setOpenModal(true);
            }
		};

        fetchData();
	}, []);

	const closeModalHandler = () => {
		setOpenModal(false);
	};

	return (
		<>
			{!openModal && <GenericList dataList={tournaments} />}
			{openModal && (
				<Modal title="שגיאה" text="אירעה שגיאה בהצגת הטורנירים, אנא נסה שנית" onClick={closeModalHandler} />
			)}
		</>
	);
};

export default AllTournaments;
