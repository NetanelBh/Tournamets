// Color Map to insert to tailwind
export const colorMap = {
    green: "bg-green-300",
    red: "bg-red-400",
    blue: "bg-blue-300",
};

export const textColorMap = {
    green: "text-green-300",
    red: "text-red-400",
    blue: "text-blue-300",
};

// Check if the user result is exactly / direction / fail
export const finalScoreBackground = (userBet, realFinalScore) => {    
    if(realFinalScore.home === -1 || realFinalScore.away === -1) {
        return "";
    } else if (!userBet) {
        return "red";
    }
    else if (userBet.homeScore === realFinalScore.home && userBet.awayScore === realFinalScore.away) {
        return "green";
    } 
    // Case of draw and direction bet
    else if (userBet.homeScore === userBet.awayScore && realFinalScore.home === realFinalScore.away) {
        return "blue";
    } 
    // Case of direction bet (not draw)
    else if (userBet.homeScore > userBet.awayScore && realFinalScore.home > realFinalScore.away) {
        return "blue";
    } 
    // Case of direction bet (not draw)
    else if (userBet.homeScore < userBet.awayScore && realFinalScore.home < realFinalScore.away) {
        return "blue";
    } 
    else {
        return "red";
    }
};

export const calculatePoints = (round, finalScore, userBet, pointsRules) => {
    // TODO: CALCULATE THE POINTS ACCORDING TO THE POINTS RULES AND THE MATCH ROUND
    const points = {matchesPoints: 5, resultType: "exacts"};
    // TODO: IF THE USERBET IS EXACT OR DIRECTION, CHANGE THE PROPERTY RESULT_TYPE TO "exacts" OR "directions"

    return points;
};