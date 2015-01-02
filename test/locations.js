'use strict';

var test = require('tape')
var Locations = require('../models/locations')

var data = [
  { id: 1, name: 'Rechtswissenschaften' },
  { id: 2, name: 'Wirtschaftswissenschaften' }
]

test('locations: should have hummingbird index', function(t) {
  var locations = new Locations(data)
  t.equal(typeof locations._hb, 'object', 'should be object')
  t.end()
})

test('locations: should have hummingbird index', function(t) {
  var locations = new Locations(data)
  t.plan(2)

  locations.on('search', function(results) {
    t.equal(results.length, 1, 'should fire event')
  })
  locations.search('recht', function(results) {
    t.equal(results[0].id, 1, 'should accept callback')
  })
})

test('locations: should update hummingbird index', function(t) {
  var locations = new Locations(data)
  t.plan(2)

  locations._hb.on('add', function(doc) {
    t.pass('index updated')
    locations.search('inf', function(results) {
      t.equal(results[0].id, 3, 'should find Informatik')
    })
  })
  locations.add({ id: 3, name: 'Informatik' })
})
