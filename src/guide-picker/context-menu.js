import d3 from 'd3'

class ContextMenu {
  constructor(options, config) {
    this.config = config
    this.options = options
    this.target = this.config.layout.target
  }

  get innerContainer() {
    return this.config.layout.inner.container
  }

  draw() {
    var options = []
    Object.keys(this.options).forEach(function(key) {
      if (key === 'force' && this.options[key]) {
        options.push({name: key + '-layout', label: 'Force layout'})
      }
    }.bind(this))
    var contextMenu = d3.select(this.target).append('ul')
      .attr('class', 'context-menu')
      .style({
        'background-color':'white',
        'border': '1px solid lightgrey',
        'box-shadow': '0px 2px 10px 2px rgba(0, 0, 0, .1)',
        'visibility': 'hidden',
        'font-family': 'Helvetica Neue, sans-serif',
        'font-size': '10px',
        'list-style-type': 'none',
        'position': 'absolute',
        'padding': '5px 20px',
      })
      .selectAll('li')
      .data(options)

    contextMenu
      .enter().call(appendOption)

    function appendOption(node) {
      node.append('li')
        .append('label')
          .text(d => d.label)
        .append('input')
          .attr('type', 'checkbox')
          .attr('id', d => d.name)
    }

    this.innerContainer
      .on('contextmenu', function () {
        d3.event.preventDefault()
        d3.selectAll('.context-menu').style('visibility', 'hidden')
        this.openContextMenu()
      }.bind(this))
  }

  openContextMenu() {
    var position = d3.mouse(this.innerContainer.node())
    var contextMenu = d3.select(this.target)
      .select('.context-menu')
    contextMenu
      .style({
        'position': 'absolute',
        'left': position[0] + 'px',
        'top': position[1] + 'px',
        'visibility': 'visible'
      })
    d3.select('body').on('click', function() {
      contextMenu.style('visibility', 'hidden')
    })
  }
}

export default ContextMenu
