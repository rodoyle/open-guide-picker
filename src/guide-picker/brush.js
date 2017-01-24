import d3 from 'd3'

/** Class representing the brush component */
class Brush {
  /**
   * Create a brush.
   * @param {Object} config - The config object
   */
  constructor(config) {
    this.config = config
    this.brush = d3.svg.brush()
      .x(this.config.scale.x)
      .y(this.config.scale.y)
      .on('brushstart', this.brushstart.bind(this))
      .on('brush', this.brushmove.bind(this))
      .on('brushend', this.brushend.bind(this))
  }

  get innerContainer() {
    return this.config.layout.inner.container
  }

  /**
   * On brush start if shift key is not pressed clear the selected guides
   */
  brushstart() {
    if (!d3.event.sourceEvent.shiftKey) { this.config.selected.clear() }
  }

  /**
   * On brush move round the extent and call back the brush with rounded values.
   * Select dots that fall within the rounded extent. Dispatch the select event.
   */
  brushmove() {
    var extent = d3.event.target.extent()
    var extent0 = this.config.axes.x.round ?
      this.config.roundExtent(extent[0]) : extent[0]
    var extent1 = this.config.axes.y.round ?
      this.config.roundExtent(extent[1]) : extent[1]
    this.innerContainer.select('.brush')
      .call(this.brush.extent([extent0, extent1]))
    this.innerContainer.selectAll('.dot')
      .each(d => this.select(d, extent0, extent1))
    this.config.styleSelected()
    this.config.dispatchSelectEvent()
  }

  /** On brush end remove the brush */
  brushend() {
    d3.event.target.clear()
    this.innerContainer.select('.brush')
      .call(d3.event.target)
  }

  /**
   * Draw a brush component
   * @method
   */
  draw() {
    var brushg = this.innerContainer.append('g')
      .attr('class', 'brush')
      .call(this.brush)

    brushg.select('.extent')
      .attr('fill', 'transparent')
      .attr('stroke', 'black')
      .attr('stroke-dasharray', [5, 10])
  }

  /**
   * Get y and x values from the brush extent to pass to the inExtent function.
   * The brush extent stores two arrays each of which contains x and y
   * coordinate of a rectangle area defining the extent of the brush.
   */
  select(d, extent0, extent1) {
    var extentX = [extent0[0], extent1[0]]
    var extentY = [extent0[1], extent1[1]]
    var inExtent = this.config.guideInExtent(d, extentX, extentY)
    this.config.updateSelected(d, inExtent)
  }
}

export default Brush
