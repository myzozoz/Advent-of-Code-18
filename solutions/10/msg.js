const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'input.txt')

fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
  if (!err) {
    solve(data)
  } else {
    console.log(err)
  }
})

const solve = (data) => {
  data = parseData(data)
  //console.log(getClosestTime(data))
  console.log(printStuff(data, 10634))

}

const printStuff = (data, dt) => {
  let newData = data.map(n => {
    return {
      yPos: n.yPos + dt * n.yVel,
      xPos: n.xPos + dt * n.xVel,
      yVel,
      xVel
    }
  })
  const dim = getMinMax(newData)

  const arr = new Array(dim.yLength + 2)
  for(let y = 0; y < arr.length; y++) {
    arr[y] = new Array(dim.xLength + 2)
    for(let x = 0; x < arr[y].length; x++) {
      arr[y][x] = 0
    }
  }

  newData.forEach(n => arr[Math.abs(dim.yMin) + n.yPos][Math.abs(dim.xMin) + n.xPos] = 1)

  let str = ''
  for(let y = 0; y < arr.length; y++) {
    for(let x = 0; x < arr[y].length; x++) {
      if (arr[y][x] === 0) {
        str += '.'
      } else {
        str += '#'
      }
    }
    str+= '\n'
  }
  fs.writeFile(path.join(__dirname, 'output.txt'),str)
}

const getClosestTime = (data) => {
  let minSplit = 1000000
  let minTime = 0
  for(let i = 0; i < 50000; i++) {
    let newData = data.map(n => {
      return {
        yPos: n.yPos + i * n.yVel,
        xPos: n.xPos + i * n.xVel,
        yVel,
        xVel
      }
    })
    let dim = getMinMax(newData)
    if (dim.xLength + dim.yLength < minSplit) {
      minSplit = dim.xLength + dim.yLength
      minTime = i
    }
  }
  console.log('minsplit', minSplit)
  return minTime
}

const getMinMax = (data) => {
  const xPositions = data.map(d => d.xPos)
  const yPositions = data.map(d => d.yPos)
  const xMax = xPositions.reduce((prev, curr) => prev > curr ? prev : curr)
  const xMin = xPositions.reduce((prev, curr) => prev < curr ? prev : curr)
  const yMax = yPositions.reduce((prev, curr) => prev > curr ? prev : curr)
  const yMin = yPositions.reduce((prev, curr) => prev < curr ? prev : curr)
  const yLength = Math.abs(yMin) + yMax + 1
  const xLength = Math.abs(xMin) + xMax + 1
  return {xMax, xMin, yMax, yMin, yLength, xLength}
}

const parseData = (data) => {
  const parsed = data.trim().split("\n")
    .map(d => {
      xPos = parseInt(d.slice(10, d.indexOf(',')).trim())
      yPos = parseInt(d.slice(d.indexOf(',') + 1, d.indexOf('>')).trim())
      d = d.slice(d.indexOf('>') + 1, d.length)
      xVel = parseInt(d.slice(d.indexOf('<') + 1, d.indexOf(',')).trim())
      yVel = parseInt(d.slice(d.indexOf(',') + 1, d.indexOf('>')).trim())
      return {xPos, yPos, xVel, yVel}
    })
  return parsed
}