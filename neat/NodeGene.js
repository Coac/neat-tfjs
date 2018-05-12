class NodeGene {
  constructor (type, id) {
    this.type = type // INPUT, HIDDEN, OUTPUT
    this.id = id

    // Used by addConnectionMutation to not generate cycle
    this.level = 0

    this.outConnectionsId = []
    this.inConnectionsId = []
  }

  copy () {
    const clone = new NodeGene(this.type, this.id)
    clone.level = this.level
    clone.outConnectionsId = this.outConnectionsId.slice()
    clone.inConnectionsId = this.inConnectionsId.slice()

    return clone
  }
}

module.exports = NodeGene
