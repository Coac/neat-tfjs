const ConnectionGene = require('./ConnectionGene')
const NodeGene = require('./NodeGene')

class Genome {
  constructor () {
    this.nodes = []
    this.connections = []
  }

  biasMutation () {

  }

  weightMutation () {

  }

  addNodeMutation () {

  }

  addConnectionMutation () {
    const inNode = this.nodes[Math.floor(Math.random() * this.nodes.length)]
    const outNode = this.nodes[Math.floor(Math.random() * this.nodes.length)]

    if (inNode === outNode) { return }
    if (this.existConnection(inNode, outNode)) { return }
    if (outNode.type === 'INPUT' || inNode === 'OUTPUT') { return }

    this.connections.push(new ConnectionGene(inNode.id, outNode.id, true, 1)) // TODO innovation
  }

  existConnection (inNode, outNode) {
    for (let i = 0; i < this.connections.length; i++) {
      const con = this.connections[i]
      if ((con.inNodeId === inNode.id && con.outNodeId === outNode.id) ||
        (con.outNodeId === inNode.id && con.inNodeId === outNode.id)) {
        return true
      }
    }

    return false
  }

  copy () {
    const clone = new Genome()
    clone.nodes = this.nodes.map(node => node.copy())
    clone.connections = this.connections.map(connection => connection.copy())
    return clone
  }
}

module.exports = Genome
