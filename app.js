const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const connect = async () => {
  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
};

// (1 point)-A, E, I, O, U, L, N, S, T, R
// (2 points)-D, G
// (3 points)-B, C, M, P
// (4 points)-F, H, V, W, Y
// (5 points)-K
// (8 points)- J, X
// (10 points)-Q, Z

const calculateScore = (word) => {
  let total = 0
  for (let index = 0; index < word.length; index++) {
    const letter = word[index].toUpperCase();
    if (["A", "E", "I", "O", "U", "L", "N", "S", "T", "R"].includes(letter)) total += 1
    else if (["D", "G"].includes(letter)) total += 2
    else if (["B", "C", "M", "P"].includes(letter)) total += 3
    else if (["F", "H", "V", "W", "Y"].includes(letter)) total += 4
    else if (["K"].includes(letter)) total += 5
    else if (["J", "X"].includes(letter)) total += 8
    else total += 10
  }

  return total
}

const checkWord = async (req, res, next) => {
  const word = req.params.word;
  let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_GB/${word}`);

  res.result = await response.json();

  if (res.result.title) {
    res.result.score = 0
    res.result.match = false
  }
  else {
    res.result = res.result[0]
    res.result.score = calculateScore(word)
    res.result.match = true
  }
  next();
};

const outputResponse = (req, res, next) => {
  res.json(res.result);
};

const getRandomNumber = (max) => Math.floor(Math.random() * max);

const getLetter = (perc) => {
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

const generateLetters = (req, res, next) => {
  const letters = [];
  for (let i = 0; i < req.params.size; i++) {
    letters.push(getLetter(getRandomNumber(100)))
  }
  res.result = letters;
  next();
};

//http://localhost:3000/api/dict/<word>
//response
/* 
[Object{
  "word":String("forward"),
  "phonetics":Array[
                    Object{
                      "text":String("/ˈfɔːwəd/"),
                      "audio":String("https://lex-audio.useremarkable.com/mp3/forward_gb_1.mp3")
                          }
                    ],
  "meanings":Array[
                  Object{
                    "partOfSpeech":String("verb")
  "definitions":Array[
                  Object{
                    "definition":String("Send (a letter or email) on to a further destination.")
                    "synonyms":Array[
                                    String("send on",)
                                  ]
  "example":String:("my emails were forwarded to a friend")
}] */
app.get("/api/dict/:word", checkWord, outputResponse);
app.get("/api/rndletters/:size", generateLetters, outputResponse);

connect();



