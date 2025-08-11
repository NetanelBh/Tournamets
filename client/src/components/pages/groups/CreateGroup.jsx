import { useRef, useState } from "react";

import * as groupData from "./CreateGroupData";

import GroupInfo from "./GroupInfo";
import Modal from "../../modal/Modal";
import PointsRank from "./points/PointsRank";
import Loading from "../../UI/loading/Loading";
import CheckboxesChoiceArea from "./points/CheckboxesChoiceArea";

const CreateGroup = () => {
	// "samePoints" or "differentPoints" for knockout matches
	const [pointsMethod, setPointsMethod] = useState("samePoints");
	const [isPaymentIncluded, setIsPaymentIncluded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");

	const nameRef = useRef();
	const codeRef = useRef();
	groupData.groupInputs[0].ref = nameRef;
	groupData.groupInputs[1].ref = codeRef;

	// Payment decicion
	const payboxRef = useRef();
	groupData.paymentData[0].ref = payboxRef;

	// Refs for group stage
	const groupExactRef = useRef();
	const groupDirectionRef = useRef();

	groupData.groupPointsData[0].ref = groupExactRef;
	groupData.groupPointsData[1].ref = groupDirectionRef;

	// Refs for knockout stage with samePoints method
	const knockoutExactRef = useRef();
	const knockoutDirectionRef = useRef();
	groupData.knockoutSamePoints[0].ref = knockoutExactRef;
	groupData.knockoutSamePoints[1].ref = knockoutDirectionRef;

	// Refs for knockout stage with differentPoints method
	const roundOf16ExactRef = useRef();
	const roundOf16DirectionRef = useRef();
	const quarterFinalExactRef = useRef();
	const quarterFinalDirectionRef = useRef();
	const semiFinalExactRef = useRef();
	const semiFinalDirectionRef = useRef();
	const finalExactRef = useRef();
	const finalDirectionRef = useRef();
	groupData.knockoutDifferentPoints[0].data[0].ref = roundOf16ExactRef;
	groupData.knockoutDifferentPoints[0].data[1].ref = roundOf16DirectionRef;
	groupData.knockoutDifferentPoints[1].data[0].ref = quarterFinalExactRef;
	groupData.knockoutDifferentPoints[1].data[1].ref = quarterFinalDirectionRef;
	groupData.knockoutDifferentPoints[2].data[0].ref = semiFinalExactRef;
	groupData.knockoutDifferentPoints[2].data[1].ref = semiFinalDirectionRef;
	groupData.knockoutDifferentPoints[3].data[0].ref = finalExactRef;
	groupData.knockoutDifferentPoints[3].data[1].ref = finalDirectionRef;

	// Get the tournament id from local storage to determine the tournament the group is belongs
	const tournamentId = localStorage.getItem("tournamentId");

	const createGroupHandler = async (event) => {
		event.preventDefault();

		const newGroup = {
			name: nameRef.current.value,
			code: codeRef.current.value,
			tournamentId,
			isPaid: isPaymentIncluded === true ? true : false,
			payboxLink: isPaymentIncluded === true ? payboxRef.current.value : null,
			points: {
				groupStage: {
					exactScore: groupExactRef.current.value,
					directionScore: groupDirectionRef.current.value,
				},
				knockoutStage: {
					pointsMethod,
				},
			},
		};

		if (pointsMethod === "samePoints") {
			newGroup.points.knockoutStage.samePoints = {
				exactScore: knockoutExactRef.current.value,
				directionScore: knockoutDirectionRef.current.value,
			};
		} else {
			newGroup.points.knockoutStage.differentPoints = {
				roundOf16: {
					exactScore: roundOf16ExactRef.current.value,
					directionScore: roundOf16DirectionRef.current.value,
				},
				quarterFinal: {
					exactScore: quarterFinalExactRef.current.value,
					directionScore: quarterFinalDirectionRef.current.value,
				},
				semiFinal: {
					exactScore: semiFinalExactRef.current.value,
					directionScore: semiFinalDirectionRef.current.value,
				},
				final: {
					exactScore: finalExactRef.current.value,
					directionScore: finalDirectionRef.current.value,
				},
			};
		}

		try {
			setIsLoading(true);
			const resp = (
				await API.post("/group/create", newGroup, {
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem("token")}`,
					},
				})
			).data;
			setIsLoading(false);

			setOpenModal(true);
			if (resp.status) {
				setModalText("הקבוצה נוצרה בהצלחה");
			} else {
				setModalText(resp.data);
			}
		} catch (error) {
			setOpenModal(true);
			setModalText("אירעה שגיאה ביצירת הקבוצה, אנא נסה שנית");
		}
	};

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText("");
	};

	return (
		<>
			{isLoading && <Loading />}
			{!isLoading && (
				<>
					{!openModal && (
						<div className="flex flex-col items-center">
							<form
								className="show_up max-w-md w-fit sm:w-full bg-cyan-900/50 rounded-xl p-6 mt-2 mb-8 space-y-4 shadow-sm shadow-gray-400"
								onSubmit={createGroupHandler}
							>
								{/* Contains the name, code and paybox */}
								<GroupInfo data={groupData.groupInputs} />

								{/* Contains the payment decision (with/without payment) */}
								<CheckboxesChoiceArea
									header="שיטת טורניר"
									data={groupData.paymentChoice}
									check={isPaymentIncluded}
									onChange={setIsPaymentIncluded}
								/>
								{isPaymentIncluded === true && <GroupInfo data={groupData.paymentData} />}

								{/* Contains the exact and direction points for the group stage */}
								<PointsRank header="ניקוד שלב הבתים" pointsData={groupData.groupPointsData} />

								{/* Contains the points method for the knockout stage - checkboxes */}
								<CheckboxesChoiceArea
									header="שיטת ניקוד לשלב הנוקאאוט"
									data={groupData.knockoutPointsMethod}
									check={pointsMethod}
									onChange={setPointsMethod}
								/>

								{/* Determine the points for the knockout according to the chosen points method */}
								{pointsMethod === "samePoints" && (
									<PointsRank header="ניקוד שלב הנוקאאוט" pointsData={groupData.knockoutSamePoints} />
								)}

								{pointsMethod === "differentPoints" &&
									groupData.knockoutDifferentPoints.map((item) => {
										return (
											<PointsRank header={item.header} pointsData={item.data} key={item.header} />
										);
									})}

								<div className="flex justify-end">
									<button className="w-1/4 bg-gradient-to-r from-teal-500 to-teal-800 shadow-md shadow-gray-400/80 hover:scale-95 active:bg-gradient-to-r from-teal-500 to-teal-800 text-yellow-300 font-bold py-2.5 rounded-lg hover:shadow-sm transition-colors me-2 mb-2">
										צור קבוצה
									</button>
								</div>
							</form>
						</div>
					)}

                    {openModal && <Modal title="יצירת קבוצה" text={modalText} closeModalHandler={closeModalHandler} />}
				</>
			)}
		</>
	);
};

export default CreateGroup;
