import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import * as groupUtils from "./groupUtils";

import GroupInfo from "./GroupInfo";
import Modal from "../../modal/Modal";
import PointsRank from "./points/PointsRank";
import Loading from "../../UI/loading/Loading";
import RadioButtonsArea from "./points/RadioButtonsArea";
import API from "../../utils/Api";

const CreateGroup = () => {
	// "samePoints" or "differentPoints" for knockout matches
	const [pointsMethod, setPointsMethod] = useState("samePoints");
	const [isPaymentIncluded, setIsPaymentIncluded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [modalText, setModalText] = useState("");
	const [navigateTo, setNavigateTo] = useState("/layout/groups-layout/create-group");
	const navigate = useNavigate();

	const nameRef = useRef();
	const codeRef = useRef();
	groupUtils.groupInputs[0].ref = nameRef;
	groupUtils.groupInputs[1].ref = codeRef;

	// Payment decicion
	const payboxRef = useRef();
	groupUtils.paymentData[0].ref = payboxRef;

	// Refs for group stage
	const groupExactRef = useRef();
	const groupDirectionRef = useRef();

	groupUtils.groupPointsData[0].ref = groupExactRef;
	groupUtils.groupPointsData[1].ref = groupDirectionRef;

	// Refs for knockout stage with samePoints method
	const knockoutExactRef = useRef();
	const knockoutDirectionRef = useRef();
	groupUtils.knockoutSamePoints[0].ref = knockoutExactRef;
	groupUtils.knockoutSamePoints[1].ref = knockoutDirectionRef;

	// Refs for knockout stage with differentPoints method
	const roundOf16ExactRef = useRef();
	const roundOf16DirectionRef = useRef();
	const quarterFinalExactRef = useRef();
	const quarterFinalDirectionRef = useRef();
	const semiFinalExactRef = useRef();
	const semiFinalDirectionRef = useRef();
	const finalExactRef = useRef();
	const finalDirectionRef = useRef();
	groupUtils.knockoutDifferentPoints[0].data[0].ref = roundOf16ExactRef;
	groupUtils.knockoutDifferentPoints[0].data[1].ref = roundOf16DirectionRef;
	groupUtils.knockoutDifferentPoints[1].data[0].ref = quarterFinalExactRef;
	groupUtils.knockoutDifferentPoints[1].data[1].ref = quarterFinalDirectionRef;
	groupUtils.knockoutDifferentPoints[2].data[0].ref = semiFinalExactRef;
	groupUtils.knockoutDifferentPoints[2].data[1].ref = semiFinalDirectionRef;
	groupUtils.knockoutDifferentPoints[3].data[0].ref = finalExactRef;
	groupUtils.knockoutDifferentPoints[3].data[1].ref = finalDirectionRef;

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
					exactScore: Number(groupExactRef.current.value),
					directionScore: Number(groupDirectionRef.current.value),
				},
				knockoutStage: {
					pointsMethod,
				},
			},
		};

		if (pointsMethod === "samePoints") {
			newGroup.points.knockoutStage.samePoints = {
				exactScore: Number(knockoutExactRef.current.value),
				directionScore: Number(knockoutDirectionRef.current.value),
			};
		} else {
			newGroup.points.knockoutStage.differentPoints = {
				roundOf16: {
					exactScore: Number(roundOf16ExactRef.current.value),
					directionScore: Number(roundOf16DirectionRef.current.value),
				},
				quarterFinal: {
					exactScore: Number(quarterFinalExactRef.current.value),
					directionScore: Number(quarterFinalDirectionRef.current.value),
				},
				semiFinal: {
					exactScore: Number(semiFinalExactRef.current.value),
					directionScore: Number(semiFinalDirectionRef.current.value),
				},
				final: {
					exactScore: Number(finalExactRef.current.value),
					directionScore: Number(finalDirectionRef.current.value),
				},
			};
		}

		setIsLoading(true);
		try {
			const resp = await API.post("/group/create", newGroup);

			setOpenModal(true);
			setModalText(resp.data.data);
			if (resp.data.status) {
				setNavigateTo("/layout/groups-layout/my-groups");
			} else {
				setNavigateTo("/layout/groups-layout/create-group");
			}
		} catch (error) {
			setOpenModal(true);
			setModalText("אירעה שגיאה ביצירת הקבוצה, אנא נסה שנית");
			setNavigateTo("/layout/groups-layout/create-group");
		} finally {
			setIsLoading(false);
		}
	};

	const closeModalHandler = () => {
		setOpenModal(false);
		setModalText("");
		navigate(navigateTo);
	};

	return (
		<>
			{!openModal && (
				<>
					{isLoading && <Loading />}
					{!isLoading && (
						<div className="flex flex-col items-center">
							<form
								className="show_up max-w-md w-fit sm:w-full bg-cyan-900/50 rounded-xl p-6 mt-2 mb-8 space-y-4 shadow-sm shadow-gray-400"
								onSubmit={createGroupHandler}
							>
								{/* Contains the name, code and paybox */}
								<GroupInfo data={groupUtils.groupInputs} />

								{/* Contains the payment decision (with/without payment) */}
								<RadioButtonsArea
									header="שיטת טורניר"
									data={groupUtils.paymentChoice}
									check={isPaymentIncluded}
									onChange={setIsPaymentIncluded}
								/>
								{isPaymentIncluded === true && <GroupInfo data={groupUtils.paymentData} />}

								{/* Contains the exact and direction points for the group stage */}
								<PointsRank header="ניקוד שלב הבתים" pointsData={groupUtils.groupPointsData} />

								{/* Contains the points method for the knockout stage - checkboxes */}
								<RadioButtonsArea
									header="שיטת ניקוד לשלב הנוקאאוט"
									data={groupUtils.knockoutPointsMethod}
									check={pointsMethod}
									onChange={setPointsMethod}
								/>

								{/* Determine the points for the knockout according to the chosen points method */}
								{pointsMethod === "samePoints" && (
									<PointsRank
										header="ניקוד שלב הנוקאאוט"
										pointsData={groupUtils.knockoutSamePoints}
									/>
								)}

								{pointsMethod === "differentPoints" &&
									groupUtils.knockoutDifferentPoints.map((item) => {
										return (
											<PointsRank header={item.header} pointsData={item.data} key={item.header} />
										);
									})}

								<div className="flex justify-end">
									<button className="w-1/4 bg-gradient-to-r from-teal-500 to-teal-800 shadow-md shadow-gray-400/80 hover:scale-95 active:bg-gradient-to-r from-teal-500 to-teal-800 text-yellow-300 font-bold py-2.5 rounded-lg hover:shadow-sm transition-colors me-2 mb-2 mt-2">
										צור קבוצה
									</button>
								</div>
							</form>
						</div>
					)}
				</>
			)}
			{openModal && <Modal title="יצירת קבוצה" text={modalText} onClick={closeModalHandler} />}
		</>
	);
};

export default CreateGroup;
