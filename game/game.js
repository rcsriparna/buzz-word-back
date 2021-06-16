const Player = require("../player/player")

class GameState {
    constructor(){
        this.playerList = []
        this.letters = "abcdefg"

    }
    addPlayer(name){
        this.playerList.push(new Player(name))
    }
    getTopPlayer(){
        const max = this.playerList.reduce(function(prev, current) {
            return (prev.score > current.score) ? prev : current
        })
        return max
    }
}
module.exports = GameState