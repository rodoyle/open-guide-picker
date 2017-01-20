import d3 from 'd3'
import _random from 'lodash/random'

/** Class representing the dot component */
class Dot {
  /**
   * Create a rectangle (exon/coding region)
   * @param {object} config - The region selector config
   */
  constructor(axis, config) {
    this.axis = axis
    this.config = config
  }

  get innerContainer() {
    return this.config.layout.inner.container
  }

  clear() {
    this.innerContainer.select('.dots').remove()
  }

  /**
   * Draw a parent g element and append svg paths to it.
   * @method
   */
  draw(data) {
    var dots = this.innerContainer.append('g')
      .attr('class', 'dots')
      .attr('width',  this.config.layout.inner.width)
      .attr('height', this.config.layout.inner.height)
    var dot = dots.selectAll('.dot')
      .data(data)
    dot
      .attr('cx', d => d.ox)
      .attr('cy', d => d.oy)
      .attr('r', 0)
        .transition()
        .delay(() => _random(100, 1000))
        .duration(200)
        .attr('r', 4)
    dot
      .enter().append('circle')
      .attr('class', 'dot')
      .classed('selected', d => this.config.selected.has(d.origin))
      .classed('unscored', d => this.config.unscored(d))
      .attr('fill', d => this.config.unscored(d) ?
        'transparent' : 'rgba(0, 0, 0, 0.3)'
      )
      .attr('stroke', d => this.config.unscored(d) ?
        'rgba(0, 0, 0, 0.3)' : 'none'
      )
      .attr('cx', d => d.ox)
      .attr('cy', d => d.oy)
      .attr('r', 0)
        .transition()
        .delay(() => _random(100, 1000))
        .duration(200)
        .attr('r', 4)
    dot
      .on('mouseover', this.mouseover.bind(this))
      .on('mouseout', this.mouseout.bind(this))
      .on('click', this.click.bind(this))
    dot
      .exit()
      .remove()
  }

  /** On mouseover draw a line from x and y axes to the active dot */
  mouseover(d) {
    this.innerContainer.select('.dots').append('path')
      .attr('class', 'guide-line')
      .attr('d', 'M 0 ' + d.oy +
                 'H '   + d.ox +
                 'M '   + d.ox + ',' + this.config.scale.y(0) +
                 'V '   + d.oy
      )
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-dasharray', [5, 10])
    this.axis.x.tickValues([this.config.formatValue(d, 'x')])
    this.axis.y.tickValues([this.config.formatValue(d, 'y')])
    this.axis.draw()
  }

  /** On mouseout remove any previously drawn guide lines */
  mouseout() {
    this.innerContainer.selectAll('.guide-line').remove()
    this.axis.clear()
    this.axis.x.tickValues(this.axis.ticks(5))
    this.axis.y.tickValues(this.axis.ticks(5))
    this.axis.draw()
  }

  /**
   * On click, if the shift key is pressed, select multiple dots, otherwise
   * select a single dot and dispatch the select event
   */
  click(d) {
    if (this.config.shiftKey) {
      this.selectMultiple(d)
    } else {
      this.selectSingle(d)
    }
    this.config.dispatchSelectEvent()
  }

  /**
   * When selecting multiple dots, add or remove the class 'selected' from the
   * target dot based on its presence in the 'selected' set
   */
  selectMultiple(d) {
    d3.select(d3.event.target)
      .classed('selected', () => {
        if (this.config.selected.has(d.origin)) {
          this.config.selected.delete(d.origin)
          return false
        } else {
          this.config.selected.add(d.origin)
          return true
        }
      })
  }

  /**
   * When selecting a single dot clear all the other selected dots before
   * selecting a new one
   */
  selectSingle(d) {
    this.config.selected.clear()
    this.config.selected.add(d.origin)
    this.config.styleSelected()
  }
}

export default Dot
