import MatchesList from "./MatchesList"
import { useSelector } from "react-redux"

const ClosedMatches = () => {
  // Clear the stored matchId(if stored)
  localStorage.removeItem("matchId");

  const matches = useSelector((state) => state.matches.matches);
  const bets = useSelector((state) => state.bets);

  const startedMatches = matches.filter((match) => match.kickoffTime <= new Date().toISOString());

  // Run over the matches that started(the user can't bet on these matches)
  const startedMathesWithBets = startedMatches.map(match => {
    // Find the user's bet for this match from DB bets
    const matchScoreBet = bets.usercurrentScore.find((score) => score.matchId === match._id); 
    
    return {...match, matchScoreBet, isStarted: true};
  }).sort((match1, match2) => new Date(match1.kickoffTime) - new Date(match2.kickoffTime));  
  
  return (
    <MatchesList matches={startedMathesWithBets} />
  )
}

export default ClosedMatches