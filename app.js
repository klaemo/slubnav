'use strict';

var app = {
  extend: function() {
    var source, prop
    for (var i = 0, length = arguments.length; i < length; i++) {
      source = arguments[i]
      for (prop in source) {
        app[prop] = source[prop]
      }
    }
    return app
  },
  reset: function() {
    // clear all events
    // this.off()
    // remove all but main two methods
    for (var item in this) {
      if (item !== 'extend' && item !== 'reset') {
        delete this[item]
      }
    }
    // remix events
    // Events.mixin(this)
  }
}

// export our singleton
module.exports = app
