import Axis from './axis'
import Brush from './brush'
import Config from './config'
import ContextMenu from './context-menu'
import Dot from './dot'
import Force from './force'
import Slider from './slider'

/** Class representing the Guide Picker component */
class GuidePicker {
  /**
   * Create a Guide Picker.
   * @param {Object} layout - The layout options
   * @param {Object} axes - The axes options
   * @param {Object} tools - The tools options
   */
  constructor({layout, axes, tools}) {
    this.target = layout.target
    this.config = new Config(layout, axes)
    this.axis = new Axis(this.config)
    this.brush = new Brush(this.config)
    this.contextMenu = new ContextMenu(tools, this.config)
    this.dot = new Dot(this.axis, this.config)
    this.force = new Force(this.config)
    this.xSlider = new Slider(this.config, 'x')
    this.ySlider = new Slider(this.config, 'y')
    this.clones = new WeakMap()
  }

  /**
   * Clone each guide in the data object and extend its properties.
   * This is needed for the force layout to work properly.
   * @method
   * @param {Array} - The array of guides
   */
  prepData(data) {
    return data.map(d => {
      d = this.makeClone(d)
      d.ox = this.config.scale.x(this.config.formatValue(d, 'x'))
      d.oy = this.config.scale.y(this.config.formatValue(d, 'y'))
      d.x = this.config.scale.x(this.config.formatValue(d, 'x'))
      d.y = this.config.scale.y(this.config.formatValue(d, 'y'))
      d.radius = 4
      return d
    })
  }

  makeClone(origin) {
    var clone = this.clones.get(origin)
    if (!clone) {
      clone = Object.assign({}, origin)
      clone.origin = origin
      this.clones.set(origin, clone)
    }
    return clone
  }

  /**
   * Draw Guide Picker components.
   * @method
   * @param {Array} - The array of guides
   */
  draw(data) {
    data = this.prepData(data)
    // The order in which components are drawn is important
    this.config.layout.draw(this.target)
    this.contextMenu.draw()
    this.brush.draw()
    this.axis.draw()
    this.dot.draw(data)
    this.xSlider.draw()
    this.ySlider.draw()
    this.force.draw(data)
  }

  /**
   * Remove Guide Picker and its components.
   * @method
   */
  clear() {
    this.config.layout.svg.remove()
  }
}

export default GuidePicker
