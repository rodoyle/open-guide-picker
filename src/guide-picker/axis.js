import d3 from 'd3'

/** Class representing the axes component */
class Axis {
  /**
   * Create x and y axes.
   * @param {Object} config - The config object
   */
  constructor(config) {
    this.config = config
    this.x = d3.svg.axis()
      .scale(this.config.scale.x)
      .orient('bottom')
      .tickValues(this.ticks(5))
    this.y = d3.svg.axis()
      .scale(this.config.scale.y)
      .orient('left')
      .tickValues(this.ticks(5))
  }

  get innerContainer() {
    return this.config.layout.inner.container
  }

  /**
   * Append a group to the inner container and call x and y axes respectively.
   * @method
   */
  draw() {
    var padding = this.config.layout.padding
    this.innerContainer
      .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' +
          this.config.layout.padded.height + ')')
        .style('font-size', '.7em')
        .call(this.x)
      .append('text')
        .attr('class', 'label')
        .attr('x', this.config.layout.inner.width / 2)
        .attr('y', this.config.layout.margin.bottom - (padding * 2))
        .attr('dy', '-.7em')
        .style('text-anchor', 'middle')
        .text(this.config.axes.x.name)
    this.innerContainer
      .append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + -padding + ',0)')
        .style('font-size', '.7em')
        .call(this.y)
      .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -this.config.layout.margin.left + (padding * 2))
        .attr('x', -this.config.layout.inner.height / 2)
        .attr('dy', '.7em')
        .style('text-anchor', 'middle')
        .text(this.config.axes.y.name)
  }

  clear() {
    this.innerContainer.selectAll('.axis').remove()
  }

  ticks(N) {
    var ticks = []
    var range = [0, 100]
    var step = Math.round(range[1] / (N - 1))
    var i = 0
    while (i < N) {
      if (i === N - 1) {
        ticks.push(range[1])
      } else {
        ticks.push(i * step)
      }
      i++
    }
    return ticks
  }
}

export default Axis
