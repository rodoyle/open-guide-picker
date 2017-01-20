import d3 from 'd3'
import _get from 'lodash/get'
import Layout from './layout'

/** Class representing the app configuration */
class Config {
  /** * Create a config
   * @param {Object} axes - The axes options object
   */
  constructor(layout, axes) {
    this.layout = new Layout(layout)
    this.axes = axes
    this.domain = {
      x: this.getExtent('x'),
      y: this.getExtent('y')
    }
    this.range = {
      x: [0, this.layout.inner.width],
      y: [this.layout.inner.height, 0]
    }
    this.scale = {
      x: d3.scale.linear().domain(this.domain.x).range(this.range.x),
      y: d3.scale.linear().domain(this.domain.y).range(this.range.y),
    }
    this.extent = this.domain
    this.selected = new Set()
  }

  /** Check if shift key is pressed */
  get shiftKey() {
    if (!d3.event.sourceEvent) {
      return d3.event.shiftKey
    }
    if (d3.event.sourceEvent) {
      return d3.event.sourceEvent.shiftKey
    }
  }

  /**
   * Let the wider world now that x and y slider extents changed.
   * @method
   */
  dispatchFilterEvent() {
    var customEvent = new CustomEvent('filter', {detail: this.extent})
    this.layout.target.dispatchEvent(customEvent)
  }

  /**
   * Let the wider world know which guides were selected.
   * @method
   */
  dispatchSelectEvent() {
    var customEvent = new CustomEvent('select', {detail: this.selected})
    this.layout.target.dispatchEvent(customEvent)
  }

  /**
   * All selected guides need to be stylish. Especially the ones that come in
   * from the outside world.
   * @method
   */
  styleSelected() {
    this.layout.inner.container.selectAll('.dot')
      .classed('selected', d => this.selected.has(d.origin))
  }

  updateSelected(d, inExtent) {
    if (inExtent || (this.selected.has(d.origin) && this.shiftKey)) {
      this.selected.add(d.origin)
    } else {
      this.selected.delete(d.origin)
    }
  }

  /** Check if a guide falls within the extent
   * @method
   * @param {Object} d - The guide object
   * @param {Array} extentX - The min and max value
   * @param {Array} extentY - The min and max value
   * @return {Boolean}
   */
  guideInExtent(d, extentX, extentY) {
    var x = this.formatValue(d, 'x')
    var y = this.formatValue(d, 'y')
    return this.inExtent(x, extentX) &&
           this.inExtent(y, extentY)
  }

  /** Check if a value falls within an extent
   * @method
   * @param {Object} value - The value to be evaluated
   * @param {Array} extent - The min and max value
   * @return {Boolean}
   */
  inExtent(value, extent) {
    return extent[0] <= value && value <= extent[1]
  }

  /** Round extent values to nearest integer
   * @method
   * @param {Array} extent - The min and max values as floating points
   * @return {Array} - The rounded extent
   */
  roundExtent (extent) {
    var roundExtent = [Math.round(extent[0]), Math.round(extent[1])]
    if (roundExtent[0] >= roundExtent[1]) {
      roundExtent[0] = Math.floor(extent[0])
      roundExtent[1] = Math.ceil(extent[1])
    }
    return roundExtent
  }

  getExtent(axis) {
    let extent = [0, 1]
    if (this.axes[axis].round) {
      extent[1] = 100
    }
    return extent
  }

  /**
   * Get the plottable value from the guide object and round it if needed.
   * @method
   * @param {object} d - The guide data object
   * @param {string} axis - The key string to access the right axis property
   * @return {integer} - The formatted value
   */
  formatValue(d, axis) {
    let value = _get(d, this.axes[axis].path)
    if (this.axes[axis].round) {
      return value == null ? -1 : Math.round(value * 100)
    }
    return value == null ? -0.01 : value
  }

  /**
   * Truncate very long float point values.
   * @method
   * @param {string} text - float as a string
   * @return {string} - The truncated float
   */
  truncateText(text) {
    let limit = 6
    if (text.length > limit) {
      return text.substring(0, limit) + '...'
    }
    return text
  }

  unscored(d) {
    var x = this.formatValue(d, 'x')
    var y = this.formatValue(d, 'y')
    if (x < 0 || y < 0) {
      return true
    }
    return false
  }
}

export default Config
