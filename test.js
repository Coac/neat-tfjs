const t0 = performance.now()

const ConnectionGene = require('./neat/ConnectionGene')
const NodeGene = require('./neat/NodeGene')
const Genome = require('./neat/Genome')
const Graph = require('./viz/Graph')
const TFGenome = require('./neat/TFGenome')
const Neat = require('./neat/Neat.js')

const gen1 = new Genome()
gen1.addNode(new NodeGene('INPUT', 0))
gen1.addNode(new NodeGene('INPUT', 1))
gen1.addNode(new NodeGene('INPUT', 2))
gen1.addNode(new NodeGene('HIDDEN', 4))
gen1.addNode(new NodeGene('OUTPUT', 3))
gen1.addConnection(0, 3)
gen1.addConnection(1, 3, false)
gen1.addConnection(2, 3)
gen1.addConnection(1, 4)
gen1.addConnection(4, 3)
gen1.addConnection(0, 4)

const gen2 = new Genome()
gen2.addNode(new NodeGene('INPUT', 0))
gen2.addNode(new NodeGene('INPUT', 1))
gen2.addNode(new NodeGene('INPUT', 2))
gen2.addNode(new NodeGene('HIDDEN', 4))
gen2.addNode(new NodeGene('HIDDEN', 5))
gen2.addNode(new NodeGene('OUTPUT', 3))
gen2.addConnection(0, 3)
gen2.addConnection(1, 3, false)
gen2.addConnection(2, 3)
gen2.addConnection(1, 4)
gen2.addConnection(4, 3, false)
gen2.addConnection(4, 5)
gen2.addConnection(5, 3)
gen2.addConnection(2, 4)
gen2.addConnection(0, 5)

console.log('Compatibility distance:', gen2.compatibilityDistance(gen1))

// TFGenome.toTFGraph(gen1).map(tensor => tensor.print())

const startGen = new Genome()
startGen.addNode(new NodeGene('INPUT', 0))
startGen.addNode(new NodeGene('INPUT', 1))
startGen.addNode(new NodeGene('HIDDEN', 2))
startGen.addNode(new NodeGene('OUTPUT', 3))
startGen.addConnection(0, 2)
startGen.addConnection(1, 2)
startGen.addConnection(2, 3)

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
for (let i = 0; i < 10; i++) {
  neat.nextGeneration()
}

Graph.draw(neat.fittestGenome)

const t1 = performance.now()
console.log('Took ' + (t1 - t0) + ' milliseconds.')
