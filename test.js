const ConnectionGene = require('./neat/ConnectionGene')
const NodeGene = require('./neat/NodeGene')
const Genome = require('./neat/Genome')
const Graph = require('./viz/Graph')

const gen = new Genome()

gen.nodes.push(new NodeGene('INPUT', 1))
gen.nodes.push(new NodeGene('INPUT', 2))
gen.nodes.push(new NodeGene('INPUT', 3))
gen.nodes.push(new NodeGene('HIDDEN', 5))
gen.nodes.push(new NodeGene('OUTPUT', 4))

gen.connections.push(new ConnectionGene(1, 4, true, 1))
gen.connections.push(new ConnectionGene(2, 4, false, 2))
gen.connections.push(new ConnectionGene(3, 4, true, 3))
gen.connections.push(new ConnectionGene(2, 5, true, 4))
gen.connections.push(new ConnectionGene(5, 4, true, 5))
gen.connections.push(new ConnectionGene(1, 5, true, 8))

// gen.addNodeMutation()

Graph.draw(gen)
