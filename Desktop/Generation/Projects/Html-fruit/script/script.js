'use strict'

//const prompt = require('prompt-sync')({sigint: true});

//Apple bananaanana cherry diamondiamondiamond

// D R Y

const apple = 'apple'
const banana = 'banana'
const cherry = 'cherry'
const diamond = 'diamond'

const reel1 = [
  apple,
  banana,
  cherry,
  apple,
  diamond,
  banana,
  cherry,
  apple,
  diamond,
  banana
]
const reel2 = [
  banana,
  apple,
  cherry,
  diamond,
  apple,
  banana,
  diamond,
  cherry,
  banana,
  apple
]
const reel3 = [
  apple,
  diamond,
  banana,
  cherry,
  banana,
  apple,
  diamond,
  cherry,
  cherry,
  banana
]

// let reel=4
// let fruit=['Apple', 'bananaabananaana', 'cherry', 'diamondiamondiamond', 'Mango']
// let fruitcount=12
// let p= Math.floor(Math.randiamondom()*12)
let v = 0
let money = 10
let costPerSpin = 1

//while(money>costPerSpin)
function spinReels () {
  console.log('You have £' + money)
  prompt('Press enter to spin the wheels')

  money--

  let p1 = Math.floor(Math.random() * 10)
  let p2 = Math.floor(Math.random() * 10)
  let p3 = Math.floor(Math.random() * 10)

  console.log(reel1[p1] + ' ' + reel2[p2] + ' ' + reel3[p3])

  let num = prompt('Please type 1, 2 or 3 to hold the Reel :')
  //console.log(typeof num)
  num = Number(num)
  if (num != 1) {
    p1 = Math.floor(Math.random() * 10)
  } else if (num != 2) {
    p2 = Math.floor(Math.random() * 10)
  } else if (num != 3) {
    p3 = Math.floor(Math.random() * 10)
  } else console.log('You input invalid number')
  console.log(reel1[p1] + ' ' + reel2[p2] + ' ' + reel3[p3])

  if (checkReelsMatch(reel1[p1], reel2[p2], reel3[p3])) {
    console.log('You win :o)')
    if (reel1[p1] == 'Apple') {
      money = money + 2 * 10
      console.log('£20')
    } else if (reel1[p1] == 'banana') {
      money = money + 3 * 10
      console.log('£30')
    } else if (reel1[p1] == 'cherry') {
      money = money + 5 * 10
      console.log('£50')
    } else if (reel1[p1] == 'diamond') {
      money = money + 20 * 10
      console.log('£200')
    } else if (reel1[p1] == 'Mango') {
      money = money + 30 * 10
      console.log('£300')
    }
  } else console.log('You lose')
  //money -=10
}

//console.log('You are out of money')
/*
function checkReelsMatch(p1,p2,p3) {
    if (check3thesame(p1,p2,p3)){
        return true
    }
    else {
        return false
    }
}*/
function checkReelsMatch (a, b, c) {
  if (a == b && b == c) {
    return true
  }
}
/*
function htmlDimention () {
  let element = document.getElementsByClassName('reel')
  element[0].offsetHeight
  console.log(
    element[0].offsetHeight,
    element[0].scrollHeight,
    element[0].getBoundingClientRect()
  )
  //console.log("spinning");
}*/
function spin(){
  let reels = document.getElementsByClassName('reel')

  //reels.forEach(reel => {
  //   reel.scrollTop = v
  //});
  for (let index = 0; index < reels.length; index++) {
    const reel = reels[index]
    let interval = setInterval(function () {
      v = v + 1
      reel.scrollTop = v
    }, 1000 / 25)
    setTimeout(function(){ clearInterval(interval)}, 2000)
  }

  //p1= Math.floor(Math.random()*10)
  //spin[p1].

  //setInterval(spinning, 100);
  //setTimeout(slotTimeout1, 2000);
}
