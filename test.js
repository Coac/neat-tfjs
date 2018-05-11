const t0 = performance.now()

const ConnectionGene = require('./neat/ConnectionGene')
const NodeGene = require('./neat/NodeGene')
const Genome = require('./neat/Genome')
const Graph = require('./viz/Graph')

const gen = new Genome()

gen.addNode(new NodeGene('INPUT', 1))
gen.addNode(new NodeGene('INPUT', 2))
gen.addNode(new NodeGene('INPUT', 3))
gen.addNode(new NodeGene('HIDDEN', 5))
gen.addNode(new NodeGene('OUTPUT', 4))

gen.addConnection(1, 4)
gen.addConnection(2, 4)
gen.addConnection(3, 4)
gen.addConnection(2, 5)
gen.addConnection(5, 4)
gen.addConnection(1, 5)

for (let i = 0; i < 10; i++) {
  gen.addNodeMutation()
}

for (let i = 0; i < 10; i++) {
  gen.addConnectionMutation()
}

// Graph.draw(gen)

const t1 = performance.now()
console.log('Took ' + (t1 - t0) + ' milliseconds.')
