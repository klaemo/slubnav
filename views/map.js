'use strict';
var View = require('ampersand-view')
var Hammer = require('hammerjs')
var applyTransform = require('transform-style');
var raf = require('raf-component')
var domify = require('domify')

var template = require('../templates/map.jade')
var pinTemplate = require('../templates/pinTemplate.jade')

module.exports = View.extend({
  template: template,

  events: {
    'click .map': 'onLayerClick'
  },

  subviews: {

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
    this.listenTo(this.model, 'change:floor', this.switchFloors)
  },

  onLayerClick: function(event) {
    // reagiere nur in der Ebenenübersicht auf Events
    if (!this.model.showLayers) return
    var map = event.target
    this.model.set('floor', parseInt(map.dataset.floor), { silent: true })
    this.query('.map.active').classList.remove('active')
    // var self = this
    // map.addEventListener('transitionend', function() {
    //   self.queryAll('.map').forEach(function(el) {
    //     if (el !== map) el.style.display = 'none'
    //   })
    //   map.removeEventListener('transitionend')
    // })
    map.classList.add('active')
    this.switchFloors()
  },

  switchFloors: function(model, floor) {
    this.model.showLayers = false
  },

  toggleLayers: function() {
    this.toggleTouch()
    var value = [
      'translate3d(0, 0, 0)', 'scale(1)'
    ]
    applyTransform(this.el, value.join(' '))
    this.el.classList.toggle('layered')
  },

  toggleTouch: function() {
    if (this.model.showLayers) return this.mc.destroy()

    this.mc = new Hammer.Manager(this.el)

    this.mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }))
    this.mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([this.mc.get('pan')])
    this.mc.add(new Hammer.Press())

    this.mc.on('panstart panmove panend', this.onPan.bind(this))
    this.mc.on('pinchstart pinchmove pinchend', this.onPinch.bind(this))
    this.mc.on('press pressup', this.onPress.bind(this))
  },

  onPress: function(event) {
    if (event.type === 'press') {
      this.addPinToMap(((event.center.x - this.x + (this.el.offsetWidth / 2 * (this.scale - 1))) * (1 / this.scale) - 25), ((event.center.y - this.y + (this.el.offsetHeight / 2 * (this.scale - 1))) * (1 / this.scale) - 25))
    }
  },

  onPan: function(event) {
    if (event.type === 'panstart') {
      this.el.classList.remove('animate')
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
      this.el.classList.add('animate')
      var targetX = -1 * event.velocityX * 325
      var targetY = -1 * event.velocityY * 325
      this.x += targetX / 2
      this.y += targetY / 2
    }
    this.requestElementUpdate()
  },

  onPinch: function(event) {
    if (event.type === 'pinchstart') {
      console.log(event.center.x, event.center.y)
      this.el.classList.remove('animate')
      this.initScale = this.scale || 1
    }

    // this.el.style.webkitTransformOrigin = [
    //   ((event.center.x * this.scale) + this.x) + 'px',
    //   ((event.center.y * this.scale) + this.y) + 'px'
    // ].join(' ')
    var scale = this.initScale * event.scale

    // if (event.type === 'pinchend')
    if (event.type === 'pinchend' && scale < 1) {
      this.el.classList.add('animate')
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

    applyTransform(this.el, value.join(' '))

    var invalue = [
      'scale(' + 1 / this.scale + ', ' + 1 / this.scale + ')'
    ]

    var pins = document.getElementsByClassName('pin')
    for (var i = 0; i < pins.length; i++) {
      applyTransform(pins[i], invalue.join(' '))
    }

    this.ticking = false
  },

  render: function() {
    this.renderWithTemplate()
    this.toggleTouch()
    return this
  },

  addPinToMap: function(xPos, yPos) {
    var newPinBox = domify(pinTemplate())
    var drawArea = this.query('.draw-area')

    if (drawArea.children.length === 0) {
      newPinBox.children[0].classList.add('ion-ios-circle-filled')
    } else if (drawArea.children.length === 1) {
      newPinBox.children[0].classList.add('ion-ios-location')
    }

    if (drawArea.children.length < 2) {
      // Add new pin to draw-area
      drawArea.appendChild(newPinBox)

      newPinBox.style.top =  yPos + 'px'
      newPinBox.style.left =  xPos + 'px'

      var invalue = [
        'scale(' + 1 / this.scale + ', ' + 1 / this.scale + ')'
      ]
      applyTransform(newPinBox, invalue.join(' '))
    } else {
      //If already 2 pins exist -> delete all
      this.removeAllPins()
    }
  },

  removeAllPins: function() {
    var pins = this.queryAll('.pin')
    pins.forEach(function(pin) {
      pin.parentNode.removeChild(pin)
    })
  }
})
