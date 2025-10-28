// Color Map to insert to tailwind
export const colorMap = {
    green: "bg-green-300",
    red: "bg-red-500",
    blue: "bg-blue-400"};

// Check if the user result is exactly / direction / fail
export const finalScoreBackground = (userBet, realFinalScore) => {    
    if (userBet.homeScore === realFinalScore.home && userBet.awayScore === realFinalScore.away) {
        return "green";
    } 
    // Case of draw and direction bet
    else if (userBet.homeScore === userBet.awayScore && realFinalScore.home === realFinalScore.away) {
        return "blue";
    } 
    // Case of direction bet (not draw)
    else if (userBet.homeScore > userBet.awayScore && realFinalScore.home > realFinalScore.away) {
        return "red";
    } 
    // Case of direction bet (not draw)
    else if (userBet.homeScore < userBet.awayScore && realFinalScore.home < realFinalScore.away) {
        return "blue";
    } 
    else {
        return "red";
    }
};