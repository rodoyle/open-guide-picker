class Loader {
  constructor(domain, token) {
    this.token = token
    this.url = 'https://' + domain + '.deskgen.com/'
    this.xhr = new XMLHttpRequest()
  }

  /** Load data via CRUD API */
  makeRequest(apiPath, payload) {
    return new Promise ((resolve) => {
      this.xhr.open('POST', this.url + apiPath, true)
      this.xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
      this.xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
      this.xhr.onload = () => {
        if (this.xhr.status === 200) {
          resolve(JSON.parse(this.xhr.response))
        }
      }
      this.xhr.send(JSON.stringify(payload))
    })
  }

  /** Generate a CRUD payload */
  makeCrudPayload(object, options) {
    return {
      object: object.type,
      read: {
        filter: { id: object.id },
        expand: [options.expand]
      },
    }
  }

  /** Generate a GenomeBrowser payload */
  makeGbPayload(options) {
    return {
      chromosome: { id: options.chromosome },
      genome: { id: options.genome },
      read: { expand: [['coordinates']] },
      region_type: options.regionType,
      sequence: options.sequence,
      target_region: {
        start: options.startEnd[0],
        end: options.startEnd[1]
      },
    }
  }

  /** Generate an RPC payload */
  makeRpcPayload(options) {
    var params = options.method === 'load_guides' ? {
      chromosome_id: options.chromosome,
      nuclease_dict: { name: options.nuclease },
      protospacer_length: 20,
      start_end: options.startEnd,
      strand: 1
    } : {
      genome: { version: options.genome },
      gene: { name: options.gene },
      nuclease_dict: { name: options.nuclease },
      scoring_function: {
        mitv1_db: {
          maxmismatch: 3,
          minscore: 0,
          offset: 0
        }
      }
    }

    return {
      id: 1,
      jsonrpc: '2.0',
      method: options.method,
      params: params
    }
  }
}

export default Loader
