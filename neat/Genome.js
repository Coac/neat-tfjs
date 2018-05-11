const ConnectionGene = require('./ConnectionGene')
const NodeGene = require('./NodeGene')

class Genome {
  constructor () {
    this.nodes = new Map()
    this.connections = new Map()

    this.INNOVATION = 0
  }

  biasMutation () {

  }

  weightMutation () {

  }

  addNodeMutation () {
    const disabledCon = this.connections.get(Math.floor(Math.random() * this.connections.size))
    disabledCon.disable()

    const node = new NodeGene('HIDDEN', this.nodes.size)
    this.addNode(node)

    this.addConnection(disabledCon.inNodeId, node.id)
    this.addConnection(node.id, disabledCon.outNodeId)
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

  addConnection (inNodeId, outNodeId) {
    const newCon = new ConnectionGene(inNodeId, outNodeId, true, this.INNOVATION++)
    this.connections.set(newCon.innovation, newCon)
    const inNode = this.nodes.get(inNodeId)
    const outNode = this.nodes.get(outNodeId)

    inNode.outConnectionsId.push(newCon.innovation)
    outNode.inConnectionsId.push(newCon.innovation)

    this._calculateAllNodeLevel()
  }

  addNode (node) {
    this.nodes.set(node.id, node)
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
    clone.nodes = this.getNodes().nodes.map(node => node.copy())
    clone.connections = this.getConnections().map(connection => connection.copy())
    return clone
  }
}

module.exports = Genome
