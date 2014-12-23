'use strict';
var View = require('ampersand-view')
var Hammer = require('hammerjs')
var applyTransform = require('transform-style');
var raf = require('raf-component')

var template = require('../templates/map.jade')

module.exports = View.extend({
  template: template,

  events: {

  },

  initialize: function(opts) {
    this.x = 0
    this.y = 0
    this.pos = {}
    this.scale = 1
    this.ticking = false
    this.oldX = 0
    this.oldY = 0
    this.center = {}

    this.listenTo(this.model, 'change:showLayers', this.toggleLayers)
  },

  toggleLayers: function() {
    this.toggleTouch()
    var value = [
      'translate3d(0, 0, 0)', 'scale(1)'
    ]
    applyTransform(this.img, value.join(' '))
    this.el.classList.toggle('layered')
  },

  toggleTouch: function() {
    if (this.model.showLayers) return this.mc.destroy()

    this.img = this.el
    this.mc = new Hammer.Manager(this.img)

    this.mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }))
    this.mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([this.mc.get('pan')])
    // this.touch.get('pan').set({ direction: Hammer.DIRECTION_ALL })
    this.mc.on('panstart panmove panend', this.onPan.bind(this))
    this.mc.on('pinchstart pinchmove pinchend', this.onPinch.bind(this))
  },

  onPan: function(event) {
    if (event.type === 'panstart') {
      this.img.classList.remove('animate')
      this.oldX = this.x
      this.oldY = this.y
      // var containerRect = this.query('.map').getBoundingClientRect()
      // var elRect = event.target.getBoundingClientRect()
      // this.pos = {
      //   left: elRect.left - containerRect.left,
      //   top: elRect.top - containerRect.top
      // }
    }

    this.x = this.oldX + event.deltaX
    this.y = this.oldY + event.deltaY

    if (event.type === 'panend') {
      this.img.classList.add('animate')
      var targetX = -1 * event.velocityX * 325;
      var targetY = -1 * event.velocityY * 325;
      this.x += targetX / 2
      this.y += targetY / 2
    }
    this.requestElementUpdate()
  },

  onPinch: function(event) {
    if (event.type === 'pinchstart') {
      console.log(event.center.x, event.center.y)
      this.img.classList.remove('animate')
      this.initScale = this.scale || 1
    }

    // this.img.style.webkitTransformOrigin = [
    //   ((event.center.x * this.scale) + this.x) + 'px',
    //   ((event.center.y * this.scale) + this.y) + 'px'
    // ].join(' ')
    var scale = this.initScale * event.scale
    // if (event.type === 'pinchend')
    if (event.type === 'pinchend' && scale < 1) {
      this.img.classList.add('animate')
      this.scale = 1
      this.x = 0
      this.y = 0
      this.requestElementUpdate()
      return
    }

    if (scale > 3) return

    this.scale = scale
    // this.center = event.center
    this.requestElementUpdate()
  },

  requestElementUpdate: function() {
    if (!this.ticking) {
      var self = this
      raf(function() { self.updateElementTransform() })
      this.ticking = true
    }
  },

  updateElementTransform: function() {
    var value = [
      'translate3d(' + this.x + 'px, ' + this.y + 'px, 0)',
      'scale(' + this.scale + ', ' + this.scale + ')'
    ]

    applyTransform(this.img, value.join(' '))
    this.ticking = false
  },

  render: function() {
    this.renderWithTemplate()
    this.toggleTouch()
    return this
  }
})
