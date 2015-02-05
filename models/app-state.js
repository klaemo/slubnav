'use strict';
var State = require('ampersand-state')

module.exports = State.extend({
  props: {
    showLayers: { type: 'boolean', default: false },
    scannerVisible: { type: 'boolean', default: false },
    floor: { type: 'number', default: 0 },
    start: { type: 'object' },
    destination: { type: 'object' }
  },

  getPathId: function() {
    if (this.start && this.destination)
      return this.start.id + '-' + this.destination.id
  }
})
