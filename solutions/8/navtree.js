const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'input.txt')
const MAX_INT = 1000000

fs.readFile(filePath, {encoding: 'utf-8'},(err, data) => {
  if (!err) {
    solve(data)
  } else {
    console.log(err)
  }
})

const solve = (data) => {
  data = data.trim().split(' ')
  const nodes = nodify(data, [], null, getRandomId())
  const answer1 = nodes.reduce((acc, curr) => acc + curr.meta.reduce((m_acc, m_curr) => m_acc + m_curr, 0), 0)
  const rootNode = nodes.find(n => n.parent === null)
  //console.log(nodes)
  console.log('ANSWER TO PART 1', answer1)
  console.log('ANSWER TO PART 2', rootNode.val)
}

const nodify = (data, nodes, parent, id) => {
  const childrenSize = parseInt(data[0])
  const metaSize = parseInt(data[1])
  const childIds = []
  data.splice(0,2)
  for( let i = 0; i < childrenSize; i++){
    childIds.push(getRandomId())
    nodify(data, nodes, id, childIds[i])
  } 

  let val = 0
  const metaData = data.splice(0, metaSize).map(m => parseInt(m))
  if (childrenSize === 0) {
    val = metaData.reduce((acc, curr) => acc+curr, 0) 
  } else {
    for (m of metaData) {
      if (m <= childrenSize) {
        val += nodes.find(n => n.id === childIds[m-1]).val
      }
    }
  }

  const node = {
    id,
    header: [childrenSize, metaSize],
    parent, 
    children: childIds,
    meta: metaData,
    val
  }
  nodes.push(node)
  return nodes
}

const getRandomId = () => {
  return Math.floor(Math.random() * Math.floor(MAX_INT));
}
