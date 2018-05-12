const ConnectionGene = require('./ConnectionGene')
const NodeGene = require('./NodeGene')

class Genome {
  constructor () {
    this.nodes = new Map()
    this.connections = new Map()

    this.INNOVATION = 0
  }

  crossover (gen2) {
    const child = new Genome()
    child.INNOVATION = this.INNOVATION

    child.nodes = new Map(Array.from(this.nodes.entries()).map(entry => [entry[0], entry[1].copy()]))

    for (const entry of this.connections) {
      const innovation = entry[0]
      const con = entry[1]

      // matching
      if (gen2.connections.has(innovation)) {
        child.connections.set(innovation, Math.random() > 0.5 ? con.copy() : gen2.connections.get(innovation).copy())
      } else {
        child.connections.set(innovation, con.copy())
      }
    }

    return child
  }

  mutate () {
    const rand = Math.random()
    let cumulProba = 0
    let selectedMutation = this.weightMutation

    const mutations = []
    mutations.push({proba: 0.2, mutation: this.addNodeMutation})
    mutations.push({proba: 0.8, mutation: this.addConnectionMutation})

    mutations.every(function (object) {
      var proba = object.proba
      var mutation = object.mutation
      cumulProba += proba
      if (rand < cumulProba) {
        selectedMutation = mutation
        return false
      }
      return true
    })

    selectedMutation.call(this)
  }

  weightMutation () {
    this._getRandomConnection().peturbWeight()
  }

  resetWeightMutation () {
    this._getRandomConnection().resetWeight()()
  }

  addNodeMutation () {
    this.INNOVATION++

    const disabledCon = this._getRandomConnection()
    disabledCon.disable()

    const node = new NodeGene('HIDDEN', this.nodes.size)
    this.addNode(node)

    this.addConnection(disabledCon.inNodeId, node.id).weight = 1
    this.addConnection(node.id, disabledCon.outNodeId).weight = disabledCon.weight
  }

  addConnectionMutation () {
    const inNode = this.nodes.get(Math.floor(Math.random() * this.nodes.size))
    const acceptableNodes = this.getNodes().filter(node => node.level >= inNode.level)

    if (acceptableNodes.length === 0) { return }

    const outNode = acceptableNodes[Math.floor(Math.random() * acceptableNodes.length)]

    if (inNode === outNode) { return }
    if (this._existConnection(inNode, outNode)) { return }
    if (outNode.type === 'INPUT' || inNode === 'OUTPUT') { return }

    this.addConnection(inNode.id, outNode.id)
  }

  addConnection (inNodeId, outNodeId, enabled = true) {
    const newCon = new ConnectionGene(inNodeId, outNodeId, enabled, this.INNOVATION++)
    this.connections.set(newCon.innovation, newCon)
    const inNode = this.nodes.get(inNodeId)
    const outNode = this.nodes.get(outNodeId)

    inNode.outConnectionsId.push(newCon.innovation)
    outNode.inConnectionsId.push(newCon.innovation)

    this._calculateAllNodeLevel() // TODO optimize, call it where needed

    return newCon
  }

  addNode (node) {
    this.nodes.set(node.id, node)
  }

  _getRandomConnection () {
    const connections = this.getConnections()
    return connections[Math.floor(Math.random() * connections.length)]
  }

  _calculateAllNodeLevel () {
    const inputs = this.getNodes().filter(node => node.type === 'INPUT')
    for (let i = 0; i < inputs.length; i++) {
      this._calculateNodeLevelRecur(inputs[i], 0)
    }
  }

  _calculateNodeLevelRecur (node, level) {
    level++
    node.level = Math.max(node.level, level)

    for (let id of node.outConnectionsId) {
      const con = this.connections.get(id)
      const childNode = this.nodes.get(con.outNodeId)
      this._calculateNodeLevelRecur(childNode, level)
    }
  }

  _existConnection (nodeIn, nodeOut) {
    for (let conId of nodeIn.outConnectionsId) {
      if (this.connections.get(conId).outNodeId === nodeOut.id) { return true }
    }

    return false
  }

  getNodes () {
    return Array.from(this.nodes.values())
  }

  getConnections () {
    return Array.from(this.connections.values())
  }

  copy () {
    const clone = new Genome()
    clone.nodes = new Map(Array.from(this.nodes.entries()).map(entry => [entry[0], entry[1].copy()]))
    clone.connections = new Map(Array.from(this.connections.entries()).map(entry => [entry[0], entry[1].copy()]))
    clone.INNOVATION = this.INNOVATION
    return clone
  }
}

module.exports = Genome
