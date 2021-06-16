const Player = require("../player/player");
const fetch = require("node-fetch"); //access to 'fetch'

// (1 point)-A, E, I, O, U, L, N, S, T, R
// (2 points)-D, G
// (3 points)-B, C, M, P
// (4 points)-F, H, V, W, Y
// (5 points)-K
// (8 points)- J, X
// (10 points)-Q, Z

class GameState {
  constructor() {
    this.playerList = [];
    this.letters = "abcdefg";
  }

  //helper function calculating total score based on preset scoring system

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

  checkWord = async (letters) => {
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
    return response;
  };

  getLetter = (perc) => {
    //helper function to return random selected letters based on the probability system
    //http://pi.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html
    if (perc <= 12.02) return "E";
    else if (perc > 12.02 && perc <= 21.12) return "T";
    else if (perc > 21.12 && perc <= 29.24) return "A";
    else if (perc > 29.24 && perc <= 36.92) return "O";
    else if (perc > 36.92 && perc <= 44.23) return "I";
    else if (perc > 44.23 && perc <= 51.18) return "N";
    else if (perc > 51.18 && perc <= 57.46) return "S";
    else if (perc > 57.46 && perc <= 63.48) return "R";
    else if (perc > 63.48 && perc <= 69.4) return "H";
    else if (perc > 69.4 && perc <= 73.72) return "D";
    else if (perc > 73.72 && perc <= 77.7) return "L";
    else if (perc > 77.7 && perc <= 80.58) return "U";
    else if (perc > 80.58 && perc <= 83.29) return "C";
    else if (perc > 83.29 && perc <= 85.9) return "M";
    else if (perc > 85.9 && perc <= 88.2) return "F";
    else if (perc > 88.2 && perc <= 90.31) return "Y";
    else if (perc > 90.31 && perc <= 92.4) return "W";
    else if (perc > 92.4 && perc <= 94.43) return "G";
    else if (perc > 94.43 && perc <= 96.25) return "P";
    else if (perc > 96.25 && perc <= 97.74) return "B";
    else if (perc > 97.74 && perc <= 98.85) return "V";
    else if (perc > 98.85 && perc <= 99.54) return "K";
    else if (perc > 99.54 && perc <= 99.71) return "X";
    else if (perc > 99.71 && perc <= 99.82) return "Q";
    else if (perc > 99.82 && perc <= 99.92) return "J";
    else return "Z";
  };

  generateLetters = (size) => {
    const letters = [];
    for (let i = 0; i < size; i++) {
      letters.push(this.getLetter(this.getRandomNumber(100)));
    }
    return letters;
  };

  //helper function returning random number within given range
  getRandomNumber = (max) => Math.floor(Math.random() * max);

  addPlayer = (name) => this.playerList.push(new Player(name));

  get topPlayer() {
    return this.playerList.reduce((prev, current) => (prev.score > current.score ? prev : current));
  }
}
module.exports = GameState;
