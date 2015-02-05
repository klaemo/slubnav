'use strict';
var View = require('ampersand-view')
var Hammer = require('hammerjs')
var applyTransform = require('transform-style');
var raf = require('raf-component')
var domify = require('domify')
var app = require('../app')

var fs = require('fs')
var map = fs.readFileSync('public/img/ebene-0.svg', 'utf-8')

var template = require('../templates/map.jade')
var pinTemplate = require('../templates/pinTemplate.jade')

module.exports = View.extend({
  template: template,

  events: {
    'click svg.map': 'onLayerClick'
    // 'click svg path': 'onLocationClick'
  },

  // http://ampersandjs.com/docs#ampersand-state-props
  props: {
    x: ['number', true, 0],
    y: ['number', true, -100],
    maxX: ['number', true, 0],
    maxY: ['number', true, 0],
    minX: ['number', true, 0],
    minY: ['number', true, 0],
    pos: ['object', true],
    scale: ['number', true, 1],
    minScale: ['number', true, 1],
    ticking: ['boolean', true, false],
    oldX: ['number', true, 0],
    oldY: ['number', true, 0],
    center: ['object', true],
    panning: ['boolean', true, false]
  },

  initialize: function(opts) {
    this.listenTo(this.model, 'change:showLayers', this.toggleLayers)
    this.listenTo(this.model, 'change:floor', this.switchFloors)
    this.listenTo(app.state, 'change:start change:destination', this.toggleRoute)
  },

  onLocationClick: function(event) {
    if (this.panning) return false
    event.target.style.fill = '#cc0000'
    if (!app.state.start) {
      app.state.start = app.locations.get(1)
    } else {
      app.state.destination = app.locations.get(2)
    }
  },

  toggleRoute: function() {
    var active = this.activeMap.querySelector('.active')
    if (active) active.classList.remove('active')
    var path = app.paths.get(app.state.getPathId())
    if (!path) return
    var el = this.activeMap.querySelector(path.selector)
    if (el) el.classList.add('active')
  },

  onLayerClick: function(event) {
    // reagiere nur in der Ebenenübersicht auf Events
    if (!this.model.showLayers) return
    var map = event.target
    this.model.set('floor', parseInt(map.dataset.floor), { silent: true })
    this.query('.map.active').classList.remove('active')

    map.classList.add('active')
    this.switchFloors()
  },

  switchFloors: function(model, floor) {
    this.model.showLayers = false
  },

  toggleLayers: function() {
    this.toggleTouch()
    var value = ['translate3d(0, 0, 0)', 'scale(' + this.scale + ')']
    if (app.state.showLayers) {
      applyTransform(this.activeMap, '')
    } else {
      applyTransform(this.activeMap, value.join(' '))
    }
    this.el.classList.toggle('layered')
  },

  toggleTouch: function() {
    if (this.model.showLayers) return this.mc.destroy()

    this.mc = new Hammer.Manager(this.activeMap)

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
      this.panning = true
      this.activeMap.classList.remove('animate')
      this.oldX = this.x
      this.oldY = this.y
    }

    var dX = this.oldX + event.deltaX
    var dY = this.oldY + event.deltaY

    // if (dX >= this.maxX || dX <= this.minX || dY >= this.maxY || dY <= this.minY) {
    //   return
    // }
    this.x = dX
    this.y = dY

    if (event.type === 'panend') {
      this.activeMap.classList.add('animate')
      var targetX = -1 * event.velocityX * 325
      var targetY = -1 * event.velocityY * 325
      this.x += targetX / 2
      this.y += targetY / 2
      this.panning = false
    }
    this.requestElementUpdate()
  },

  onPinch: function(event) {
    if (event.type === 'pinchstart') {
      this.activeMap.classList.remove('animate')
      this.initScale = this.scale || 1
    }

    var scale = this.initScale * event.scale

    // if (event.type === 'pinchend')
    if (event.type === 'pinchend' && scale < this.minScale) {
      this.activeMap.classList.add('animate')
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

    applyTransform(this.activeMap, value.join(' '))

    this.ticking = false
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
  },

  addMaps: function() {
    for (var i = -2; i <= 0; i++) {
      var dommap = domify(map)
      dommap.classList.add('map', 'floor-' + i)
      dommap.dataset.floor = i
      if (i === 0) {
        dommap.classList.add('active')
        applyTransform(dommap, 'scale(' + this.scale + ')')
      }
      this.el.appendChild(dommap)
    }

    this.activeMap = this.query('.active')
  },

  render: function() {
    var windowWidth = window.innerWidth
    this.minScale = windowWidth / 1000
    this.scale = this.minScale + 0.2
    this.maxX = this.maxY = ((this.scale * 1000) - 1000) / 2
    this.minX = this.minY = (-1 * ((this.scale * 1000) - 1000)) / 2
    this.minY += this.y
    this.renderWithTemplate()

    this.addMaps()
    this.toggleTouch()

    return this
  }
})
