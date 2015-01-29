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
    'click [data-hook=clear]': 'clear',
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
    this.listenTo(app.locations, 'search', this.toggleResults)
    this.listenTo(app.state, 'change:destination change:start', this.toggleRouteView)
    this.listenTo(app.state, 'change:showLayers', this.toggleResults)
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

    if (this.focused === 'start' && (this.model.start || this.model.destination)) {
      setTimeout(function() {
        this.destination.focus()
      }.bind(this), 250)
    }

    this.toggleResults()
  },

  onKeyup: throttle(function(event) {
    var query = event.target.value
    var name = event.target.name

    if (event.which === ESC_KEY || !query) {
      this.clear(name)
      return
    }

    // search
    app.locations.search(query.trim())
  }, 75),

  clear: function(event) {
    var name = typeof event === 'string' ? event : event.target.dataset.input

    this.model.unset(name)

    if (this.model.start || this.model.destination) {
      this[this.focused].focus()
    }
    this.toggleResults()
  },

  swap: function() {
    var start = this.model.start
    this.model.set('start', this.model.destination)
    this.model.set('destination', start)
  },

  toggleResults: function(res) {
    var show = res && res.length

    if (show) {
      this.resultBox.innerHTML = resultBox({ results: res })
    } else {
      setTimeout(function() {
        this.resultBox.innerHTML = ''
        this.resultBox.classList.remove('hide')
      }.bind(this), 250)
    }

    this.resultBox.classList.toggle('hide', !show)
    this.el.classList.toggle('result-view', show)
  },

  render: function() {
    this.renderWithTemplate()

    this.cacheElements({
      resultBox: '.results-box',
      start: 'input[name=start]',
      destination: 'input[name=destination]'
    })

    return this
  }
})
