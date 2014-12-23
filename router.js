'use strict';
var Router = require('ampersand-router')

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
    window.APP.view.model.set('showLayers', true)
  },

  scan: function() {
    window.APP.view.model.set('scannerVisible', true)
  }
})
