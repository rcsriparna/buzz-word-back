const express = require("express");
const cors = require("cors");
const fetch = require('node-fetch');
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const connect = async () => {
  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
};

const checkWord = async (req, res, next) => {
  const word = req.params.word;
  let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_GB/${word}`)

  res.result = await response.json();
  next();
};

const outputResponse = (req, res, next) => {
  res.json(res.result)
};

const getRandomNumber = (max) =>{
  Math.floor(Math.random()*max)
}

const returnedLetters = 

for (let index = 0; index < numLetters; index++) {
  getRandomNumber(100)
  
}



()-[A, E, I, O, U, L, N, S, T, R]
()-[D, G]
()-[B, C, M, P]
()-[F, H, V, W, Y]
()-[K]
()-[J, X]
()-[Q, Z]

10	30
8	24
5	15
4	12
3	9
2	6
1	3





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

connect();
