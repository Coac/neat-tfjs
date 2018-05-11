const vis = require('vis')

class Graph {
  static draw (genome) {
    const nodes = new vis.DataSet(genome.getNodes().map(node => {
      let shapeProperties = {}
      if (node.type === 'INPUT' || node.type === 'OUTPUT') { shapeProperties = { borderDashes: [5, 5] } }

      return {id: node.id, label: node.type + ' id=' + node.id.toString() + ' lvl=' + node.level, shapeProperties, shape: 'dot'}
    }))

    const edges = new vis.DataSet(genome.getConnections().map(con => {
      return con.enabled ? {from: con.inNodeId, to: con.outNodeId} : {}
    }))
    const container = document.getElementById('visualization')
    const data = {
      nodes: nodes,
      edges: edges
    }
    const options = {
      edges: {arrows: 'to'},
      layout: {randomSeed: 2}
    }
    const network = new vis.Network(container, data, options)
  }
}

module.exports = Graph
