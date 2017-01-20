import d3 from 'd3'

/** Class representing the y slider */
class Slider {
  /**
   * Create a slider
   * @param {Object} config - The config object
   */
  constructor(config, axis) {
    this.axis = axis
    this.config = config
    this.padding = this.config.layout.padding
    this.brush = d3.svg.brush()[this.axis](this.config.scale[this.axis])
      .extent(this.config.domain[this.axis])
      .on('brush', this.brushmove.bind(this))
      .on('brushend', this.brushend.bind(this))
  }

  get innerContainer() {
    return this.config.layout.inner.container
  }

  draw() {
    if (this.axis === 'x') {
      this.xSlider()
    }
    if (this.axis === 'y') {
      this.ySlider()
    }
  }

  xSlider() {
    var height = this.config.layout.padded.height
    var brushg = this.innerContainer.append('g')
      .attr('class', 'x slider')
      .attr('transform', 'translate(0,' + -this.padding + ')')
      .call(this.brush)
    brushg.select('.extent')
      .attr('height', 1)
    // Left handle
    brushg.select('.resize.w').append('rect')
      .attr('width',  this.padding)
      .attr('height', height)
      .attr('x', -this.padding)
      .attr('y', 0)
      .attr('fill', 'transparent')
    brushg.select('.resize.w').append('path')
      .attr('d', () => handlePath(height, -this.padding))
      .attr('stroke', 'black')
    brushg
      .select('.resize.w')
      .append('text')
      .attr('y', -12)
      .attr('text-anchor', 'end')
      .text(this.brush.extent()[0])
    // Right handle
    brushg.select('.resize.e').append('rect')
      .attr('width',  this.padding)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', 'transparent')
    brushg.select('.resize.e').append('path')
      .attr('d', () => handlePath(height, this.padding))
      .attr('stroke', 'black')
    brushg
      .select('.resize.e')
      .append('text')
      .attr('y', -12)
      .attr('text-anchor', 'start')
      .text(this.brush.extent()[1])

    function handlePath(height, padding) {
      var line = 'M 0 0 ' + 'V ' + height
      var handle = 'M 0 0 ' +
        'H ' + padding +
        'V ' + -Math.abs(padding) +
        'L 0 0'
      return line + handle
    }
  }

  ySlider() {
    var width = this.config.layout.padded.width
    var brushg = this.innerContainer.append('g')
      .attr('class', 'y slider')
      .attr('transform', 'translate(' + width + ',0)')
    .call(this.brush)
    brushg.select('.extent')
      .attr('width', 1)
    // Top handle
    brushg.select('.resize.n').append('rect')
      .attr('width',  width)
      .attr('height', this.padding)
      .attr('x', -width)
      .attr('y', -this.padding)
      .attr('fill', 'transparent')
    brushg.select('.resize.n').append('path')
      .attr('d', handlePath(width, -this.padding))
      .attr('stroke', 'black')
    brushg.select('.resize.n')
      .append('text')
      .attr('x', 12)
      .attr('text-anchor', 'start')
      .text(this.brush.extent()[1])
    // Bottom handle
    brushg.select('.resize.s').append('rect')
      .attr('width',  width)
      .attr('height', this.padding)
      .attr('x', -width)
      .attr('y', 0)
      .attr('fill', 'transparent')
    brushg.select('.resize.s').append('path')
      .attr('d', () => handlePath(width, this.padding))
      .attr('stroke', 'black')
    brushg.select('.resize.s')
      .append('text')
      .attr('x', 12)
      .attr('y', 11)
      .attr('text-anchor', 'start')
      .text(this.brush.extent()[0])

    function handlePath(width, padding) {
      var line = 'M 0 0' + 'H ' + -width
      var handle = 'M 0 0' +
        'V ' + padding +
        'H ' +  Math.abs(padding) +
        'L 0 0'
      return line + handle
    }
  }

  brushmove() {
    this.config.extent[this.axis] = this.config.axes[this.axis].round ?
      this.config.roundExtent(d3.event.target.extent()) :
      d3.event.target.extent()
    if (this.axis === 'x') {
      var extentX = this.config.extent.x
      this.innerContainer.select('.resize.w text')
        .text(this.config.truncateText(extentX[0].toString()))
      this.innerContainer.select('.resize.e text')
        .text(this.config.truncateText(extentX[1].toString()))
      this.innerContainer.select('.x.slider')
        .call(this.brush.extent(extentX))
    }
    if (this.axis === 'y') {
      var extentY = this.config.extent.y
      this.innerContainer.select('.resize.s text')
        .text(this.config.truncateText(extentY[0].toString()))
      this.innerContainer.select('.resize.n text')
        .text(this.config.truncateText(extentY[1].toString()))
      this.innerContainer.select('.y.slider')
        .call(this.brush.extent(extentY))
    }
    this.updateStyle()
    this.config.dispatchFilterEvent()
  }

  brushend() {
    this.innerContainer.selectAll('.resize')
      .style('display','inline')
  }

  updateStyle() {
    var extentX = this.config.extent.x
    var extentY = this.config.extent.y
    this.innerContainer.selectAll('.dot')
      .classed('filtered', d =>
        this.config.guideInExtent(d, extentX, extentY) ? false : true
      )
      .style('opacity', d => {
        if (this.config.unscored(d)) {
          return 1
        }
        return this.config.guideInExtent(d, extentX, extentY) ? 1 : 0.2
      })
  }
}

export default Slider
