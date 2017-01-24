/* global d3 */

export var axes = {
  x: {
    name: 'x',
    path: 'scores.score1',
    round: false,
  },
  y: {
    name: 'y',
    path: 'scores.score2',
    round: true,
  }
}

export var layout = {
  get inner() {
    return {
      container: d3.select('g.inner-container'),
      width: 100,
      height: 100,
    }
  },
  margin: { left: 10, bottom: 10 },
  padded: { height: 110, width: 110 },
  padding: 10,
  target: document.querySelector('body')
}

export var config = {
  axes: axes,
  layout: layout,
  selected: new Set(),
  scale: {
    x: d3.scale.linear().range([0, 100]).domain([0, 100]),
    y: d3.scale.linear().range([0, 100]).domain([0, 100]),
  }
}

export var options = {
  axes: axes,
  layout: {
    height: 800,
    width: 1280,
    margin:{ top: 40, right: 80, bottom: 60, left: 60 },
    target: document.querySelector('body')
  },
  tools: {
    force: true
  }
}

export function makeMockData(N) {
  let data = []
  for (let i = 0; i < N; i++) {
    data.push({
      scores: {
        score1: Math.round(i * 0.1 * 100) / 100,
        score2: Math.round(i * 0.1 * 100) / 100,
      }
    })
  }
  return data
}

export function mockSvg() {
  return d3.select('body').append('svg')
    .attr('width', 100)
    .attr('height', 100)
}

export function mockInner(node) {
  return node.append('g')
    .attr('class', 'inner-container')
}

export function mockDots(data) {
  d3.select('.inner-container')
    .selectAll('dot')
    .data(data)
    .enter().append('g')
    .attr('class', 'dot')
}
