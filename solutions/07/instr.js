const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'input.txt')
const STATIC_TIME = 60
const WORKER_AMOUNT = 5

fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
  if (!err) {
    solve(data)
  } else {
    console.log(err)
  }
})

function solve(data) {
  data = parseInstr(data)
  const answer1 = findOrder(data)
  const answer2 = calculateDuration(data)
  console.log('ANSWER TO PART 1', answer1)
  console.log('ANSWER TO PART 2', answer2)
}

function calculateDuration(data) {
  console.log(data)
  const startNode = findFirstTask(data)
  let workers = initWorkers(WORKER_AMOUNT)
  data = reformat(data)
  let duration = 0
  while (data.find(d => d.status !== 100) !== undefined) {
    //find nodes with status 0 that are free for work (no parents)
    //allocate these nodes to a worker
    let response = allocateWorkers(data, workers)
    //work (reduce ETA by one, if ETA goes to 0, change task to completed)
    response = work(response)

    data = response.data
    workers = response.workers
    console.log('workers: ', workers)
    //console.log('data:', data)
    console.log('DURATION:', duration)
    duration++
  }
  
  return duration
}

function work({data, workers}) {
  const working = workers.filter(w => w.currentTask !== null)
  for(w of working) {
    w.ETA--
    if (w.ETA === 0) {
      //set node status to 100 COMPLETED
      //remove the node from all parents lists
      data = data.map(i => {
          if (i.id === w.currentTask) {
            i.status = 100
          }
          return i
        })
        .map(i => {return {
            id: i.id,
            status: i.status,
            children: i.children,
            parents: i.parents.filter(p => p !== w.currentTask)
          }
        })
      
      //set current task to null
      workers[w.id].currentTask = null
    }
  }
  return {data, workers}
}

function allocateWorkers(data, workers) {
  const availableNodes = data.filter(i => i.parents.length === 0 && i.status === 0).map(i => i.id).sort()
  const availableWorkers = workers.filter(w => w.currentTask === null)
  for(let i = 0; i < Math.min (availableNodes.length, availableWorkers.length); i++) {
    const an = availableNodes[i]
    const ani = data.findIndex(t => t.id === an)
    const aw = availableWorkers[i]
    const awi = workers.findIndex(w => w.id === aw.id)
    //set node status to 'in progress'
    data[ani].status = 20
    //set worker task and ETA
    workers[awi].currentTask = an
    workers[awi].ETA = tt[an] + STATIC_TIME
  }
  return {data, workers}
}

function reformat(data) {
  const nodes = []
  data.forEach(i => {
    const nodeIds = nodes.map(n => n.id).concat()
    if (!nodeIds.includes(i.dep)) {
      nodes.push({
        id: i.dep,
        status: 0,
        children: [],
        parents: []
      })
    } else if(!nodeIds.includes(i.res)) {
      nodes.push({
        id: i.res,
        status: 0,
        children: [],
        parents: []
      })
    }
  })
  data.forEach(i => {
    const nodeIndex = nodes.findIndex(n => n.id === i.dep)
    nodes[nodeIndex].children.push(i.res)
  })
  nodes.forEach(n => {
    data.filter(i => i.res === n.id)
      .forEach(i => n.parents.push(i.dep))
  })
  return nodes
}

function findFirstTask(data) {
  const dep = data.map(i => i.dep)
  const res = data.map(i => i.res)
  const available = []
  for (d of dep) {
    if(!res.includes(d)) {
      available.push(d)
    }
  }
  return available.sort()[0]
}

function findNextTask(data) {
  
}


function initWorkers(amount) {
  const workers = []
  for(let i = 0; i < amount; i++) {
    workers[i] = {
      id: i,
      currentTask: null,
      ETA: 0
    }
  }
  return workers
}

function findOrder(data) {
  let boundRes = findBound(data)
  let order = ""
  let lastOrders = findLast(data)

  while(boundRes.length > 0) {
    let freeInstr = findFree(data, boundRes)
    let currentInstr = freeInstr[0]
    freeInstr.shift()
    order+= currentInstr
    data = data.filter(instr => instr.dep !== currentInstr)
    boundRes = findBound(data)
    //console.log('order', order)
    //console.log('freeInstr',freeInstr)
    //console.log('boundRes', boundRes)
    //console.log('data', data)
  }
  lastOrders.forEach(o => order += o)

  //console.log('last instr', lastOrders)
  return order
}

function findLast(data) {
  const lastOrders = []
  const dep = data.map(i => i.dep)
  data.forEach(i => {
    if (!dep.includes(i.res) && !lastOrders.includes(i.res)) {
      lastOrders.push(i.res)
    }
  })
  return lastOrders.sort()
}

function findFree(data, boundRes) {
  const freeInstr = []
  data.forEach(instr => {
    if (!boundRes.includes(instr.dep) && !freeInstr.includes(instr.dep)){
      freeInstr.push(instr.dep)
    }
  })
  return freeInstr.sort()
}

function findBound(data) {
  const boundRes = []
  data.forEach((instr) => {
    if (!boundRes.includes(instr.res)) {
      boundRes.push(instr.res)
    }
  })
  return boundRes
}

function parseInstr(data) {
  const instr = data
    .trim()
    .split("\n")
    .map(parseRow)

  return instr
}

function parseRow(row) {
  const instr = {
    dep: row.slice(5,6),
    res: row.slice(36,37)
  }
  return instr
}


//tt stands for task time
const tt = {
  A:1,
  B:2,
  C:3,
  D:4,
  E:5,
  F:6,
  G:7,
  H:8,
  I:9,
  J:10,
  K:11,
  L:12,
  M:13,
  N:14,
  O:15,
  P:16,
  Q:17,
  R:18,
  S:19,
  T:20,
  U:21,
  V:22,
  W:23,
  X:24,
  Y:25,
  Z:26
}