import MatchesList from "./MatchesList"
import { useSelector } from "react-redux"

const ClosedMatches = () => {
  // Clear the stored matchId(if stored)
  localStorage.removeItem("matchId");

  const matches = useSelector((state) => state.matches.matches);
  // Get the bets for this tournament and group
  const bets = useSelector((state) => state.bets);

  // Get only the matches that started
  const startedMatches = matches.filter((match) => match.kickoffTime <= new Date().toISOString());  

  // Run over the matches that started(the user can't bet on these matches)
  const startedMathesWithBets = startedMatches.map(match => {
    // Find the user's bet for this match from DB bets
    const matchScoreBet = bets.userDbScore.find((score) => score.matchId === match._id); 
    // The basic template is without the matchScoreBet(in this case we didn't find the bet in DB - the user didn't bet)
    let matchwithBet = {...match, isStarted: true};
    // Only if the user bet on this match, add the matchScoreBet property with the user's bet score
    if (matchScoreBet) {
      // Create a new object of the match with the user bet
      matchwithBet.matchScoreBet = {...matchScoreBet};
    }  
    
    return matchwithBet;
    // Sort the matches by date(oldest to newest)
  }).sort((match1, match2) => new Date(match1.kickoffTime) - new Date(match2.kickoffTime));    
  
  return (
    <MatchesList matches={startedMathesWithBets} />
  )
}

export default ClosedMatches