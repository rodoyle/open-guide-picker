/* global d3, afterEach, beforeEach, describe, expect, it */

import Brush from '../../src/guide-picker/brush'
import { config, makeMockData, mockDots } from './mocks'

describe('Brush class', function () {
  var mockData
  var brush = new Brush(config)

  beforeEach(function() {
    d3.event = {
      target: {extent: () => [[60, 60], [90, 90]]},
      sourceEvent: {shiftKey: false}
    }
    mockData = makeMockData()
    mockDots(mockData)
  })

  afterEach(function() {
    mockData = []
    d3.selectAll('svg').remove()
  })

  it('should be defined', function () {
    expect(brush).toBeDefined()
  })

  it('brushstart method should work', function () {
    expect(brush.brushstart).toBeDefined()
    /*
    brush.config.selected.add(mockData)
    brush.brushstart()
    expect(brush.config.selected.length).toBe(0)
    */
  })

  it('brushmove method should work', function () {
    expect(brush.brushmove).toBeDefined()
  })

  it('brushend method should work', function () {
    expect(brush.brushend).toBeDefined()
  })
})
