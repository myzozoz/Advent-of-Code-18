const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'input.txt')
const writePath = path.join(__dirname, 'output.txt')

fs.readFile(filePath,{encoding: 'utf-8'}, (err, data) => {
  if (!err) {
    solve(data)
  } else {
    console.log(err)
  }
})


function solve(data) {
  const points = getCoordinates(data)
  const corn = corners(points)
  const map = createMap(points, {x: corn.maxX + 50, y: corn.maxY + 50})
  const largest = largestClosedArea(map)
  console.log('The largest area has ID', largest.id, 'and a size of', largest.size)
  console.log('ANSWER TO PART 1:', largest.size)
  const safe = safeZone(map, points, 10000)
  console.log('ANSWER TO PART 2:', safe)
  //printMap(map)
}

function safeZone(map, data, range) {
  let size = 0
  for (let y = 0; y < map.length; y++) {
    for (let x= 0; x < map[y].length; x++) {
      if (allPointsInRange({x,y}, data, range)) {
        size++
      }
    }
  }
  return size
}

function allPointsInRange(point, data, range) {
  const rangeSum = data.reduce((prev, curr) => {
    return prev + mDist(point, {a:curr.x, b:curr.y})
  }, 0)
  return rangeSum < range
}

function largestClosedArea(map) {
  const areas = getAllAreas(map)
  const borders = getBorderIDs(map)
  const closedAreas = areas.filter(a => !borders.includes(a.id))

  return closedAreas.reduce((prev, curr) => prev.size > curr.size ? prev : curr)
}

function getBorderIDs(map) {
  const borders = []
  let y, x
  for(y = 0; y < map.length; y++) {
    x = 0
    if(!borders.includes(map[y][x])){
      borders.push(map[y][x])
    }
    x = map[y].length - 1
    if(!borders.includes(map[y][x])){
      borders.push(map[y][x])
    }
  }
  for (x = 0; x < map[0].length; x++) {
    y = 0
    if(!borders.includes(map[y][x])){
      borders.push(map[y][x])
    }
    y = map.length - 1
    if(!borders.includes(map[y][x])){
      borders.push(map[y][x])
    }
  }
  return borders.filter(b => typeof b == 'number')
}

function getAllAreas(map) {
  let areas = []
  for(let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] !== 'X'){
        if (!areas.map(a => a.id).includes(map[y][x])) {
          areas.push({id: map[y][x], size:1})
        } else {
          areas.find(a => a.id === map[y][x]).size++
        }
      }
    }
  }
  return areas
}

function printMap(arr) {
  let str=''
  for(let y = 0; y < arr.length; y++) {
    for (let x = 0; x < arr[y].length; x++) {
      str += arr[y][x]
    }
    str += '\n'
  }
  fs.writeFile(writePath, str, (err) => {
    console.log(err)
  })
  console.log(str)
}

function divideMap(arr, data) {
  for(let y = 0; y < arr.length; y++) {
    for(let x = 0; x < arr[y].length; x++) {
      let closestPoints = getAllClosest({x,y}, data).map(p => p.id)
      arr[y][x] = closestPoints.length > 1 ? 'X' : closestPoints[0]
    }
  }
}

function mDist({x,y}, {a,b}) {
  return Math.abs(a - x) + Math.abs(b - y)
}

function getAllClosest(point, data) {
  let points = []
  let minDist = 1000, dist
  data.forEach(p => {
    dist = mDist(point, {a:p.x, b:p.y})
    if (dist < minDist) {
      points = []
      points.push(p)
      minDist = dist
    } else if (dist === minDist) {
      points.push(p)
    }
  })
  return points
}

function createMap(data, bounds) {
  const arr = initMap(bounds)
  data.forEach((point, i ) => {
    arr[point.y][point.x] = point.id
  })
  divideMap(arr, data)
  return arr
}

function initMap(bounds) {
  const arr = []
  for(let y = 0; y < bounds.y; y++) {
    arr[y] = new Array(bounds.x)
    for (let x = 0; x < bounds.x; x++) {
      arr[y][x] = '-'
    }
  }
  return arr
}

function getCoordinates(data) {
  const coords = []
  let id = 1
  data.trim().split('\n').map(row => {
    let touple, x, y
    x = parseInt(row.slice(0,row.indexOf(',')))
    y = parseInt(row.slice(row.indexOf(' ') + 1, row.length))
    touple = {x, y, id}
    coords.push(touple)
    id++
  })
  return coords
}

function corners(data) {
  maxX = 0, maxY = 0, minX = 1000, minY = 1000
  data.forEach((coord) => {
    if (coord.x > maxX) {maxX = coord.x}
    if (coord.x < minX) {minX = coord.x}
    if (coord.y > maxY) {maxY = coord.y}
    if (coord.y < minY) {minY = coord.y}
  })
 
  return {maxX, maxY, minX, minY}
}