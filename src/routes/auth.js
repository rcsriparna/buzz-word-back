import passport from "passport";
import { Router } from "express";
import { config } from "../config/config";
import { Game } from "../game/game";

//router for "/..." route
const authRouter = Router();

//logout
authRouter.get("/logout", (req, res) => {
  Game.markOffline(req.session.passport.user);
  req.logout();
  res.status(config.http.OK);
  res.send();
});

//logged
authRouter.get("/logged", async (req, res) => {
  if (req.user) {
    res.locals.data = await Game.getPlayer(req.user.username);

    Game.markActive(res.locals.data.id);

    res.status(config.http.OK);
    res.json(res.locals.data);
  } else {
    res.status(config.http.NOT_FOUND);
    const msg = `User ${req.body.username} already exists. Either login or choose different name.`;

    res.locals.data = {
      message: msg,
    };

    res.json(res.locals.data);
  }
});

//custom middleware handler for creating player from within game object [Class GameState]
authRouter.post("/signup", async (req, res, next) => {
  if (req.user) req.logout();

  res.locals.data = await Game.createPlayer(req.body);

  if (res.locals.data) {
    req.logIn(res.locals.data, async (errLogIn) => {
      if (errLogIn) {
        return next(errLogIn);
      }
    });
    res.locals.data = await Game.getPlayer(res.locals.data.username);
  } else {
    res.status(config.http.BAD_REQUEST);
    res.locals.data = {
      message: `User ${req.body.username} already exists. Either login or choose different name.`,
    };
  }

  res.json(res.locals.data);
});

//login POST with username and password in body
authRouter.post("/login", passport.authenticate("local"), async (req, res) => {
  res.locals.data = await Game.getPlayer(req.body.username);
  Game.markActive(res.locals.data.id);
  res.status(config.http.OK);
  res.json(res.locals.data);
});

export { authRouter };
