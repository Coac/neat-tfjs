const ConnectionGene = require('./ConnectionGene')
const NodeGene = require('./NodeGene')

let INNOVATION = 0

class Genome {
  constructor () {
    this.nodes = new Map()
    this.connections = new Map()
  }

  compatibilityDistance (gen2, c1 = 1, c2 = 1, c3 = 1) {
    const innovations1 = Array.from(this.connections.keys())
    const innovations2 = Array.from(gen2.connections.keys())

    const innovationsMax1 = Math.max(...innovations1)
    const innovationsMax2 = Math.max(...innovations2)
    const innoMax = Math.max(innovationsMax1, innovationsMax2)

    let excess = 0
    let disjoint = 0
    let averageWeightDiff = 0
    let matching = 0
    for (let i = 0; i <= innoMax; i++) {
      const gen1Has = this.connections.has(i)
      const gen2Has = gen2.connections.has(i)
      if ((i > innovationsMax1 && gen2Has) || (i > innovationsMax2 && gen1Has)) {
        excess++
      } else if ((gen1Has && !gen2Has) || (!gen1Has && gen2Has)) {
        disjoint++
      } else if (gen1Has && gen2Has) {
        averageWeightDiff += Math.abs(this.connections.get(i).weight - gen2.connections.get(i).weight)
        matching++
      }
    }

    // console.log(innovations1)
    // console.log(innovations2)
    // console.log('Excess:', excess, 'Disjoint:', disjoint, 'Matching:', matching)

    averageWeightDiff /= matching || 1

    let N = Math.max(innovations1.length, innovations2.length)

    return (c1 * excess + c2 * disjoint) / N + c3 * averageWeightDiff
  }

  crossover (gen2) {
    const child = new Genome()
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

      // Reactivate disabled
      if (!child.connections.get(innovation).enabled && Math.random() > 0.75) {
        child.connections.get(innovation).enable()
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
    INNOVATION++

    const disabledCon = this._getRandomConnection()
    disabledCon.disable()

    const node = new NodeGene('HIDDEN', this.nodes.size)
    this.addNode(node)

    this.addConnection(disabledCon.inNodeId, node.id).weight = 1
    this.addConnection(node.id, disabledCon.outNodeId).weight = disabledCon.weight
  }

  addConnectionMutation () {
    let attempt = 0
    const MAX_ATTEMPT = 100
    while (attempt++ < MAX_ATTEMPT) {
      const inNode = this.nodes.get(Math.floor(Math.random() * this.nodes.size))
      const acceptableNodes = this.getNodes().filter(node => node.level >= inNode.level)

      if (acceptableNodes.length === 0) { continue }

      const outNode = acceptableNodes[Math.floor(Math.random() * acceptableNodes.length)]

      if (inNode === outNode) { continue }
      if (this._existConnection(inNode, outNode)) { continue }
      if (outNode.type === 'INPUT' || inNode === 'OUTPUT') { continue }

      this.addConnection(inNode.id, outNode.id)
      return
    }
    console.log('Add connection mutation failed :(')
  }

  addConnection (inNodeId, outNodeId, enabled = true) {
    const newCon = new ConnectionGene(inNodeId, outNodeId, enabled, INNOVATION++)
    this.connections.set(newCon.innovation, newCon)
    const inNode = this.nodes.get(inNodeId)
    const outNode = this.nodes.get(outNodeId)

    inNode.outConnectionsId.push(newCon.innovation)
    outNode.inConnectionsId.push(newCon.innovation)

    this._calculateNodeLevelRecur(inNode, inNode.level - 1)

    return newCon
  }

  addNode (node) {
    this.nodes.set(node.id, node)
  }

  _getRandomConnection () {
    const connections = this.getConnections()
    return connections[Math.floor(Math.random() * connections.length)]
  }

  // Not used
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
    return clone
  }
}

module.exports = Genome
