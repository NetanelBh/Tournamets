import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as groupUtils from "./groupUtils";

import API from "../../utils/Api";
import Modal from "../../modal/Modal";
import PointsRank from "./points/PointsRank";
import Loading from "../../UI/loading/Loading";
import RadioButtonsArea from "./points/RadioButtonsArea";
import { userActions } from "../../store/slices/userSlice";
import Input from "../../UI/input/Input";

const CreateGroup = () => {
	// "samePoints" or "differentPoints" for knockout matches
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [modalText, setModalText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [pointsMethod, setPointsMethod] = useState("samePoints");
	const [isPaymentIncluded, setIsPaymentIncluded] = useState(false);
	const [navigateTo, setNavigateTo] = useState("/layout/groups-layout/create-group");

	const nameRef = useRef();
	const codeRef = useRef();
	groupUtils.groupInputs[0].ref = nameRef;
	groupUtils.groupInputs[1].ref = codeRef;

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
	const roundOf32ExactRef = useRef();
	const roundOf32DirectionRef = useRef();
	const roundOf16ExactRef = useRef();
	const roundOf16DirectionRef = useRef();
	const quarterFinalExactRef = useRef();
	const quarterFinalDirectionRef = useRef();
	const semiFinalExactRef = useRef();
	const semiFinalDirectionRef = useRef();
	const finalExactRef = useRef();
	const finalDirectionRef = useRef();
	groupUtils.knockoutDifferentPoints[0].data[0].ref = roundOf32ExactRef;
	groupUtils.knockoutDifferentPoints[0].data[1].ref = roundOf32DirectionRef;
	groupUtils.knockoutDifferentPoints[1].data[0].ref = roundOf16ExactRef;
	groupUtils.knockoutDifferentPoints[1].data[1].ref = roundOf16DirectionRef;
	groupUtils.knockoutDifferentPoints[2].data[0].ref = quarterFinalExactRef;
	groupUtils.knockoutDifferentPoints[2].data[1].ref = quarterFinalDirectionRef;
	groupUtils.knockoutDifferentPoints[3].data[0].ref = semiFinalExactRef;
	groupUtils.knockoutDifferentPoints[3].data[1].ref = semiFinalDirectionRef;
	groupUtils.knockoutDifferentPoints[4].data[0].ref = finalExactRef;
	groupUtils.knockoutDifferentPoints[4].data[1].ref = finalDirectionRef;

	// Get the tournament id from local storage to determine the tournament the group is belongs
	const tournamentId = localStorage.getItem("tournamentId");

	const createGroupHandler = async (event) => {
		event.preventDefault();

		const newGroup = {
			name: nameRef.current.value,
			code: codeRef.current.value,
			tournamentId,
			isPaid: isPaymentIncluded === true ? true : false,
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
				roundOf32: {
					exactScore: Number(roundOf32ExactRef.current.value),
					directionScore: Number(roundOf32DirectionRef.current.value),
				},
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
			if (resp.data.status) {
				// Update the redux - attach the group to the the user who created it
				dispatch(userActions.joinGroup(resp.data.data));
				setNavigateTo("/layout/groups-layout/my-groups");
				setModalText("הקבוצה נוצרה בהצלחה");
			} else {
				setModalText(resp.data.data);
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
			{isLoading && <Loading />}

			{!isLoading && (
				<>
					{!openModal && (
						<div className="flex flex-col items-center">
							<form
								className="show_up max-w-md sm:w-full bg-cyan-900/50 rounded-xl p-6 mt-2 mb-8 space-y-4 shadow-sm shadow-gray-400"
								onSubmit={createGroupHandler}
							>
								{/* Contains the name, code and paybox */}
								{groupUtils.groupInputs.map((input) => (
									<Input key={input.htmlFor} data={input} />
								))}

								{/* Contains the payment decision (with/without payment) */}
								<RadioButtonsArea
									header="שיטת טורניר"
									data={groupUtils.paymentChoice}
									check={isPaymentIncluded}
									onChange={setIsPaymentIncluded}
								/>

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

								<button className="mt-4 w-full bg-gradient-to-r from-teal-500 to-teal-800 shadow-md shadow-gray-400/80 hover:shadow-sm hover:scale-95 active:scale-95 active:bg-gradient-to-r from-teal-500 to-teal-800 text-yellow-300 font-bold py-2.5 rounded-lg transition-colors">
									צור קבוצה
								</button>
							</form>
						</div>
					)}
					{openModal && <Modal title="יצירת קבוצה" text={modalText} onClick={closeModalHandler} />}
				</>
			)}
		</>
	);
};

export default CreateGroup;
