run('x');

const run = x => console.log(x);

function solve(players, marbles) {
  const answer1 = countScores(players, marbles);
  console.log(answer1);
}

const countScores = (players, marbles) => {
  let circle = [];
  for (let i = 0; i <= marbles; i++) {
    circle = place(circle, i, current);
  }
  return circle;
};

const place = (circle, newMarble, current) => {
  return circle.splice((current + 1) % circle.length, 0, newMarble);
};
