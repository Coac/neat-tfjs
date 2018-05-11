class NodeGene {
  constructor (type, id, bias) {
    this.type = type // INPUT, HIDDEN, OUTPUT
    this.id = id
    this.bias = bias || 0

    // Used by addConnectionMutation to not generate cycle
    this.level = 0

    this.outConnectionsId = []
    this.inConnectionsId = []
  }

  copy () {
    return new NodeGene(this.type, this.id)
  }
}

module.exports = NodeGene
