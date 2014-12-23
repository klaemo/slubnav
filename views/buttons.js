'use strict';
var View = require('ampersand-view')
var template = require('../templates/buttons.jade')

var ScanBox = require('./scan-box')

module.exports = View.extend({
  template: template,

  events: {
    'click .layers-button': 'toggleLayers',
    'click .scan-button': 'toggleScanner'
  },

  initialize: function() {
    this.listenTo(this.model, 'change:scannerVisible', this.renderScanner)
  },

  toggleScanner: function(event) {
    event.preventDefault()
    this.model.toggle('scannerVisible')
  },

  renderScanner: function(model, scannerVisible) {
    if (!scannerVisible) {
      this.scanner.remove()
    } else {
      this.scanner = new ScanBox({
        triggerEl: event.target
      })
      this.scanner.render()
    }
  },

  toggleLayers: function(event) {
    event.preventDefault()
    this.model.toggle('showLayers')
  }
})
