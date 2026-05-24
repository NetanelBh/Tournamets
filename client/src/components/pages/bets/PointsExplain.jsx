import { useSelector } from "react-redux";

import ExplainData from "./ExplainData";
import BetsLayout from "../layouts/BetsLayout";
import ExplainDataHeader from "./ExplainDataHeader";

import { groupPointsExplain, winnerTeamBonus, topScorerBonus } from "./betsUtils";

const PointsExplain = () => {
	const user = useSelector((state) => state.user.user);
	// Get the current group to extract to points explain from the group rules
	const currentGroup = user.groups.find((g) => g._id === localStorage.getItem("groupId"));

	const pointsRules = groupPointsExplain(currentGroup.points);
	
	return (
		<div className="flex flex-col items-center">
			<BetsLayout />

			<div className="bg-gray-300 block max-w-sm p-6 border border-default rounded-lg shadow-[0_0_8px_3px_theme(colors.teal.200)] hover:bg-neutral-secondary-medium fade_up mb-4">
				<ExplainDataHeader header="הסבר שיטת ניקוד המשחקים" />
				<br></br>

				<p className="text-body font-bold underline">בונוס ניחוש האלופה:</p>
				<p className="text-body mb-2">{winnerTeamBonus} נקודות</p>
				
				<p className="text-body font-bold underline">בונוס ניחוש מלך השערים:</p>
				<p className="text-body mb-2">{topScorerBonus} נקודות</p>

				<p className="text-body font-bold underline">שלב הבתים:</p>
				<ExplainData data={pointsRules.groupStage} />
				<p className="mb-2"></p>

				<p className="text-body font-bold underline">שלב הנוקאאוט:</p>
				<ExplainData data={pointsRules.knockoutStage} />
			</div>
		</div>
	);
};

export default PointsExplain;
