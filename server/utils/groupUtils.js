export const createGroupData = (groupData) => {
    const data = {
        name: groupData.name,
        code: groupData.code,
        owner: groupData.userId,
        members: [groupData.userId],
        tournament: groupData.tournamentId,
        points: groupData.points
    };
    return data;
};