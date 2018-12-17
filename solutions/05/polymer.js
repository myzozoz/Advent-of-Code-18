const fs = require('fs'),
path = require('path'),
filePath = path.join(__dirname, 'input.txt')

fs.readFile(filePath, {encoding: 'utf-8'}, (err, rawData) => {
  if (!err){
    solve(rawData)
  } else {
    console.log('error', err)
  }
})


function solve(rawData) {
  //console.log('ANSWER TO PART 1:', destroy(rawData).length)
  console.log(findTypes(rawData).length, 'different types')

  let length = rawData.length
  let typeToRemove = findTypes(rawData)[0]

  for(type of findTypes(rawData)) {
    let workingData = destroy(removeType(type, rawData))
    if (workingData.length < length) {
      length = workingData.length
      typeToRemove = type
    }
  }

  console.log('by removing', typeToRemove, ' we arrive at length', length)
}

function removeType(type, data) {
  for(let i = data.length-1; i >= 0; i--) {
    if (data[i].toLowerCase() === type) {
      let temp = data.slice(0, i) + data.slice(i+1, data.length)
      data = temp
    }
  }
  return data
}

function findTypes(data) {
  const types = []
  for (c of data) {
    c = c.toLowerCase()
    if(!types.includes(c)) {
      types.push(c)
    }
  }
  return types
}

function destroy(data) {
  let solved = false
  while(!solved){
    let prev = data[0], curr = data[0]
    solved = true
    for(let i = 1; i < data.length; i++){
      prev = curr
      curr = data[i]
      if (prev.toLowerCase() === curr.toLowerCase()) {
        if((prev.toUpperCase() === prev && curr.toLowerCase() === curr)
        || (curr.toUpperCase() === curr && prev.toLowerCase() === prev)) {
          solved = false
          returnable = ""
          returnable += data.slice(0,i-1)
          returnable += data.slice(i+1, data.lenth)
          //console.log('removing', data.slice(i-1, i+1))
          data = returnable
          break;
        }
      }
    }
  }
  return data
}