'use strict';
var throttle = require('lodash.throttle')
var View = require('ampersand-view')
var app = require('../app')
var template = require('../templates/search-box.jade')
var resultBox = require('../templates/search-results.jade')

var ESC_KEY = 27

module.exports = View.extend({
  template: template,

  events: {
    'keyup input': 'search'
  },

  initialize: function() {
    this.listenTo(app.locations, 'search', this.showResults)
  },

  search: throttle(function(event) {
    var query = event.target.value
    if (event.which === ESC_KEY || !query) {
      event.target.value = ''
      this.showResults()
      return
    }
    app.locations.search(query.trim())
  }, 75),

  showResults: function(res) {
    this.resultBox.innerHTML = (res && res.length) ? resultBox({ results: res }) : ''
  },

  render: function() {
    this.renderWithTemplate()

    this.resultBox = this.query('.results-box')

    return this
  }
})
