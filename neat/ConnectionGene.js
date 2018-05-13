const MUTATION_POWER = 2

class ConnectionGene {
  constructor (inNodeId, outNodeId, enabled, innovation) {
    this.id = generateId()

    this.inNodeId = inNodeId
    this.outNodeId = outNodeId
    this.enabled = enabled
    this.innovation = innovation
    this.resetWeight()
  }

  perturbWeight () {
    this.weight += (Math.random() * 2 - 1) * MUTATION_POWER // [-MUTATION_POWER, MUTATION_POWER]
  }

  resetWeight () {
    this.weight = Math.random() * 2 - 1
  }

  enable () {
    this.enabled = true
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

module.exports = ConnectionGene
