// isExit prop is indicates if the user want to exit from either tournament or group(to add more button to the modal)
const Modal = ({ title, text, onClick, isExit = false, onCancle=undefined }) => {
	return (
		<div
			className="fixed inset-0 z-50 grid place-content-center bg-black/90 p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modalTitle"
		>
			<div className="w-full max-w-md rounded-lg bg-gray-300 shadow-lg dark:bg-gray-900 fade_up">
				<div className="flex items-start justify-between bg-gradient-to-r from-teal-500 to-teal-800 p-4 rounded-t-lg">
					<h2
						id="modalTitle"
						className="text-xl text-white font-bold text-gray-900 sm:text-2xl dark:text-white"
					>
						{title}
					</h2>
				</div>

				<div className="mt-6 px-4">
					<p className="whitespace-pre-line text-pretty font-medium text-gray-900 dark:text-gray-200">{text}</p>
				</div>

				<footer className="mt-6 flex justify-end gap-2 pb-4 pl-4">
					<button
						type="button"
						className="hover:cursor-pointer hover:scale-95 active:scale-95 rounded bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
						onClick={onClick}
					>
						אישור
					</button>

					{/* Only if this prop is true, add more button to approve the exit */}
					{isExit && (
						<button
							type="button"
							className="hover:cursor-pointer hover:scale-95 active:scale-95 rounded bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
							onClick={onCancle}
						>
							ביטול
						</button>
					)}
				</footer>
			</div>
		</div>
	);
};

export default Modal;
