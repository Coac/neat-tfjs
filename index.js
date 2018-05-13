const ConnectionGene = require('./neat/ConnectionGene')
const NodeGene = require('./neat/NodeGene')
const Genome = require('./neat/Genome')
const Graph = require('./viz/Graph')
const TFGenome = require('./neat/TFGenome')
const Neat = require('./neat/Neat.js')

function main () {
  require('./test.js')

  document.getElementById('evolve').onclick = evolve
  document.getElementById('evolve10').onclick = evolve10

  const startGen = new Genome()
  startGen.addNode(new NodeGene('INPUT', 0))
  startGen.addNode(new NodeGene('INPUT', 1))
  startGen.addNode(new NodeGene('HIDDEN', 2))
  startGen.addNode(new NodeGene('OUTPUT', 3))
  startGen.addConnection(0, 2)
  startGen.addConnection(1, 2)
  startGen.addConnection(2, 3)

  const graph = new Graph(startGen)

  const neat = new Neat(startGen, (gen) => {
    const inputs = [[0, 1, 0, 1], [0, 0, 1, 1]]
    const labels = [0, 1, 1, 0]

    const outputTensor = TFGenome.toTFGraph(gen, inputs)[0]
    const output = outputTensor.dataSync()

    // MSE loss
    let sum = 0
    for (let i = 0; i < labels.length; i++) {
      sum += Math.pow(output[i] - labels[i], 2)
    }
    return -(sum / labels.length)
  })

  function evolve () {
    neat.nextGeneration()
    graph.update(neat.fittestGenome)
  }

  function evolve10 () {
    for (let i = 0; i < 10; i++) {
      neat.nextGeneration()
    }

    graph.update(neat.fittestGenome)
  }
}

document.addEventListener('DOMContentLoaded', main)
