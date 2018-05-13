const tf = require('@tensorflow/tfjs')

class TFGenome {
  static toTFGraph (genome, inputs) {
    return tf.tidy(() => {
      let nodes = genome.getNodes()
      const inputNodes = nodes.filter(node => node.type === 'INPUT')
      const outputsNodes = nodes.filter(node => node.type === 'OUTPUT')
      nodes = nodes.filter(node => node.type !== 'INPUT')

      if (inputs.length !== inputNodes.length) {
        throw new Error('mismatch inputs length', inputs.length, ' vs ', inputNodes.length)
      }

      for (let i = 0; i < inputNodes.length; i++) {
        inputNodes[i].out = tf.tensor(inputs[i])
      }

      nodes.sort((a, b) => a.level - b.level)

      for (let node of nodes) {
        let out = tf.scalar(0)
        for (let conId of node.inConnectionsId) {
          const con = genome.connections.get(conId)
          if (!con.enabled) { continue }

          const inNode = genome.nodes.get(con.inNodeId)

          out = out.add(tf.scalar(con.weight).mul(inNode.out))
        }
        out = tf.sigmoid(out.add(tf.scalar(node.bias)))
        node.out = out
      }

      return outputsNodes.map(node => node.out)
    })
  }
}

module.exports = TFGenome
