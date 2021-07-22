import { model, Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import passport from "passport";

//Model schema for player
const playerSchema = new Schema({
  name: { type: String, unique: true },
  password: String,
  score: Number,
});

playerSchema.plugin(passportLocalMongoose);
const PlayerModel = model("Player", playerSchema);
passport.use(PlayerModel.createStrategy());
passport.serializeUser(PlayerModel.serializeUser());
passport.deserializeUser(PlayerModel.deserializeUser());

export { PlayerModel };
