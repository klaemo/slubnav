'use strict';
// Third party modules
var domready = require('domready')
var attachFastClick = require('fastclick')

// our application code
var app = require('./app')
var State = require('./models/app-state')
var Locations = require('./models/locations')
var Router = require('./router')
var AppView = require('./pages/app')

// globale app variable
app.extend({
  init: function() {
    var self = this

    this.router = new Router()
    this.state = new State()
    this.locations = new Locations([
      { id: 1, name: 'Rechtswissenschaften' },
      { id: 2, name: 'Wirtschaftswissenschaften' }
    ])

    // erst ausführen wenn die DOM bereit ist
    domready(function() {
      self.view = new AppView({ el: document.body })
      self.view.render()
      self.router.history.start({ pushState: true, root: '/' })

      attachFastClick(document.body)
    })
  },

  // This is how you navigate around the app.
  // this gets called by a global click handler that handles
  // all the <a> tags in the app.
  // it expects a url without a leading slash.
  // for example: "costello/settings".
  navigate: function(page) {
    var url = (page.charAt(0) === '/') ? page.slice(1) : page
    this.router.history.navigate(url, { trigger: true })
  }
})

window.slubnav = app

// ...und abfahrt!
app.init()
