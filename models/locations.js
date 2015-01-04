'use strict';

var Hummingbird = require('hummingbird')
var Collection = require('ampersand-collection')
var Model = require('ampersand-state')

module.exports = Collection.extend({
  model: Model.extend({
    extraProperties: 'allow'
  }),

  initialize: function(models, opts) {
    this._hb = new Hummingbird.Index()
    models = models || []
    models.forEach(this._addIndex, this)
    this.on('add change', this._addIndex, this)
  },

  _addIndex: function(model) {
    this._hb.add({ id: model.id, name: model.name })
  },

  search: function(query, cb) {
    var self = this
    this._hb.search(query, function onSearchResults(results) {
      self.trigger('search', results)
      if (typeof cb === 'function') cb(results)
    })
  }
})
