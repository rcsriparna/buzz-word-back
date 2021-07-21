"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

//Player object factory function
//returns object
var Player = function Player(name, id) {
  return {
    name: name,
    score: 0,
    id: id,
    room: null,
    active: false
  };
};

exports.Player = Player;