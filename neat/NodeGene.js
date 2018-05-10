class NodeGene {
  constructor (type, id, bias) {
    this.type = 'INPUT' // INPUT, HIDDEN, OUTPUT
    this.id = id
    this.bias = bias || 0

    this.outConnections = new Map()
  }

  copy () {
    return new NodeGene(type, id)
  }
}
