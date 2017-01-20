/* global d3, afterEach, beforeEach, describe, expect, it */

import Config from '../../src/guide-picker/config'
import {
  axes,
  layout,
  makeMockData,
  mockDots,
  mockInner,
  mockSvg
} from './mocks'

describe('Config class', function () {
  var N = 10
  var mockData = makeMockData(N)
  mockData.forEach(d => {
    d.origin = d.scores.score1
    return d
  })
  var config = new Config(layout, axes)

  beforeEach(function() {
    mockInner(mockSvg())
    mockDots(mockData)
  })

  afterEach(function() {
    d3.selectAll('svg').remove()
    config.selected.clear()
  })

  it('should be defined', function () {
    expect(config).toBeDefined()
  })

  it('inExtent method should work', function () {
    var expectedValue
    expect(config.inExtent).toBeDefined()
    expectedValue = config.inExtent(0, [1, 2])
    expect(expectedValue).toBeFalsy()
    expectedValue = config.inExtent(1, [1, 2])
    expect(expectedValue).toBeTruthy()
    expectedValue = config.inExtent(2, [1, 2])
    expect(expectedValue).toBeTruthy()
    expectedValue = config.inExtent(3, [1, 2])
    expect(expectedValue).toBeFalsy()
  })

  it('roundExtent method should work', function () {
    expect(config.roundExtent).toBeDefined()
    var expectedExtent = config.roundExtent([0.1, 0.9])
    expect(expectedExtent[0]).toBe(0)
    expect(expectedExtent[1]).toBe(1)
  })

  it('dispatchFilterEvent method should work', function () {
    expect(config.dispatchFilterEvent).toBeDefined()
    document.querySelector('body')
      .addEventListener('filter', e => {
        var expectedExtent = e.detail
        expect(expectedExtent).toEqual(config.extent)
      })
    config.dispatchFilterEvent()
  })

  it('styleSelected method should work', function () {
    expect(config.styleSelected).toBeDefined()
    config.selected.add(mockData[0].origin)
    config.styleSelected()
    expect(d3.select('.dot.selected')[0].length).toBe(1)
    expect(d3.select('.dot.selected').datum()).toEqual(mockData[0])
  })

  it('formatValue method should work', function () {
    expect(config.formatValue).toBeDefined()
    var expectedValue
    // unrounded
    expectedValue = config.formatValue(mockData[1], 'x')
    expect(expectedValue).toBe(0.1)
    // null unrounded
    mockData[2].scores.score1 = null
    expectedValue = config.formatValue(mockData[2], 'x')
    expect(expectedValue).toBe(-0.01)
    // rounded
    expectedValue = config.formatValue(mockData[1], 'y')
    expect(expectedValue).toBe(10)
    // null rounded
    mockData[2].scores.score2 = null
    expectedValue = config.formatValue(mockData[2], 'y')
    expect(expectedValue).toBe(-1)
  })

  it('truncateText method should work', function () {
    expect(config.truncateText).toBeDefined()
    var expectedValue = config.truncateText('1234567890')
    expect(expectedValue).toBe('123456...')
  })
})
