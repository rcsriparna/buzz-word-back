import { Player } from "./player";
import fetch from "node-fetch";
import { PlayerModel } from "../models/player";
import { logger } from "../logger/logging";
import { state } from "./state";

const NAMESPACE = "GameState";

// (1 point)-A, E, I, O, U, L, N, S, T, R
// (2 points)-D, G
// (3 points)-B, C, M, P
// (4 points)-F, H, V, W, Y
// (5 points)-K
// (8 points)- J, X
// (10 points)-Q, Z

export class Game {
  constructor() {
    this._playersList = [];
    this.letters = "abcdefg";
    this.loadDB();
    this.state = state;
    this.initRooms();
    this.startMonitoring();
    this.monitorId = null;
  }

  initRooms() {
    this.state.createRoom("GOLDEN", 4, 10, 30).addRound(0, 30);
    this.state.createRoom("SILVER", 4, 10, 45).addRound(1, 30);
    this.state.createRoom("BRONZE", 4, 10, 60).addRound(2, 30);
    this.state.createRoom("SINGLE", 1, 10, 30).addRound(3, 30);
  }

  startMonitoring() {
    this.monitorId = setInterval(this.processState.bind(this), 500);
  }

  stopMonitoring() {
    clearInterval(this.monitorId);
  }

  processState() {
    // console.log(this.state);

    const needToStartGame = () => {
      this.state.gameRooms.forEach((room) => {
        // console.log(room.roomState, room.hasSpace);
        if (room.roomState == 0 && !room.hasSpace) {
          this.startGame(room.roomId);
        }
      });
    };

    const needToStartRound = () => {
      this.state.gameRooms.forEach((room) => {
        // console.log(room.roomState, room.hasSpace);
        if (room.roomState == 1) {
          if (room.rounds.length > 1) this.startRound(room.roomId);
        }
      });
    };

    // const needToFinishRound = () => {
    //   this.state.gameRooms.forEach((room) => {
    //     // console.log(room.roomState, room.hasSpace);
    //     if (room.roomState == 1) {
    //       this.finishRound(room.roomId);
    //     }
    //   });
    // };

    needToStartGame();
    needToStartRound();
    // needToFinishRound();
  }

  //helper function calculating total score based on preset scoring system

  loadDB = async () => {
    const allPlayers = await PlayerModel.find();
    allPlayers.forEach((player) =>
      this._playersList.push({ name: player.name, score: player.score, id: player.id, active: false })
    );
  };
  calculateScore = (word) => {
    let total = 0;
    for (let index = 0; index < word.length; index++) {
      const letter = word[index].toUpperCase();
      if ("AEIOULNSTR".includes(letter)) total += 1;
      else if ("DG".includes(letter)) total += 2;
      else if ("BCMP".includes(letter)) total += 3;
      else if ("FHVWY".includes(letter)) total += 4;
      else if ("K".includes(letter)) total += 5;
      else if ("JX".includes(letter)) total += 8;
      else total += 10;
    }

    return total;
  };

  assembleWord = (letters) => {
    let word = "";
    for (const key in letters) {
      const element = letters[key];
      word += element;
      letters[key] = this.getLetter(this.getRandomNumber(100));
    }
    return word;
  };

  startGame(roomId) {
    const room = this.state.gameRooms[roomId];
    room.roomState = 1;
    this.startRound(roomId);
  }

  startRound(roomId) {
    const room = this.state.gameRooms[roomId];
    const currRound = room.rounds[room.rounds.length - 1];
    const prevRound = room.rounds[room.rounds.length - 2];
    // console.log("its here",currRound)
    if (currRound.startingIn == null && (prevRound?.finished || room.rounds.length == 1)) {
      currRound.startRound();
      // console.log("its here 2")
      setTimeout(this.finishRound.bind(this), (room.roundDuration + 2 + 6) * 1000, roomId);
    }
  }

  finishRound(roomId) {
    const room = this.state.gameRooms[roomId];
    console.log(room.rounds.length);
    if (room.rounds.length > 0) {
      const currRound = room.rounds[room.rounds.length - 1];
      const now = new Date();
      console.log(now);
      if (!currRound.finished) {
        currRound.finished = true;
        // console.log("round finished");
        // console.log(room.rounds.length < room.roundsTotal, room.rounds.length, room.roundsTotal);
        this.getRoundScore(roomId);
      }
    }
  }

  getRoundScore(roomId) {
    const room = this.state.gameRooms[roomId];
    const currRound = room.rounds.length - 1;
    const players = room.players;
    const winning = [0, null, 0];
    for (const player of players) {
      if (winning[0] <= player?.scores[currRound]) {
        winning[0] = player.scores[currRound];
        winning[1] = player.words[currRound];
        winning[2] = player.id;
      }
    }
    room.rounds[currRound].winner = winning[2];
    room.rounds[currRound].word = winning[1];
    if (room.rounds.length < room.roundsTotal) setTimeout(this.state.addRound.bind(this.state), 5000, roomId);
  }
  getUserByID = async (id) => this._playersList.find((p) => p.id == id);

  checkWord = async (letters, user) => {
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
    user.score += response.score;
    player.score += response.score;
    const room = this.state.gameRooms[player.room];
    room.players.forEach((p) => {
      if (p.id == player.id) {
        p.scores.push(response.score);
        p.score += response.score;
        p.words.push(response);
        p.recievedAt = now;
        p.afterTimeout = room.rounds[room.rounds.length - 1].finished;
      }
    });

    this.playersList.forEach((player) => {
      if (player.name == user.username) player.score += response.score;
    });
    response.winner = user.username;
    user.save();
    return response;
  };

  getLetter = (perc) => {
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
  };

  generateLetters = (size) => {
    const letters = [];
    for (let i = 0; i < size; i++) letters.push(this.getLetter(this.getRandomNumber(100)));
    return letters;
  };

  //helper function returning random number within given range
  getRandomNumber = (max) => Math.random() * max;

  addPlayer = async (newPlayer) => {
    let player = null;
    player = await PlayerModel.findOne({ username: newPlayer.username });
    if (player) {
      logger.warn(NAMESPACE, `User ${newPlayer.username} already exists. Either login or choose different name.`);
      return null;
    } else {
      player = new PlayerModel({ username: newPlayer.username, name: newPlayer.username, score: 0 });
      await player.setPassword(newPlayer.password);
      await player.save();
      // const { user } = await PlayerModel.authenticate()(newPlayer.username, newPlayer.password);
      this._playersList.push(Player(newPlayer.username, player.id));
      logger.warn(NAMESPACE, `User ${newPlayer.username} created sucesfully.`, this.lastPlayer);
      return player;
    }
  };

  get lastPlayer() {
    return this.playersList[this.playersList.length - 1];
  }

  getPlayer = async (username) => {
    console.log(username);
    // const player = await PlayerModel.findOne({ username: username });
    const player = this._playersList.find((p) => p.name == username);
    return player;
  };

  markActive(id) {
    this.playersList.forEach((player) => {
      if (player.id == id) player.active = true;
    });
  }
  markOffline(username) {
    this.playersList.forEach((player) => {
      if (player.name == username) {
        player.active = false;
        this.state.removePlayer(player);
      }
    });
  }

  get topPlayer() {
    return this._playersList.reduce((prev, current) => (prev.score > current.score ? prev : current));
  }
  get playersList() {
    return this._playersList;
  }
}
