import { useRef } from "react"
import Input from "../../UI/input/Input"
import { addMatch } from "./groupUtils"

const AddMatch = () => {
  const homeTeamRef = useRef();
  const awayTeamRef = useRef();
  const dateRef = useRef();
  const timeRef = useRef();
  const stageRef = useRef();
  const roundRef = useRef();

  addMatch[0].ref = homeTeamRef;
  addMatch[1].ref = awayTeamRef;
  addMatch[2].ref = dateRef;
  addMatch[3].ref = timeRef;
  addMatch[4].ref = stageRef;
  addMatch[5].ref = roundRef;

  const createMatchHandler = () => {
    // TODO: CREATE HERE THE OBJCT FOR NEW MATCH TO SEND TO SERVER FOR MATCH CREATING
  };

  return (
    <div className="flex flex-col items-center">
							<form
								className="show_up max-w-md w-fit sm:w-full bg-cyan-900/50 rounded-xl p-6 mt-2 mb-8 space-y-4 shadow-sm shadow-gray-400"
								onSubmit={createMatchHandler}
							>
                {addMatch.map((input) => {
                  return <Input key={input.htmlFor} data={input} />;
                })}
							</form>
						</div>
  )
}

export default AddMatch