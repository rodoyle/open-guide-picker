/* global d3, afterEach, describe, expect, it */

import Layout from '../../src/guide-picker/layout'
import {
  mockSvg,
  mockInner,
} from './mocks'

describe('Layout class', function () {
  var options = {
    width: 1280,
    height: 800,
    margin: {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30
    },
    target: document.querySelector('body')
  }
  var layout = new Layout(options)

  afterEach(function() {
    d3.selectAll('svg').remove()
  })

  it('should be defined', function () {
    expect(layout).toBeDefined()
  })

  it('inner methhod should work', function () {
    mockInner(mockSvg())
    expect(layout.inner).toBeDefined()
    expect(layout.inner).toEqual({
      width: 1220,
      height: 740,
      container: d3.select('g.inner-container')
    })
  })

  it('svg method should draw the svg layout', function () {
    expect(layout.drawSvg).toBeDefined()
    layout.drawSvg(d3.select('body'))
    expect(d3.select('svg').attr('width')).toBe(options.width.toString())
    expect(d3.select('svg').attr('height')).toBe(options.height.toString())
  })

  it('drawInner method should work', function () {
    expect(layout.drawInner).toBeDefined()
    layout.drawInner(mockSvg())
    expect(d3.select('g.inner-container').attr('transform'))
      .toEqual('translate(30,30)')
  })
})
