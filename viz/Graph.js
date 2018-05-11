const vis = require('vis')

class Graph {
  static draw (genome) {
    const nodes = new vis.DataSet(genome.nodes.map(node => {
      let shapeProperties = {}
      if (node.type === 'INPUT' || node.type === 'OUTPUT') { shapeProperties = { borderDashes: [5, 5] } }

      return {id: node.id, label: node.type + ' ' + node.id.toString(), shapeProperties, shape: 'dot'}
    }))

    const edges = new vis.DataSet(genome.connections.map(con => {
      return con.enabled ? {from: con.inNodeId, to: con.outNodeId} : {}
    }))
    const container = document.getElementById('visualization')
    const data = {
      nodes: nodes,
      edges: edges
    }
    const options = {edges: {arrows: 'to'}}
    const network = new vis.Network(container, data, options)
  }
}

module.exports = Graph
