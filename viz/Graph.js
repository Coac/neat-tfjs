const vis = require('vis')

class Graph {
  constructor (genome) {
    const nodes = new vis.DataSet(Graph.nodesArrayFromGenome(genome))
    const edges = new vis.DataSet(Graph.edgesArrayFromGenome(genome))
    const container = document.getElementById('visualization')
    const data = {
      nodes: nodes,
      edges: edges
    }
    const options = {
      edges: {arrows: 'to'},
      layout: {randomSeed: 2
      }
    }
    const network = new vis.Network(container, data, options)

    this.nodes = nodes
    this.edges = edges
  }

  update (genome) {
    const nodesArray = Graph.nodesArrayFromGenome(genome)
    const edgesArray = Graph.edgesArrayFromGenome(genome)

    for (let node of nodesArray) {
      try {
        this.nodes.update(node)
      } catch (e) {
        this.nodes.add(node)
      }
    }

    for (let edge of edgesArray) {
      try {
        this.edges.update(edge)
      } catch (e) {
        this.edges.add(edge)
      }
    }
  }

  static nodesArrayFromGenome (genome) {
    return genome.getNodes().map(node => {
      let props = {}
      if (node.type === 'INPUT') { props = { shapeProperties: { borderDashes: [5, 5] }, color: '#87bdd8' } }
      if (node.type === 'OUTPUT') { props = { color: '#daebe8' } }
      if (node.type === 'HIDDEN') { props = { color: '#b7d7e8' } }

      return Object.assign({id: node.id, label: 'id=' + node.id.toString() + ' lvl=' + node.level, shape: 'circle'}, props)
    })
  }

  static edgesArrayFromGenome (genome) {
    return genome.getConnections().map(con => {
      return con.enabled ? {id: con.innovation, from: con.inNodeId, to: con.outNodeId, label: con.weight.toFixed(3)} : {}
    })
  }
}

module.exports = Graph
