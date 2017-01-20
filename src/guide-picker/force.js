import d3 from 'd3'

class Force {
  constructor(config) {
    this.config = config
    this.data = []
    this.force = d3.layout.force()
      .size([
        this.config.layout.inner.width,
        this.config.layout.inner.height
      ])
      .charge(-1)
      .chargeDistance(1)
      .gravity(0)
      .on('tick', this.tick.bind(this))
    this.target = this.config.layout.target
  }

  tick(e) {
    var checkbox = d3.select(this.target)
      .select('#force-layout').node().checked
    var dots = this.config.layout.inner.container.selectAll('.dot')
    dots.each(this.move(e.alpha))
    if (checkbox) {
      dots.each(this.collide(e.alpha))
    }
    dots
      .attr('cx', d => this.config.axes.x.round ? Math.round(d.x) : d.x)
      .attr('cy', d => this.config.axes.y.round ? Math.round(d.y) : d.y)
  }

  /** Move dots toward their original position */
  move(alpha) {
    return function(d) {
      d.x += (d.ox - d.x) * 0.1 * alpha
      d.y += (d.oy - d.y) * 0.1 * alpha
    }
  }

  /** Resolve collisions between nodes */
  collide(alpha) {
    var padding = 1
    var quadtree = d3.geom.quadtree(this.data)
    return function(d) {
      var r = d.radius + d.radius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius * padding
          if (l < r) {
            l = (l - r) / l * alpha
            d.x -= x *= l
            d.y -= y *= l
            quad.point.x += x
            quad.point.y += y
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1
      })
    }
  }

  draw(data) {
    this.data = data
    this.force.nodes(data)
    var forceStart = false
    d3.select(this.target).select('#force-layout')
      .on('change', () => {
        if (!forceStart) {
          this.force.start()
          forceStart = true
        } else {
          this.force.resume()
        }
      })
  }
}

export default Force
