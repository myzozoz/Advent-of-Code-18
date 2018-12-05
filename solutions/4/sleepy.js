let fs = require('fs'),
path = require('path'),
filePath = path.join(__dirname, 'input.txt');

fs.readFile(filePath, {encoding: 'utf-8'}, function(err, rawData) {
  if (!err) {
    //console.log('reveived data: ', rawData)
    solve(rawData)
  } else {
    console.log('error', err)
  }
})

function solve(rawData) {
  const dates = rawData.trim().split('\n')
                  .map(parseDate)
                  .sort(compDates)
  //console.log(dates)
  const sleeps = getSleeps(dates)
  console.log(sleeps)
  const guard = sleepSums(sleeps)
    .reduce((prev, curr) => prev.sleepSum > curr.sleepSum ? prev : curr)
  const sleepiestMin = analyzeSleepTimes(sleeps.filter(sl => sl.id === guard.id)).sleepyMin
  console.log('sleepiest guard', guard)
  console.log('and his sleepiest minute', sleepiestMin)
  console.log('\nANSWER TO PART 1:', guard.id*sleepiestMin)
  const totalSleepiest = sleepSums(sleeps)
    .map(g => {
      const sstat = analyzeSleepTimes(sleeps.filter(sl => sl.id === g.id))
      return {
        id: g.id,
        sleepiestMinute: sstat.sleepyMin,
        timesSlept: sstat.timesSlept
      }
    })
    .reduce((prev, curr) => 
      prev.timesSlept > curr.timesSlept ? prev : curr
    )
    
  console.log('\nThe overall doziest minute was for guard', totalSleepiest.id)
  console.log('the minute', totalSleepiest.sleepiestMinute)
  console.log('who was dozing on the moment a total of ', totalSleepiest.timesSlept, 'times')
  console.log('\ANSWER TO PART 2', 
    totalSleepiest.id * totalSleepiest.sleepiestMinute)
}

function analyzeSleepTimes(sleepTimes) {
  let guard = []
  for (let min = 0; min < 60; min++) {
    guard[min] = 0
  }
  sleepTimes.forEach(st => {
    for (let i = st.sleepStart; i < st.sleepEnd; i++) {
      guard[i]++
    }
  })
  let highestMin = guard.reduce((prev, curr) => prev > curr ? prev : curr)
  //console.log(highestMin)
  return {
    sleepyMin: guard.indexOf(highestMin),
    timesSlept: highestMin
  }
}

function sleepSums(sleeps) {
  const guards = []
  for(nap of sleeps) {
    guard = guards.find(g => nap.id === g.id)
    if (guard != undefined) {
      guard.sleepSum += nap.sleepEnd - nap.sleepStart
    } else {
      guards.push({
        id: nap.id,
        sleepSum: nap.sleepEnd - nap.sleepStart,
        sleepStart: nap.sleepStart,
        sleepEnd: nap.sleepEnd
      })
    }
  }
  //console.log(guards)
  return guards
}

function getSleeps(data) {
  let guardId = 0, sleepStart = 0, sleepEnd = 0
  const sleeps = []
  for(row of data) {
    if(row.row.includes('begins')) {
      guardId = parseGuardId(row.row)
    } else if (row.row.includes('asleep')){
      sleepStart = row.min
    } else if (row.row.includes('wakes')) {
      sleepEnd = row.min
      //console.log('id:', guardId, 'start:', sleepStart, 'dur', sleepEnd-sleepStart)
      sleeps.push({
        id: guardId,
        sleepStart,
        sleepEnd
      })
    }
  }
  return sleeps
}

function parseGuardId(str){
  str = str.slice(str.indexOf('#') + 1, str.length)
  return parseInt(str.slice(0, str.indexOf(' ')))
}

function parseDate(row) {
  let y,m,d,hr,min
  row = row.slice(1,row.length)
  y = parseInt(row.slice(0, row.indexOf('-')))
  row = row.slice(row.indexOf('-') + 1, row.length)
  m = parseInt(row.slice(0, row.indexOf('-')))
  row = row.slice(row.indexOf('-') + 1, row.length)
  d = parseInt(row.slice(0, row.indexOf(' ')))
  row = row.slice(row.indexOf(' ') + 1, row.length)
  hr = parseInt(row.slice(0, row.indexOf(':')))
  row = row.slice(row.indexOf(':') + 1, row.length)
  min = parseInt(row.slice(0, row.indexOf(']')))
  row = row.slice(row.indexOf(']') + 1, row.length)
  
  return{
    row, y, m, d, hr, min
  }
}

function compDates(a, b) {
  //year
  if (a.y < b.y) {
    return -1
  }
  if (a.y > b.y) {
    return 1
  } 
  //month
  if (a.m < b.m) {
    return -1
  }
  if (a.m > b.m) {
    return 1
  }
  //day
  if (a.d < b.d) {
    return -1
  }
  if (a.d > b.d) {
    return 1
  }
  //hour
  if (a.hr < b.hr) {
    return -1
  }
  if (a.hr > b.hr) {
    return 1
  }
  //minute
  if (a.min < b.min) {
    return -1
  }
  if (a.min > b.min) {
    return 1
  }
}