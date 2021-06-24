import { Player } from "./player";
import fetch from "node-fetch";
import { PlayerModel } from "../models/player";
import { logger } from "../logger/logging";

const NAMESPACE = "GameState";

// (1 point)-A, E, I, O, U, L, N, S, T, R
// (2 points)-D, G
// (3 points)-B, C, M, P
// (4 points)-F, H, V, W, Y
// (5 points)-K
// (8 points)- J, X
// (10 points)-Q, Z

export class GameState {
  constructor() {
    this._playersList = [];
    this.letters = "abcdefg";
    this.loadDB();
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

  getUserByID = async (user) => await PlayerModel.findById(user.id);

  checkWord = async (letters, user) => {
    user = await this.getUserByID(user);
    const word = this.assembleWord(letters);
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
      const { user } = await PlayerModel.authenticate()(newPlayer.username, newPlayer.password);
      this._playersList.push(Player(newPlayer.username, player.id));
      logger.warn(NAMESPACE, `User ${newPlayer.username} created sucesfully.`, this.lastPlayer);
      return this.lastPlayer;
    }
  };

  get lastPlayer() {
    return this.playersList[this.playersList.length - 1];
  }

  getPlayer = async (username) => {
    console.log(username);
    const player = await PlayerModel.findOne({ username: username });
    return player;
  };

  markActive(id) {
    this.playersList.forEach((player) => {
      if (player.id == id) player.active = true;
    });
  }
  markOffline(username) {
    this.playersList.forEach((player) => {
      if (player.name == username) player.active = false;
    });
  }

  get topPlayer() {
    return this._playersList.reduce((prev, current) => (prev.score > current.score ? prev : current));
  }
  get playersList() {
    return this._playersList;
  }

  get state() {
    return this.playersList;
  }
}
