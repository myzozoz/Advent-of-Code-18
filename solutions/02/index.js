let fs = require('fs'),
path = require('path'),
filePath = path.join(__dirname, 'input.txt');

fs.readFile(filePath, {encoding: 'utf-8'}, function(err, input) {
  if (!err) {
    //console.log('reveived data: ', input)
    solve(input)
    solve2(input)
  } else {
    console.log(err)
  }
})

function solve(input) {
  input = input.trim().split("\n")
  let tw = 0, thr = 0, i = 1
  for (row of input) {
    let dt = countDoublesTriples(row)
    if (dt.twos.length > 0) {
      tw++
    }
    if (dt.threes.length > 0) {
      thr++
    }
    i++
  }
  console.log ('checksum: ', tw * thr)
  
}

function countDoublesTriples(row) {
  let existing = [], doubles = [], triples = [], excessive = []
  for (let i = 0; i < row.length; i++) {
    if (excessive.includes(row[i])) {
      continue
    } else if (!existing.includes(row[i])) {
      existing = existing.concat(row[i])
    } else if (!doubles.includes(row[i])) {
      doubles = doubles.concat(row[i])
    } else if (!triples.includes(row[i])) {
      triples = triples.concat(row[i])
      doubles.splice(doubles.indexOf(row[i]), 1)
    } else {
      excessive = excessive.concat(row[i])
    }
  }
  //console.log('once', existing)
  //console.log('twice', doubles)
  //console.log('thrice', triples)
  //console.log('excessives', excessive)
  return {twos: doubles, threes: triples}
}

function solve2(input) {
  input = input.trim().split("\n")
  for (let i = 0; i < input.length; i++) {
    for(let a = i+1; a < input.length; a++){
      if(compareStrings(input[i], input[a])) {
        console.log('common letters:', removeDiff(input[i], input[a]))
      }
    }
  }
}

function compareStrings(one, two) {
  let counter = 0
  for(let i = 0; i < one.length; i++) {
    if (one[i] !== two[i]){
      counter++
    }
    if (counter > 1) {
      return false
    }
  }
  return true
}

function removeDiff(one, two) {
  let string = ""
  for(let i = 0; i < one.length; i++) {
    if (one[i] !== two[i]) {
      string = one.slice(0,i)
      string += one.slice(i+1, one.length)
    }
  }
  return string
}