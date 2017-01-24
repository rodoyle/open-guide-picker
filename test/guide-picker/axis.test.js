/* global d3, afterEach, beforeEach, describe, expect, it */

import Axis from '../../src/guide-picker/axis'
import { mockSvg, mockInner, config } from './mocks'

describe('Axis class', function () {
  var axis = new Axis(config)

  beforeEach(function() {
    mockInner(mockSvg())
  })

  afterEach(function() {
    d3.selectAll('svg').remove()
  })

  it('should be defined', function () {
    expect(axis).toBeDefined()
  })

  it('draw method should work', function () {
    expect(axis.draw).toBeDefined()
    axis.draw()
    expect(d3.select('g.x.axis')[0].length).toBe(1)
    expect(d3.select('g.y.axis')[0].length).toBe(1)
    expect(d3.select('.x.axis .label').text()).toBe(config.axes.x.name)
    expect(d3.select('.y.axis .label').text()).toBe(config.axes.y.name)
    expect(d3.selectAll('.x.axis .tick')[0].length).toBe(5)
    expect(d3.selectAll('.y.axis .tick')[0].length).toBe(5)
  })

  it('ticks method should work', function () {
    expect(axis.ticks).toBeDefined()
    var expectedValue = axis.ticks(5)
    expect(expectedValue.length).toBe(5)
    expectedValue.forEach((d, i) => {
      expect(d).toBe(i * 25)
    })
  })
})
