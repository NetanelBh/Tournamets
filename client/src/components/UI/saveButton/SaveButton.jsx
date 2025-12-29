import styles from "./SaveButton.module.css";
import { CheckIcon } from "@heroicons/react/24/solid";

const SaveButton = ({status, buttonText}) => {
    // buttonText is the text that be displayed on the button(before saving or saved - different between components)
	return (
		<button
			className={`${
				status === "נשמר" ? "bg-green-600" : "bg-red-600"
			} text-white rounded-lg p-1 cursor-pointer mt-2 w-full hover:scale-95 active:scale-95`}
			type="submit"
		>
			{/* Determine the button text */}
			{status === buttonText && buttonText}

			{status === "שומר" && (
				<>
					שומר
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
