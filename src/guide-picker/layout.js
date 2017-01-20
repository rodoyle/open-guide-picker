import d3 from 'd3'

/** Class representing containers and other layout rules */
class Layout {
  /**
   * Create layout.
   * @param {Object} layout - The options object
   *   @param {Int} width - The SVG width
   *   @param {Int} height - The SVG height
   *   @param {Object} margin - The marign object
   *   @param {Object} target - The DOM element SVG is attached to
   */
  constructor({width, height, margin, target}) {
    this.width = width
    this.height = height
    this.margin = margin
    this.target = target
    this.padding = 8 // padding to keep the layout neat and tidy
  }

  /** Get the target DOM element's svg node */
  get svg() {
    return d3.select(this.target.querySelector('svg'))
  }

  /** Get the inner container with its width and height */
  get inner() {
    return {
      container: d3.select(this.target.querySelector('svg g.inner-container')),
      height: this.height - this.margin.top  - this.margin.bottom,
      width:  this.width  - this.margin.left - this.margin.right
    }
  }

  /** Get the padded inner width and height */
  get padded() {
    return {
      width: this.inner.width + this.padding,
      height: this.inner.height + this.padding
    }
  }

  drawSvg(node) {
    node.append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
  }

  drawInner(node) {
    node.append('g')
      .attr('class', 'inner-container')
      .attr('transform', 'translate(' +
        this.margin.left + ',' + this.margin.top + ')'
      )
  }

  /** Draw the SVG and its inner container */
  draw() {
    this.drawSvg(d3.select(this.target))
    this.drawInner(this.svg)
  }
}

export default Layout
