"use strict";

//Require Mongoose
var mongoose = require('mongoose'); //Define a schema


var Schema = mongoose.Schema;
var GameSchema = new Schema({
  name: String,
  score: Number
});
module.exports = mongoose.model("Game", GameSchema);