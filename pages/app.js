'use strict';
var View = require('ampersand-view')
var State = require('ampersand-state')
var ViewSwitcher = require('ampersand-view-switcher')

var template = require('../templates/app.jade')

var SearchBox = require('../views/search-box')
var Buttons = require('../views/buttons')
var MapView = require('../views/map')

var Model = State.extend({
  props: {
    showLayers: { type: 'boolean', default: false },
    scannerVisible: { type: 'boolean', default: true }
  }
})

module.exports = View.extend({
  template: template,

  events: {
    'click a[href]': 'handleLinkClick'
  },

  initialize: function() {
    this.model = new Model()
    this.listenTo(global.APP.router, 'page', this.handleNewPage)
  },

  handleLinkClick: function(e) {
    var aTag = e.target
    var local = aTag.host === window.location.host

    // if it's a plain click (no modifier keys)
    // and it's a local url, navigate internally
    if (local && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
      e.preventDefault()
      global.APP.navigate(aTag.pathname)
    }
  },

  handleNewPage: function(view) {
    // tell the view switcher to render the new one
    this.pageSwitcher.set(view)

    // mark the correct nav item selected
    // this.updateActiveNav()
  },

  render: function() {
    // some additional stuff we want to add to the document head
    // document.head.appendChild(domify(templates.head()))
    document.title = 'SLUB Indoor Navigation'

    // main renderer
    this.renderWithTemplate()

    this.renderSubview(new MapView({ model: this.model }))
    this.renderSubview(new SearchBox())
    this.renderSubview(new Buttons({ model: this.model }))

    // init and configure our page switcher
    this.pageSwitcher = new ViewSwitcher(this.query('main'), {
      show: function(newView, oldView) {
        // it's inserted and rendered for me
        // document.title = _.result(newView, 'pageTitle') || "Cool App"
        document.scrollTop = 0

        // add a class specifying it's active
        newView.el.classList.add('active')

        // store an additional reference, just because
        global.APP.currentPage = newView
      }
    })

    return this
  }
})
