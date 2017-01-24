/* global d3, afterAll, beforeAll, describe, expect, it */

import Force from '../../src/guide-picker/force'
import { config, makeMockData } from './mocks'

describe('Force class', function () {
  var N = 10
  var mockData = []
  var force = new Force(config)

  beforeAll(function() {
    mockData = makeMockData(N)
    mockData.forEach(d => {
      d.x = d.scores.score1
      d.y = d.scores.score2
      d.ox = d.scores.score1
      d.oy = d.scores.score2
      d.radius = 10
    })
    force.data = mockData
  })

  afterAll(function() {
    mockData = []
    d3.selectAll('svg').remove()
  })

  it('should be defined', function () {
    expect(force).toBeDefined()
  })

  it('move method should work', function () {
    expect(force.move).toBeDefined()
    mockData.forEach(force.move(1))
    mockData.forEach(d => {
      expect(d.x).toEqual(d.ox)
      expect(d.y).toEqual(d.ox)
    })
  })

  it('collide method should work', function () {
    expect(force.collide).toBeDefined()
    mockData.forEach(force.collide(1))
    mockData.forEach(d => {
      expect(d.x).not.toEqual(d.ox)
      expect(d.y).not.toEqual(d.ox)
    })
  })
})
