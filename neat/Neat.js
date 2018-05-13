const Species = require('./Species')

class Neat {
  constructor (genome, evaluator) {
    this.species = []
    this.genomes = [genome]
    this.evaluator = evaluator

    this.fittestGenome = null
    this.highestFitness = -Infinity

    this.populationSize = 50
  }

  nextGeneration () {
    this._classifyPopulationIntoSpecies()
    this._evaluateGenomes()
    this._keepBestGenomes()
    this._crossOverAndMutate()

    console.log('fitness:', this.highestFitness, ' species:', this.species.length, ' connections:', this.fittestGenome.connections.size, ' nodes:', this.fittestGenome.nodes.size)

    this._clearSpecies()

    return this.highestFitness
  }

  _classifyPopulationIntoSpecies () {
    const compatibilityThreshold = 2

    for (const genome of this.genomes) {
      let foundSpecies = false
      for (const spe of this.species) {
        if (genome.compatibilityDistance(spe.representative) < compatibilityThreshold) {
          spe.add(genome)
          foundSpecies = true
          break
        }
      }

      if (!foundSpecies) {
        this.species.push(new Species(genome))
      }
    }

    // Remove empty Species and change representative
    for (let i = 0; i < this.species.length; i++) {
      const spe = this.species[i]
      if (spe.size() === 0) {
        this.species.splice(i, 1)
        i--
        console.log('Removed empty species')
      }
    }
  }

  _evaluateGenomes () {
    this.genomes.forEach((gen) => {
      gen.fitness = this.evaluator(gen)
      if (gen.fitness > this.highestFitness) {
        this.fittestGenome = gen
        this.highestFitness = gen.fitness
      }
    })

    this.species.forEach(spe => { spe.adjustFitness() })
  }

  _keepBestGenomes () {
    this.genomes = []

    for (const spe of this.species) {
      this.genomes.push(spe.getFittestGenome())
    }
  }

  _crossOverAndMutate () {
    while (this.genomes.length < this.populationSize) {
      const randomSpecies = this.species[Math.floor(Math.random() * this.species.length)]
      const gen1 = randomSpecies.getRandomGenome()
      const gen2 = randomSpecies.getRandomGenome()

      const child = gen1.fitness > gen2.fitness ? gen1.crossover(gen2) : gen2.crossover(gen1)
      child.mutate()

      this.genomes.push(child)
    }
  }

  _clearSpecies () {
    this.species = []
  }
}

module.exports = Neat
