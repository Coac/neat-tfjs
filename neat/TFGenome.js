class TFGenome {
  static toTFGraph (genome) {
    return tf.tidy(() => {
      let nodes = genome.getNodes()
      // const inputs = nodes.filter(node => node.type === 'INPUT')
      const outputs = nodes.filter(node => node.type === 'OUTPUT')
      // nodes = nodes.filter(node => node.type === 'HIDDEN' )

      nodes.sort((a, b) => a.level - b.level)

      for (let node of nodes) {
        let out = tf.scalar(1)
        for (let conId of node.inConnectionsId) {
          const con = genome.connections.get(conId)
          if (!con.enabled) { continue }

          const inNode = genome.nodes.get(con.inNodeId)
          if (!inNode.out) { console.log('strange ??') }

          out = out.add(tf.scalar(con.weight).mul(inNode.out))
        }
        out = out.relu()
        node.out = out
      }

      return outputs.map(node => node.out)
    })
  }
}

module.exports = TFGenome
