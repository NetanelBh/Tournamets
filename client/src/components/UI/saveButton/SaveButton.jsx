import styles from "./SaveButton.module.css";
import { CheckIcon } from "@heroicons/react/24/solid";

const SaveButton = ({status, buttonText, className, onClick=undefined}) => {
    // buttonText is the text that be displayed on the button(before saving or saved - different between components)	
	return (
		<button
			className={className}
			type="submit"
			disabled={status === "שומר" || status === "נשמר" || status === "נכשל"}
			onClick={onClick && onClick}
		>
			{/* Determine the button text */}
			{(status === "שמור" || status === "נכשל" || status === "עדכן תוצאה") && buttonText}

			{status === "שומר" && (
				<>
					{buttonText}
					<span className={styles.blink_1}>{"."}</span>
					<span className={styles.blink_2}>{"."}</span>
					<span className={styles.blink_3}>{"."}</span>
				</>
			)}

			{status === "נשמר" && (
				<div className="flex justify-center gap-4">
					<CheckIcon className="w-5 h-5" />
					{status}
				</div>
			)}
		</button>
	);
};

export default SaveButton;
