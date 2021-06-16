const express = require("express"); //import express dependency serves as web server
const cors = require("cors"); //import cors, middleware for express, cross origin resource sharing
const app = express(); //create instance of server
const GameState = require("./game/game");
const PORT = 3000; //const for port number

//configures middleware for server
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

//runs server
const connect = async () => {
  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
};

//custom middleware handling 'word checking' in external API
const checkWord = async (req, res, next) => {
  res.result = await game.checkWord(req.body.letters);
  next();
};

//middleware handler - responsible for returning response as JSON
const outputResponse = (req, res, next) => {
  res.json(res.result);
};

//custom middleware handler for generating random letters
const generateLetters = (req, res, next) => {
  res.result = game.generateLetters(req.params.size);
  next();
};

//two end points handling get requests for API
app.post("/api/dict", checkWord, outputResponse);
app.get("/api/rndletters/:size", generateLetters, outputResponse);

//entry point - initiates application
connect();

const game = new GameState();
game.addPlayer("name1");
game.addPlayer("name2");
game.addPlayer("name3");
game.playerList[0].score = 10;
game.playerList[1].score = 5;
game.playerList[2].score = 0;

console.log(game);

console.log(game.generateLetters(50));
