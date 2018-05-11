const t0 = performance.now()

const ConnectionGene = require('./neat/ConnectionGene')
const NodeGene = require('./neat/NodeGene')
const Genome = require('./neat/Genome')
const Graph = require('./viz/Graph')

const gen = new Genome()

gen.addNode(new NodeGene('INPUT', 0))
gen.addNode(new NodeGene('INPUT', 1))
gen.addNode(new NodeGene('INPUT', 2))
gen.addNode(new NodeGene('HIDDEN', 4))
gen.addNode(new NodeGene('OUTPUT', 3))

gen.addConnection(0, 3)
gen.addConnection(1, 3)
gen.addConnection(2, 3)
gen.addConnection(1, 4)
gen.addConnection(4, 3)
gen.addConnection(0, 4)

for (let i = 0; i < 2; i++) {
  gen.addNodeMutation()
}

for (let i = 0; i < 10; i++) {
  gen.addConnectionMutation()
}

Graph.draw(gen)

const t1 = performance.now()
console.log('Took ' + (t1 - t0) + ' milliseconds.')
