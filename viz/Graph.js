const vis = require('vis')

class Graph {
  static draw (genome) {
    const nodes = new vis.DataSet(genome.getNodes().map(node => {
      let props = {}
      if (node.type === 'INPUT') { props = { shapeProperties: { borderDashes: [5, 5] }, color: '#87bdd8' } }
      if (node.type === 'OUTPUT') { props = { color: '#daebe8' } }
      if (node.type === 'HIDDEN') { props = { color: '#b7d7e8' } }

      return Object.assign({id: node.id, label: 'id=' + node.id.toString() + ' lvl=' + node.level, shape: 'circle'}, props)
    }))

    const edges = new vis.DataSet(genome.getConnections().map(con => {
      return con.enabled ? {from: con.inNodeId, to: con.outNodeId, label: con.weight.toFixed(3)} : {}
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
