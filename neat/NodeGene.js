class NodeGene {
  constructor (type, id, bias) {
    this.type = type // INPUT, HIDDEN, OUTPUT
    this.id = id
    this.bias = bias || 0

    this.outConnections = new Map()
  }

  copy () {
    return new NodeGene(this.type, this.id)
  }
}

module.exports = NodeGene
