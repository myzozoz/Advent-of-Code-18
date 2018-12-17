solve(473, 70904)

function solve(players, marbles) {
  const answer1 = countScores(players, marbles)
  //console.log(answer1.circle)
  console.log(answer1.players) 
  console.log('ANSWER TO PART 1:', answer1.players.reduce((prev, curr) => prev > curr ? prev : curr))
}

function countScores(playerAmount, marbles) {
  let players = []
  for(let i = 0; i < playerAmount; i++) {
    players[i] = 0
  }
  let circle = [0]
  let current = 0
  for(let i = 1; i <= marbles; i++) {
    //console.log(current)
    if (i % 23 === 0) {
      let addPointsIndex = (current-7 +circle.length) % circle.length
      players[(i - 1)%playerAmount] += circle[addPointsIndex]+i
      circle.splice(addPointsIndex, 1)
      //console.log(circle[addPointsIndex]+i)
      current = addPointsIndex
    } else {
      place(circle, i, current)
      current = circle.findIndex(m => m === i)
    }
  }
  return {circle, players}
}

function place(circle, newMarble, current){
  circle.splice((current+1) % circle.length +1 , 0, newMarble)
}