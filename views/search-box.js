'use strict';
var debounce = require('amp-debounce')
var View = require('ampersand-view')
var app = require('../app')
var template = require('../templates/search-box.jade')
var resultsTmpl = require('../templates/search-results.jade')

var ESC_KEY = 27

module.exports = View.extend({
  template: template,

  events: {
    'keyup input': 'search'
  },

  initialize: function() {
    this.listenTo(app.locations, 'search', this.showResults)
  },

  search: debounce(function(event) {
    var q = event.target.value
    if (event.which === ESC_KEY) {
      event.target.value = ''
      this.showResults()
      return
    }
    if (!q || q.length < 3) return
    app.locations.search(q.trim())
  }, 100),

  showResults: function(results) {
    if (!results || !results.length) {
      this.resultBox.innerHTML = ''
      return
    }
    this.resultBox.innerHTML = resultsTmpl({ results: results})
  },

  render: function() {
    this.renderWithTemplate()

    this.resultBox = this.query('.results-box')

    return this
  }
})
