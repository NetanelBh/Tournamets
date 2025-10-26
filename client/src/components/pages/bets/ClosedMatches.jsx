import MatchesList from "./MatchesList"
import { useSelector } from "react-redux"

const ClosedMatches = () => {
  const matches = useSelector((state) => state.matches.matches);
  const bets = useSelector((state) => state.bets);

  const startedMatches = matches.filter((match) => match.kickoffTime <= new Date().toISOString());

  // Run over the matches that started(the user can't bet on these matches)
  const startedMathesWithBets = startedMatches.map(match => {
    // Find the user's bet for this match from DB bets
    const matchScoreBet = bets.currentScore.find((score) => score.matchId === match._id); 
    
    return {...match, matchScoreBet, isStarted: true};
  });  
  
    // TODO: CREATE A LIST WITH THE MATCHES THAT STARTED, FOR EACH MATCH, GIVE THE OPTION TO SEE ALL FRIEENDS BETS
    // TODO: WHEN CLICK ON SPECIFIC MATCH TO SHOW THE FRIENDS BETS, STORE THE MATCH ID TO RETRIEVE THE MATCH DATA
  return (
    <MatchesList matches={startedMathesWithBets} />
  )
}

export default ClosedMatches