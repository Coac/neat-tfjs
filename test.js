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

// for (let i = 0; i < 100; i++) {
//   gen2.mutate()
// }
//
for (let i = 0; i < 10; i++) {
  gen1.addNodeMutation()
}

for (let i = 0; i < 5; i++) {
  gen1.addConnectionMutation()
}

console.log('Compatibility distance:', gen2.compatibilityDistance(gen1))

Graph.draw(gen1)

// TFGenome.toTFGraph(gen1).map(tensor => tensor.print())

const neat = new Neat(gen1, (gen) => -Math.sqrt(200 - gen.nodes.size))
for (let i = 0; i < 20; i++) {
  neat.nextGeneration()
}

const t1 = performance.now()
console.log('Took ' + (t1 - t0) + ' milliseconds.')
