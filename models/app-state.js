var State = require('ampersand-state')

module.exports = State.extend({
  props: {
    showLayers: { type: 'boolean', default: false },
    scannerVisible: { type: 'boolean', default: false }
  }
})
