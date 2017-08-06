"use strict";
const Ware = require("ware")

class Resolver {
  constructor(files, metalsmith) {
    /** @private */
    this.ware = new Ware()
    /** @private */
    this.files = files
    /** @private */
    this.metalsmith = metalsmith
  }

  /**
   * Add plugin to stack
   * @param {Plugin} plugin
   * @returns {Resolver}
   */
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

/** Description of plugin function
 @name Plugin
 @function
 @param {Object} files
 @param {Object} metalsmith instance
 @param {callback} [done] - Optional async callback
 */
