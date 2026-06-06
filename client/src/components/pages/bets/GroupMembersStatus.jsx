import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import Loading from "../../UI/loading/Loading";

const GroupMembersStatus = () => {
	const navigate = useNavigate();

	const [members, setMembers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState({});
	const [navigateTo, setNavigateTo] = useState("");
	const [activeList, setActiveList] = useState("paid");
	const [confirmModal, setConfirmModal] = useState({
		open: false,
		memberId: null,
		currentStatus: null,
	});

	const groupId = localStorage.getItem("groupId");

	useEffect(() => {
		const fetchMembers = async () => {
			setIsLoading(true);

			try {
				const res = await API.get(`/group/${groupId}/members-status`);

				if (!res.data.status) {
					if (res.data.data === "SESSION_EXPIRED") {
						setOpenModal(true);
						setModalText({
							title: "זמן חיבור עבר",
							text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש",
						});
						setNavigateTo("/");
						return;
					}

					setOpenModal(true);
					setModalText({
						title: "שגיאה",
						text: res.data.data,
					});
					setNavigateTo("/layout/my-bets");
					return;
				}

				setMembers(res.data.data.members);
			} catch (error) {
				setOpenModal(true);
				setModalText({
					title: "שגיאה",
					text: "אירעה שגיאה בטעינת חברי הקבוצה",
				});
				setNavigateTo("/layout/my-bets");
			} finally {
				setIsLoading(false);
			}
		};

		fetchMembers();
	}, [groupId]);

	const closeConfirmModalHandler = () => {
		setConfirmModal({
			open: false,
			memberId: null,
			currentStatus: null,
		});
	};

	const approveCancelPaymentHandler = () => {
		toggleHasPaid(confirmModal.memberId, confirmModal.currentStatus);
		closeConfirmModalHandler();
	};

	const toggleHasPaid = async (memberId, currentStatus) => {
		setIsLoading(true);

		try {
			const res = await API.patch(`/group/${groupId}/member/${memberId}/has-paid`, {
				hasPaid: !currentStatus,
			});

			if (!res.data.status) {
				if (res.data.data === "SESSION_EXPIRED") {
					setOpenModal(true);
					setModalText({
						title: "זמן חיבור עבר",
						text: "לא היתה פעילות במשך 20 דקות, נא להתחבר מחדש",
					});
					setNavigateTo("/");
					return;
				}

				setOpenModal(true);
				setModalText({
					title: "שגיאה",
					text: res.data.data,
				});
				return;
			}

			setMembers(res.data.data.members);
		} catch (error) {
			setOpenModal(true);
			setModalText({
				title: "שגיאה",
				text: "אירעה שגיאה בעדכון הסטטוס",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText({});

		if (navigateTo) {
			navigate(navigateTo);
		}
	};

	const getDisplayName = (member) => {
		const user = member.id;
		return `${user.firstname || ""} ${user.lastname || ""}`.trim();
	};

	const isHebrewName = (name) => /[\u0590-\u05FF]/.test(name);

	const sortByName = (a, b) => {
		const nameA = getDisplayName(a);
		const nameB = getDisplayName(b);

		const aHebrew = isHebrewName(nameA);
		const bHebrew = isHebrewName(nameB);

		if (aHebrew !== bHebrew) {
			return aHebrew ? -1 : 1;
		}

		return nameA.localeCompare(nameB, aHebrew ? "he" : "en");
	};

	const paidMembers = members.filter((member) => member.hasPaid).sort(sortByName);
	const unpaidMembers = members.filter((member) => !member.hasPaid).sort(sortByName);

	const displayedMembers = activeList === "paid" ? paidMembers : unpaidMembers;

	const paidCount = members.filter((member) => member.hasPaid).length;
	const unpaidCount = members.length - paidCount;

	return (
		<>
			{!isLoading && (
				<div className="max-w-2xl mx-auto mt-10 text-white px-4">
					<button
						onClick={() => navigate(-1)}
						className="mb-6 bg-gray-600/50 text-yellow-400 px-4 py-2 rounded-full border border-red-400 active:scale-95"
					>
						→ חזור
					</button>

					<h1 className="text-2xl font-bold text-center text-yellow-400 mb-6">סטטוס תשלום חברי הקבוצה</h1>

					<p className="text-center text-yellow-100 mb-6">
						סה״כ שילמו: {paidCount} מתוך {members.length}
					</p>

					<nav className="flex justify-evenly items-center w-full text-md mb-6">
						<button
							onClick={() => setActiveList("paid")}
							className={`hover:text-gray-300 transition-all hover:cursor-pointer ${
								activeList === "paid"
									? "text-yellow-400 font-semibold hover:text-yellow-400 underline"
									: ""
							}`}
						>
							שילמו ({paidCount})
						</button>

						<button
							onClick={() => setActiveList("unpaid")}
							className={`hover:text-gray-300 transition-all hover:cursor-pointer ${
								activeList === "unpaid"
									? "text-yellow-400 font-semibold hover:text-yellow-400 underline"
									: ""
							}`}
						>
							לא שילמו ({unpaidCount})
						</button>
					</nav>

					<div className="space-y-4 pb-10">
						{displayedMembers.length === 0 && (
							<p className="text-center text-red-400 font-bold">אין משתמשים להצגה ברשימה זו</p>
						)}

						{displayedMembers.map((member) => {
							const user = member.id;
							const memberId = user._id;

							return (
								<div
									key={memberId}
									className="flex items-center justify-between bg-gray-800/70 border border-yellow-400 rounded-xl p-4 shadow-lg shadow-red-400/30"
								>
									<div>
										<p
											className={`text-lg ${
												member.hasPaid ? "text-teal-400" : "text-red-400 font-bold"
											}`}
										>
											{user.firstname} {user.lastname}
										</p>
									</div>

									<button
										onClick={() => {
											if (member.hasPaid) {
												setConfirmModal({
													open: true,
													memberId,
													currentStatus: member.hasPaid,
												});
												return;
											}

											toggleHasPaid(memberId, member.hasPaid);
										}}
										className={`px-4 py-2 rounded-full border active:scale-95 hover:cursor-pointer ${
											member.hasPaid
												? "bg-gray-600/50 text-yellow-300 border-red-400"
												: "bg-gray-600/50 text-teal-300 border-teal-400"
										}`}
									>
										{member.hasPaid ? "בטל תשלום" : "סמן כשילם"}
									</button>
								</div>
							);
						})}
					</div>

					{openModal && <Modal title={modalText.title} text={modalText.text} onClick={closeModalHandler} />}

					{confirmModal.open && (
						<Modal
							title="אישור ביטול תשלום"
							text="האם אתה בטוח שברצונך לבטל את התשלום למשתמש זה?"
							onClick={approveCancelPaymentHandler}
							isExit={true}
							onCancle={closeConfirmModalHandler}
						/>
					)}
				</div>
			)}

			{isLoading && <Loading />}
		</>
	);
};

export default GroupMembersStatus;
