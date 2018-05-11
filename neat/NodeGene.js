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
    const clone = new NodeGene(this.type, this.id, this.bias)
    clone.level = this.level
    clone.outConnectionsId = this.outConnectionsId.slice()
    clone.inConnectionsId = this.inConnectionsId.slice()

    return clone
  }
}

module.exports = NodeGene
