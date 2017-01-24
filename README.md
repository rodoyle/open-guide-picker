<p align="center">
  <a href="https://www.deskgen.com">
    <img width="100" heigth="100" src="https://github.com/DeskGen/dgsource/blob/master/browser/landing/app/images/deskgen.png">
  </a>
</p>

<h1 align="center">Guide Picker</h1>
Guide Picker is an open source online tool available at [DeskGen platform](https://www.deskgen.com/guide-picker) allowing visualisation and rapid comparison of gRNAs in coding regions of the human (GRCh38.81) genome. This repository concerns the graphic component (scatterplots) used in the online tool. [Lear more about Guide Picker](https://www.deskgen.com/landing/resources/crispr-sgrna-design-guide-picker).

<h2 align="center">Install</h2>
``` bash
npm install guide-picker --save
```

<h2 align="center">Get Started</h2>
Guide Picker is written using ES6 modules and can be imported directly into your ES6 application.
``` javascript
import GuidePicker from 'guide-picker'
```
or using Node
``` javascript
var guidePicker = require('guide-picker')
```
Once loaded successfully, Guide Picker needs to be instantiate
``` javascript
var options = {
  layout: {
    target: document.querySelector('.guide-picker'),
    width: document.querySelector('.guide-picker').offsetWidth,
    height: window.innerHeight,
    margin: { top: 40, right: 80, bottom: 60, left: 60 }
  },
  axes: {
    x: {
      name: 'Percent Peptide',
      path: 'scores.site.percent_peptide.value',
      round: true,
    },
    y: {
      name: 'Representation',
      path: 'scores.site.representation.value',
      round: true,
    }
  },
  tools: {
    force: true
  }
}

var guidePicker = new guidePicker.GuidePicker(options)
```
And the `draw` method called
``` javascript
guidePicker.draw(data)
```
The DeskGen RPC API can be used to query any gene in the Human (GRCh38.81) genome. Alternatively, you can use your own data, as Guide Picker is fairly data model agnostic. As along as `data` is an array of objects, you will only need to supply a path to x and y coordinates in `options.axes.x.path` and `options.axes.y.path` (see the `options` object above).

Guide Picker emits two kinds of events: 'filter' and 'select'. You can use these events to integrated it into your own application or make multiple Guide Pickers work together
``` javascript
document.querySelector('#guide-picker-1').addEventListener('select', e => {
  guidePicker2.config.selected = new Set(e.detail);
  guidePicker2.config.styleSelected();
})

document.querySelector('#guide-picker-2').addEventListener('select', e => {
  guidePicker1.config.selected = new Set(e.detail);
  guidePicker1.config.styleSelected();
})
```

<h2 align="center">Example</h2>

For a working example, clone the repository and run
``` bash
npm install
npm run build
npm run build-test
```
In your browser, navigate to either `file:///Users/.../open-guide-picker/test/guide-picker/guide-picker.html` or `file:///Users/.../open-guide-picker/test/guide-picker/multi-picker.html`.
