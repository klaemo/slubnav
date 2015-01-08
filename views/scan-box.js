'use strict';
var View = require('ampersand-view')
var Popover = require('popover')

var app = require('../app')
var template = require('../templates/scan-box.jade')

module.exports = View.extend({
  template: template,

  events: {
    'submit form': 'onFormSubmit'
  },

  initialize: function(opts) {
    this.triggerEl = opts.triggerEl
  },

  onFormSubmit: function(event) {
    event.preventDefault()
    var code = this.query('input[name=code]').value
    var location = app.locations.get(code)

    if (location) {
      app.navigate('/code/' + code)
      // triggers .remove()
      app.state.scannerVisible = false
    } else {
      this.query('.info').textContent = 'Nicht gefunden.'
    }
  },

  remove: function() {
    View.prototype.remove.call(this)
    this.popover.remove()
  },

  render: function() {
    this.renderWithTemplate(this)

    this.popover = new Popover({
      className: 'scan-box-popover',
      position: 'top',
      button: this.triggerEl
    })

    this.popover
      .setContent(this.el)
      .render('open')

    return this
  }
})
