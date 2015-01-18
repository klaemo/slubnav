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
    'keyup input': 'search',
    'click [data-hook=clear]': 'clear'
  },

  initialize: function() {
    this.listenTo(app.locations, 'search', this.showResults)
  },

  search: throttle(function(event) {
    var query = event.target.value
    if (event.which === ESC_KEY || !query) {
      this.clear()
      return
    }
    app.locations.search(query.trim())
  }, 75),

  clear: function() {
    this.input.value = ''
    this.showResults()
  },

  showResults: function(res) {
    this.resultBox.innerHTML = (res && res.length) ? resultBox({ results: res }) : ''
  },

  render: function() {
    this.renderWithTemplate()

    this.cacheElements({
      resultBox: '.results-box',
      input: 'input[name=search]'
    })

    return this
  }
})
