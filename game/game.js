import { Player } from "./player";
import fetch from "node-fetch";
import { PlayerModel } from "../models/player";
import { logger } from "../logger/logging";
import { State } from "./state";
import { config } from "../config/config";

const debug = config.debug;

const NAMESPACE = "GAME";

// (1 point)-A, E, I, O, U, L, N, S, T, R
// (2 points)-D, G
// (3 points)-B, C, M, P
// (4 points)-F, H, V, W, Y
// (5 points)-K
// (8 points)- J, X
// (10 points)-Q, Z

// GAME OBJECT SINGLETON
export const Game = {
  _playersList: [],
  state: State,
  timeOuts: [[], [], [], []],

  // METHODS
  initRooms() {
    if (debug) logger.info(NAMESPACE, "Initialising rooms");
    this.state.createRoom("GOLDEN", 4, 10, 30, config.gridSize).addRound(0, 30);
    this.state.createRoom("SILVER", 4, 10, 45, config.gridSize).addRound(1, 30);
    this.state.createRoom("BRONZE", 4, 10, 60, config.gridSize).addRound(2, 30);
    this.state.createRoom("SINGLE", 1, 3, 30, config.gridSize).addRound(3, 30);
  },

  processState() {
    const gamesStart = () => {
      this.gameRooms.forEach((room) => {
        if (room.roomState == 0 && !room.hasSpace) {
          this.startGame(room.roomId);
        }
      });
    };

    const roundsStart = () => {
      this.gameRooms.forEach((room) => {
        if (room.roomState == 1) {
          const rounds = room.rounds;

          if (room.currentRound > 1) {
            const previousRound = rounds[room.currentRoundIndex - 1];
            const previousFinished = previousRound.finished;

            if (previousFinished) {
              this.startRound(room.roomId);
            }
          }
        }
      });
    };

    gamesStart();
    roundsStart();
  },

  //helper function calculating total score based on preset scoring system

  calculateScore(word) {
    let total = 0;
    for (let index = 0; index < word.length; index++) {
      const letter = word[index].toUpperCase();
      if ("AEIOULNSTR".includes(letter)) total += 1 * 5;
      else if ("DG".includes(letter)) total += 2 * 5;
      else if ("BCMP".includes(letter)) total += 3 * 5;
      else if ("FHVWY".includes(letter)) total += 4 * 5;
      else if ("K".includes(letter)) total += 5 * 5;
      else if ("JX".includes(letter)) total += 8 * 5;
      else total += 10;
    }

    total *= word.length;

    return total;
  },

  assembleWord(letters) {
    let word = "";
    for (const key in letters) {
      const element = letters[key];
      word += element;
      letters[key] = this.getLetter(this.getRandomNumber(100));
    }

    return word;
  },

  startGame(roomId) {
    if (debug) logger.info(NAMESPACE, "Starting game in room " + roomId);
    const room = this.getRoom(roomId);
    room.roomState = 1;
    this.startRound(roomId);
  },

  startRound(roomId) {
    const room = this.getRoom(roomId);
    const round = room.getCurrentRoundObject();

    if (debug) logger.info(NAMESPACE, `Starting round ${room.currentRound} in room ${roomId} ${room.roomName}`);

    if (round.startingIn == null) {
      round.startRound();
      const timeout = (room.roundDuration + 2 + 6) * 1000;
      this.timeOuts[roomId].push(setTimeout(this.finishRound.bind(this), timeout, roomId));
    }
  },

  finishRound(roomId) {
    const room = this.getRoom(roomId);
    const round = room.getCurrentRoundObject();

    if (debug) logger.info(NAMESPACE, `Finishing round ${room.currentRound} in room ${roomId} ${room.roomName}`);

    if (!round.finished) {
      round.finished = true;
      round.endedAt = new Date();
      this.getRoundScore(roomId);
    }
  },

  getRoundScore(roomId) {
    const state = this.state;
    const room = this.getRoom(roomId);
    const round = room.getCurrentRoundObject();
    const players = room.players;
    const winner = [0, null, 0];

    if (debug)
      logger.info(NAMESPACE, `Calculating scores for round ${room.currentRound} in room ${roomId} ${room.roomName}`);

    for (const player of players) {
      if (winner[0] <= player?.scores[room.currentRoundIndex]) {
        winner[0] = player.scores[room.currentRoundIndex];
        winner[1] = player.words[room.currentRoundIndex];
        winner[2] = player.id;
      }
    }

    round.winner = winner[2];
    round.word = winner[1];

    if (!room.isLastRound) {
      this.timeOuts[roomId].push(setTimeout(state.addRound.bind(state), 5000, roomId));
      this.timeOuts[roomId].push(setTimeout(this.processState.bind(this), 5500));
    }

    if (room.isLastRound && round.finished) {
      room.winner = players.reduce((prev, current) => (prev.score > current.score ? prev : current));
      this.finishGame(roomId);
    }

    this.processState();
  },

  finishGame(roomId) {
    const room = this.getRoom(roomId);
    room.roomState = 2;

    if (debug) logger.info(NAMESPACE, `Finishing game in room ${roomId} ${room.roomName}`);

    this.timeOuts[roomId].push(setTimeout(room.reset.bind(room), 15000));
  },

  getLetter(perc) {
    //helper function to return random selected letters based on the probability system
    //http://pi.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html
    const thresholds = [
      0, 12.02, 21.12, 29.24, 36.92, 44.23, 51.18, 57.46, 63.48, 69.4, 73.72, 77.7, 80.58, 83.29, 85.9, 88.2, 90.31,
      92.4, 94.43, 96.25, 97.74, 98.85, 99.54, 99.71, 99.82, 99.92, 100.0,
    ];
    const letters = "ETAOINSRHDLUCMFYWGPBVKXQJZ";

    for (const [i, l] of letters.split("").entries()) {
      if (perc > thresholds[i] && perc <= thresholds[i + 1]) return letters[i];
    }
  },

  generateLetters(size) {
    const letters = [];
    for (let i = 0; i < size; i++) letters.push(this.getLetter(this.getRandomNumber(100)));
    return letters;
  },

  //helper function returning random number within given range
  getRandomNumber(max) {
    return Math.random() * max;
  },

  getRoom(roomId) {
    return this.gameRooms[roomId];
  },

  markActive(id) {
    this.playersList.forEach((player) => {
      if (player.id == id) player.active = true;
    });
  },

  markOffline(username) {
    this.playersList.forEach((player) => {
      if (player.name == username) {
        player.active = false;
        this.state.removePlayer(player);
      }
    });
  },

  // ASYNC METHODS
  async loadDB() {
    const allPlayers = await PlayerModel.find();
    allPlayers.forEach((player) =>
      this._playersList.push({ name: player.name, score: player.score, id: player.id, active: false })
    );
  },

  async addPlayer(roomId, player) {
    await this.state.addPlayer(roomId, player);
    this.processState();
  },

  async getUserByID(id) {
    return this._playersList.find((p) => p.id == id);
  },

  async checkWord(letters, user) {
    const player = await this.getUserByID(user._id);
    const word = this.assembleWord(letters);
    const now = new Date();

    let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_GB/${word}`);

    response = await response.json();

    if (response.title) {
      response.score = 0;
      response.match = false;
      response.letters = letters;
    } else {
      response = response[0];
      response.score = this.calculateScore(response.word);
      response.match = true;
      response.letters = letters;
    }

    if (debug) logger.info(NAMESPACE, `Calculating points for word ${response.word} from player ${player.name}`);

    const room = this.gameRooms[player.room];
    response.score += response.score !== 0 ? parseInt(30 - (now - room.getCurrentRoundObject().startedAt) / 1000) : 0;
    user.score += response.score;
    player.score += response.score;

    room.players.forEach((p) => {
      if (p.id == player.id) {
        p.scores[room.currentRound - 1] = response.score;
        p.score += response.score;
        p.words[room.currentRound - 1] = response;
        p.recievedAt = now;
      }
    });

    this.playersList.forEach((player) => {
      if (player.name == user.username) player.score += response.score;
    });

    response.winner = user.username;
    user.save();

    return response;
  },

  async createPlayer(newPlayer) {
    let player = null;

    player = await PlayerModel.findOne({ username: newPlayer.username });

    if (player) {
      logger.warn(NAMESPACE, `User ${newPlayer.username} already exists. Either login or choose different name.`);
      return null;
    } else {
      player = new PlayerModel({ username: newPlayer.username, name: newPlayer.username, score: 0 });

      await player.setPassword(newPlayer.password);
      await player.save();

      this._playersList.push(Player(newPlayer.username, player.id));
      logger.warn(NAMESPACE, `User ${newPlayer.username} created sucesfully.`, this.lastPlayer);

      return player;
    }
  },

  async getPlayer(username) {
    console.log(username);
    const player = this._playersList.find((p) => p.name == username);
    return player;
  },

  // GETTERS
  get gameRooms() {
    return this.state.gameRooms;
  },

  get lastPlayer() {
    return this.playersList[this.playersList.length - 1];
  },

  get topPlayer() {
    return this._playersList.reduce((prev, current) => (prev.score > current.score ? prev : current));
  },

  get playersList() {
    return this._playersList;
  },
};
