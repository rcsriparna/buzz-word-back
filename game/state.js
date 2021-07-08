export const state = {
  roomStates: { 0: "IN LOBBY", 1: "IN PROGRESS", 2: "FINISHED" },
  gameRooms: [],
  serverTime() {
    return Date.now();
  },
  createRoom(roomName, maxMembers, roundsTotal, roundDuration) {
    this.gameRooms.push({
      //ROOM PROPERTIES / KEYS
      roomName,
      roomId: this.gameRooms.length,
      maxMembers,
      roundsTotal,
      roundDuration,
      players: [],
      roomState: 0,
      rounds: [],
      gridSize: 0,
      //ROOM METHODS
      isInRoom(player) {
        for (const p of this.players) {
          if (String(p.id) === String(player.id)) return true
        }
        return false
      },
      addPlayer(player) { this.players.push(player) },
      //ROOM GETTERS
      get playersCount() {
        return this.players.length
      },
      get currentRound() {
        return this.rounds.length
      },
      get hasSpace() {
        return this.playersCount < this.maxMembers;
      },
    });
    //RETURN ROOM AFTER CREATING TO SUPPORT METHODS CHAINING
    return this;
  },
  async addPlayer(roomId, player) {// we have to sanitaze room joining by checking if we are logged in in any of remaining rooms and if so to be removed from other room automatically
    const room = this.gameRooms[roomId]
    console.log(player)
    if (
      room.roomState == 0 &&
      room.hasSpace &&
      !room.isInRoom(player) &&
      (!player.room || player.room == null)
    ) {
      room.addPlayer({ id: player.id, name: player.name, score: 0,room:roomId, words: [], scores: [] });
      player.room = roomId
      return player
    }
    else console.log("dupe or no space or already in another room");
    return false
  },
  addRound(roomId, roundDuration) {
    const room = this.gameRooms[roomId]
    const lastRound = room.rounds.length - 1;
    if (lastRound <= room.roundsTotal) {
      room.rounds.push({
        letters: "",
        startingAt: null,
        endingAt: null,
        roundDuration: room.roundDuration,
        winner: 0,
        word: null,
        startRound() {
          const start = new Date();
          start.setSeconds(start.getSeconds() + 12);
          this.startingAt = start;
          const end = new Date(start);
          end.setSeconds(end.getSeconds() + this.roundDuration);
          this.endingAt = end;
        },
      })
    };
  },
};
