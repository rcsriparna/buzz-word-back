import passport from "passport";
import { Router } from "express";
import { config } from "../config/config";
import { game } from "../app";
import path from "path";
import express from "express";

//router for "/..." route
const authRouter = Router();

// authRouter.use(express.static("./assets", { root: __dirname }));
authRouter.use("/assets", express.static(path.join(__dirname, `../../${config.front.root}/${config.front.static}`)));

authRouter.get("/", function (req, res) {
  res.sendFile("/index.html", { root: path.join(__dirname, `../../${config.front.root}/`) });
});

//logout
authRouter.get("/logout", (req, res) => {
  game.markOffline(req.session.passport.user);
  req.logout();
  res.status(config.http.OK);
  res.send();
});

//login POST with username and password in body
authRouter.post("/login", passport.authenticate("local"), async (req, res) => {
  res.locals.player = await game.getPlayer(req.body.username);
  game.markActive(res.locals.player.id);
  res.status(config.http.OK);
  res.json(res.locals.player);
});

export { authRouter };
