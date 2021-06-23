const express = require("express"); //import express dependency serves as web server
const cors = require("cors"); //import cors, middleware for express, cross origin resource sharing
const mongoose = require("mongoose");
const app = express(); //create instance of server
const GameState = require("./game/game");
const PlayerSchema = require("./models/player");
const PORT = 3000; //const for port number

const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: 'foo',
  store: MongoStore.create({mongoUrl: 'mongodb://localhost/buzz-session'})
}));

//configures middleware for server
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

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

//runs express server and conect to database
const connect = async () => {
  const URL = "mongodb://localhost";
  mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on("error", (err) => error("Connection error: " + err));
  db.once("open", () => app.listen(PORT, () => console.log(`Server is running on ${PORT}`)));  //we defer the normal "app.listen() - until the database has started up (bad things would happen if we started accepting requests before the database was running)"
};

//entry point - initiates application
connect();

const game = new GameState();
game.addPlayer("name1");
game.addPlayer("name2");
game.addPlayer("name3");

console.log(game);

console.log(game.topPlayer)
console.log(game.playersList)
;

const ply = new PlayerSchema({name: "One", score: 5, cookie: "abcd"})
ply.save()