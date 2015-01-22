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
    'focus input': 'onFocus',
    'keyup input': 'onKeyup',
    'click span[data-hook=clear]': 'clear',
    'click [data-hook=swap]': 'swap',
    'click .search-item a': 'onSearchItem'
  },

  props: {
    focused: ['string']
  },

  bindings: {
    'model.start.name': {
      type: 'value',
      selector: 'input[name="start"]'
    },

    'model.destination.name': {
      type: 'value',
      selector: 'input[name="destination"]'
    }
  },

  initialize: function() {
    this.model = app.state
    this.listenTo(app.locations, 'search', this.showResults)
    this.listenTo(app.state, 'change:destination change:start', this.toggleRouteView)
  },

  toggleRouteView: function(model) {
    this.el.classList.toggle('route-view', model.start || model.destination)
  },

  onFocus: function(event) {
    this.focused = event.target.name
  },

  onSearchItem: function(event) {
    event.preventDefault()
    var id = event.target.dataset.id
    var location = app.locations.get(id)
    if (location) {
      this.model.set(this.focused, location)
    }
  },

  onKeyup: throttle(function(event) {
    var query = event.target.value
    var name = event.target.name

    if (event.which === ESC_KEY || !query) {
      this.clear(name)
      return
    }
    // this.set(name, query)

    // search
    app.locations.search(query.trim())
  }, 75),

  clear: function(event) {
    var name = typeof event === 'string' ? event : event.target.dataset.input
    // this.unset(name)
    this.model.unset(name)
    this.showResults()
  },

  swap: function() {
    var start = this.model.start
    this.model.set('start', this.model.destination)
    this.model.set('destination', start)
  },

  showResults: function(res) {
    this.resultBox.innerHTML = (res && res.length) ? resultBox({ results: res }) : ''
  },

  render: function() {
    this.renderWithTemplate()

    this.cacheElements({
      resultBox: '.results-box'
    })

    return this
  }
})
