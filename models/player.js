//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  name: String,
  score: Number,
  cookie: String
});

module.exports = mongoose.model("Player", PlayerSchema)