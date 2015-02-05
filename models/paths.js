'use strict';

var Collection = require('ampersand-collection')
var Model = require('ampersand-state')

module.exports = Collection.extend({
  model: Model.extend({
    extraProperties: 'allow'
  })
})
