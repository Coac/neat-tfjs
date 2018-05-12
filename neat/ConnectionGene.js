class ConnectionGene {
  constructor (inNodeId, outNodeId, enabled, innovation) {
    this.id = generateId()

    this.inNodeId = inNodeId
    this.outNodeId = outNodeId
    this.enabled = enabled
    this.innovation = innovation
    this.resetWeight()
  }

  peturbWeight () {
    this.weight += gaussianRnd() / 10
  }

  resetWeight () {
    this.weight = gaussianRnd()
  }

  disable () {
    this.enabled = false
  }

  copy () {
    const clone = new ConnectionGene(this.inNodeId, this.outNodeId, this.enabled, this.innovation)
    clone.weight = this.weight
    return clone
  }
}

function generateId () {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function gaussianRnd () {
  return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3
}

module.exports = ConnectionGene
