import { Game } from "./game";

export const State = {
  roomStates: { 0: "AWAITING PLAYERS", 1: "GAME IN PROGRESS", 2: "GAME FINISHED" },
  gameRooms: [],

  createRoom(roomName, maxMembers, roundsTotal, roundDuration, gridSize) {
    this.gameRooms.push({
      //ROOM PROPERTIES / KEYS
      roomName,
      maxMembers,
      roundsTotal,
      roundDuration,
      gridSize,
      players: [],
      rounds: [],
      roomState: 0,
      roomId: this.gameRooms.length,
      winner: null,

      //ROOM METHODS
      isInRoom(player) {
        for (const p of this.players) {
          if (String(p.id) === String(player.id)) return true;
        }
        return false;
      },

      addPlayer(player) {
        this.players.push(player);
      },

      removePlayer(player) {
        this.players = this.players.filter((p) => String(p.id) != String(player.id));
      },

      getCurrentRoundObject() {
        return this.rounds[this.currentRoundIndex];
      },

      reset() {
        console.log("Reseting room");

        this.players.forEach((player) => {
          player.room = null;
          player.score = 0;
        });

        this.players = [];
        this.rounds = [];
        Game.state.addRound(this.roomId, this.roundDuration);
        this.winner = null;
        this.roomState = 0;

        Game.timeOuts[this.roomId].forEach((timeout) => clearTimeout(timeout));
        Game.timeOuts[this.roomId] = [];
      },

      //ROOM GETTERS
      get playersCount() {
        return this.players.length;
      },

      get currentRound() {
        return this.rounds.length;
      },

      get currentRoundIndex() {
        return this.rounds.length - 1;
      },

      get hasSpace() {
        return this.playersCount < this.maxMembers;
      },

      get isLastRound() {
        return this.currentRound == this.roundsTotal;
      },
    });

    //RETURN ROOM AFTER CREATING TO SUPPORT METHODS CHAINING
    return this;
  },

  async addPlayer(roomId, player) {
    const room = this.gameRooms[roomId];

    if (player?.room != null) await this.removePlayer(player);

    if (room.roomState == 0 && room.hasSpace && (isNaN(player.room) || player.room == null)) {
      room.addPlayer({ id: player.id, name: player.name, score: 0, room: roomId, words: [], scores: [] });
      player.room = roomId;
      return player;
    } else console.log("dupe or no space or already in another room");

    return false;
  },

  async removePlayer(player) {
    player.room = null;
    for (const room of this.gameRooms) {
      room.removePlayer(player);

      if (room.playersCount == 0) room.reset();
    }
  },

  addRound(roomId, roundDuration) {
    const room = this.gameRooms[roomId];
    const lastRound = room.rounds.length - 1;
    if (lastRound <= room.roundsTotal) {
      room.rounds.push({
        letters: "",
        startingIn: null,
        roundDuration: roundDuration,
        winner: 0,
        word: null,
        finished: false,
        startRound() {
          const start = new Date();
          start.setSeconds(start.getSeconds() + 6);
          this.startedAt = start;
          this.startingIn = 6;
          this.letters = Game.generateLetters(Game.state.gameRooms[roomId].gridSize);
        },
      });
    }
  },
};
