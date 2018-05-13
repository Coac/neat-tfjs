const DROPOFF_AGE = 15 // TODO

class Species {
  constructor (representative) {
    this.representative = representative
    this.genomes = [representative]
    this.generationWithoutProgress = 0
  }

  getRandomGenome () {
    return this.genomes[Math.floor(Math.random() * this.genomes.length)]
  }

  getFittestGenome () {
    return this.genomes.reduce((gen1, gen2) => gen1.fitness > gen2.fitness ? gen1 : gen2)
  }

  adjustFitness () {
    this.representative.fitness /= this.size()
    this.genomes.forEach(gen => { gen.fitness /= this.size() })
  }

  add (genome) {
    this.genomes.push(genome)
  }

  size () {
    return this.genomes.length
  }

  clear () {
    this.genomes = []
  }
}

module.exports = Species
