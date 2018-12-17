let fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'input.txt');

fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
  if (!err) {
    //console.log('reveived data: ', data)
    solve(data)
  } else {
    console.log(err)
  }
})

function solve(data) {
  const arr = initArray()
  let input = data.trim().split('\n')
  const parsedData = input.map(parseRow)
  const filledArr = fillArray(arr, parsedData)
  console.log('Overlapping fields:', countOverlap(filledArr))
  console.log('Intact ID: ', intactID(filledArr, parsedData))
}

function intactID(arr, data) {
  for(obj of data) {
    let intact = true
    for(let y = obj.yDist; y < obj.yDist + obj.ySize; y++) {
      for(let x = obj.xDist; x < obj.xDist + obj.xSize; x++) {
        if (arr[y][x] != 1) {
          intact = false
        }
      }
    }
    if (intact == true) {
      return obj.id
    }
  }
  return -1
}

function countOverlap(arr) {
  let count = 0
  for(let y = 0; y < arr.length; y++) {
    for (let x = 0; x < arr[0].length; x++) {
      if (arr[y][x] > 1) {
        count++
      }
    }
  }
  return count
}

function fillArray(arr, data) {
  for(obj of data) {
    for(let y = obj.yDist; y < obj.yDist + obj.ySize; y++) {
      for(let x = obj.xDist; x < obj.xDist + obj.xSize; x++) {
        arr[y][x] = arr[y][x] +1;
      }
    }
  }
  return arr
}


function initArray() {
  const arr = []
  for (let i = 0; i < 1000; i++) {
    arr[i] = new Array(1000)
  }
  for(let y = 0; y < 1000; y++) {
    for (let x = 0; x < 1000; x++) {
      arr[y][x] = 0
    }
  }
  return arr
}

function parseRow(row) {
  row = row.slice(1,row.length)
  let id = row.slice(0,row.indexOf(' '))
  row = row.slice(row.indexOf(' ')+1, row.length)
  row = row.slice(row.indexOf(' ')+1, row.length)
  let xDist = row.slice(0, row.indexOf(','))
  row = row.slice(row.indexOf(',')+1, row.length)
  let yDist = row.slice(0, row.indexOf(':'))
  row = row.slice(row.indexOf(' ')+1, row.length)
  let xSize = row.slice(0, row.indexOf('x'))
  row = row.slice(row.indexOf('x')+1, row.length)
  let ySize = row

  return {
    id: parseInt(id),
    xDist: parseInt(xDist),
    yDist: parseInt(yDist),
    xSize: parseInt(xSize),
    ySize: parseInt(ySize)
  }
}