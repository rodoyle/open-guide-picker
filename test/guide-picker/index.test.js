/* global d3, afterAll, beforeAll, describe, expect, it */

import GuidePicker from '../../src/guide-picker/index'
import { makeMockData, options } from './mocks'

describe('GuidePicker class', function () {
  var guidePicker
  var N = 10
  var mockData = makeMockData(N)

  beforeAll(function() {
    guidePicker = new GuidePicker(options)
  })

  afterAll(function() {
    d3.selectAll('svg').remove()
  })

  it('should be defined', function () {
    expect(guidePicker).toBeDefined()
  })

  it('draw method should work', function () {
    expect(guidePicker.draw).toBeDefined()
    guidePicker.draw(mockData)
    expect(d3.select('.x.axis')[0].length).toBe(1)
    expect(d3.select('.y.axis')[0].length).toBe(1)
    expect(d3.select('.x.slider')[0].length).toBe(1)
    expect(d3.select('.y.slider')[0].length).toBe(1)
    expect(d3.select('.dots').attr('width')).toBe('1140')
    expect(d3.select('.dots').attr('height')).toBe('700')
    expect(d3.selectAll('.dot')[0].length).toBe(N)
  })

  it('getClone method should work', function () {
    expect(guidePicker.getClone).toBeDefined()
    var clone = guidePicker.getClone(mockData[0])
    expect(clone.origin).toEqual(mockData[0])
  })

  it('layoutData method should work', function () {
    expect(guidePicker.layoutData).toBeDefined()
    var layoutData = guidePicker.layoutData(mockData)
    layoutData.forEach(d => {
      expect(d.origin).toBeDefined()
      expect(d.x).toBeDefined()
      expect(d.y).toBeDefined()
      expect(d.ox).toBeDefined()
      expect(d.oy).toBeDefined()
      expect(d.radius).toBeDefined()
    })
  })
})
