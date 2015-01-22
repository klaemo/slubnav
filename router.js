'use strict';
var Router = require('ampersand-router')
var app = require('./app')

// Unsere Pages
// var IndexPage = require('./pages/index-page')

module.exports = Router.extend({
  routes: {
    '': 'index',
    'code/:code': 'code',
    'coords/:x/:y': 'coords',
    scan: 'scan',
    floors: 'floors'
  },

  index: function() {
    // this.trigger('page', new IndexPage())
  },

  floors: function() {
    app.state.set('showLayers', true)
  },

  scan: function() {
    app.state.set('scannerVisible', true)
  },

  code: function(code) {
    app.state.set('start', app.locations.get(parseInt(code)))
  }
})
