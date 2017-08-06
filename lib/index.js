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

  run(cb) {
    const args = [this.files, this.metalsmith]
    if (cb) args.push(cb)
    this.ware.run(...args)
  }
}

module.exports = Resolver
