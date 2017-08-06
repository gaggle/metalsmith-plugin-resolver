"use strict";
const Ware = require("ware")

class Resolver {
  constructor(files, metalsmith) {
    this.ware = new Ware()
    this.files = files
    this.metalsmith = metalsmith
  }

  use(plugin) {
    this.ware.use(plugin)
    return this
  }

  run() {
    this.ware.run(this.files, this.metalsmith)
  }
}

module.exports = Resolver
