export const state = {
  roomStates: { 0: "IN LOBBY", 1: "IN PROGRESS", 2: "FINISHED" },
  gameRooms: [],
  serverTime() {
    return Date.now();
  },
  createRoom(roomName, maxMembers, roundsTotal, roundDuration) {
    this.gameRooms.push({
      roomName,
      roomID: this.gameRooms.length,
      maxMembers,
      roundsTotal,
      players: [],
      roomState: 0,
      rounds: [],
      gridSize: 0,
    });
    return this;
  },
  addPlayer(roomID, player) {
    if (
      this.gameRooms[roomID].players.filter((p) => (p.id = player)).length == 0 &&
      this.hasSpace(roomID) &&
      this.gameRooms[roomID].roomState == 0
    )
      this.gameRooms[roomID].players.push({ id: player.id, name: player.name, score: 0, words: [], scores: [] });
    else console.log("dupe or no space");
  },
  hasSpace(roomID) {
    return this.gameRooms[roomID].players.length < this.gameRooms[roomID].maxMembers;
  },
  startRound(roomID) {
    const lastRound = this.gameRooms[roomID].rounds.length - 1;
    if (lastRound <= this.gameRooms[roomID].roundsTotal) {
      const start = new Date();
      start.setSeconds(start.getSeconds() + 12);
      this.gameRooms[roomID].rounds[lastRound].startingAt = start;
      const end = new Date(start);
      end.setSeconds(end.getSeconds() + this.gameRooms[roomID].rounds[lastRound].roundDuration);
      this.gameRooms[roomID].rounds[lastRound].endingAt = end;
    }
  },
  addRound(roomID, roundDuration) {
    this.gameRooms[roomID].rounds.push({
      letters: "",
      startingAt: null,
      endingAt: null,
      roundDuration: roundDuration,
      winner: 0,
      word: null,
    });
  },
};
