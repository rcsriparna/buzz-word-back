import { Router } from "express";
import { Game } from "../game/game";
import { config } from "../config/config";

//router for "/api..." route
const apiRouter = Router();

//custom middleware handling 'word checking' in external API accessed from within game object [Class GameState]
const checkWord = async (req, res, next) => {
  if (req.user) {
    res.locals.data = await Game.checkWord(req.body.letters, req.user);
    res.status(config.http.CREATED);
  } else res.status(config.http.UNAUTHORIZED);
  next();
};

//custom middleware handler for generating random letters accessed from within game object [Class GameState]
const generateLetters = async (req, res, next) => {
  if (req.user) {
    res.locals.data = Game.generateLetters(req.params.size);
    res.status(config.http.CREATED);
  } else res.status(config.http.UNAUTHORIZED);
  next();
};

//custom middleware handler for returning game status from within game object [Class GameState]
const gameState = async (req, res, next) => {
  if (req.user) {
    res.locals.data = Game.state;
  } else res.status(config.http.UNAUTHORIZED);
  next();
};

//custom middleware handler for returning game status from within game object [Class GameState]
const joinRoom = async (req, res, next) => {
  if (req.user) {
    const player = await Game.getUserByID(req.user._id)
    res.locals.data = await Game.addPlayer(req.body.roomId, player);

    if (res.locals.data) res.status(config.http.CREATED);
    else {
      res.status(config.http.BAD_REQUEST);
      res.locals.data = {
        message: `User ${player.name} already in the room.`,
      };
    }
  } else res.status(config.http.UNAUTHORIZED);
  next();
};

//middleware handler - responsible for returning response as JSON
const outputResponse = (req, res, next) => {
  res.json(res.locals.data);
};

//two end-points handling API requests
apiRouter.post("/dict", checkWord, outputResponse);
apiRouter.get("/rndletters/:size", generateLetters, outputResponse);
apiRouter.get("/state", gameState, outputResponse);
apiRouter.post("/room", joinRoom, outputResponse);

export { apiRouter };
