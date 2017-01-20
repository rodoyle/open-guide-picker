class Preprocessor {
  /** Enhance features with properties required by graphics components */
  prepFeatures(features) {
    Object.keys(features).forEach(key => {
      return features[key].map(feature => {
        feature.id = feature.id ? feature.id :
          feature.coordinates.start_end[0] * feature.coordinates.strand
        feature.selected = false
        feature.type = key
        feature.y = 0
        return feature
      })
    })
    return features
  }

  /** Turn sequence string into an array of objects */
  prepSequence(sequence, start) {
    var bases = sequence.split('')
    return bases.map((base, i) => {
      return {
        type: 'sequence',
        base: base,
        coordinates: {
          start_end: [start + i, start + (i + 1)],
        },
      }
    })
  }
}

export default Preprocessor
