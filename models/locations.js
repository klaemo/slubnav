'use strict';

var Hummingbird = require('hummingbird')
var Collection = require('ampersand-collection')
var Model = require('ampersand-state')

module.exports = Collection.extend({
  model: Model.extend({
    extraProperties: 'allow'
  }),

  initialize: function(models, opts) {
    var hb = new Hummingbird.Index()
    models = models || []
    models.forEach(function(model) {
      hb.add({ id: model.id, name: model.name }, false)
    })
    this._hb = hb
    this.on('add change', function(model) {
      hb.add({ id: model.id, name: model.name })
    }, this)
  },

  search: function(query, cb) {
    var self = this
    this._hb.search(query, function onSearchResults(results) {
      self.trigger('search', results)
      if (typeof cb === 'function') cb(results)
    })
  }
})
