'use strict';
var View = require('ampersand-view')
var Popover = require('popover')

var template = require('../templates/scan-box.jade')

module.exports = View.extend({
  template: template,

  events: {},

  initialize: function(opts) {
    this.triggerEl = opts.triggerEl
  },

  remove: function() {
    var self = this
    // this.popover.el.classList.add('fadeOut')
    View.prototype.remove.call(self)
    self.popover.remove()
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
