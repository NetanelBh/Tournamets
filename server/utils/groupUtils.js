export const createGroupData = (groupData) => {
    const data = {
        name: groupData.name,
        code: groupData.code,
        owner: groupData.userId,
        isPaid: groupData.isPaid,
        members: [{id: groupData.userId, hasPaid: false}],
        tournament: groupData.tournamentId,
        points: groupData.points
    };
    return data;
};