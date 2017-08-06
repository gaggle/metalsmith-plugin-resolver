"use strict";
const equal = require("assert-dir-equal")
const Metalsmith = require("metalsmith")
const path = require("path")
const rimraf = require("rimraf")

const Resolver = require("../lib/index")

describe("plugin-resolver", function () {
  before(done => rimraf("test/fixtures/*/build", done))

  it("resolves sync plugin", function () {
    assertProcessingOf("test/fixtures/basic", [compositePlugin(renamePluginSync)])
  })

  it("resolves async plugin", function (done) {
    assertProcessingOf("test/fixtures/basic", [compositePlugin(renamePluginAsync)], done)
  })
})

const assertProcessingOf = function (dir, plugins = [], done = undefined) {
  const metalsmith = Metalsmith(dir)
  plugins.forEach(p => metalsmith.use(p))
  metalsmith.build(err => {
    if (err) {
      if (done) return done(err)
      throw new Error(err)
    }
    equal(path.join(dir, "expected"), path.join(dir, "build"))
    if (done) done()
  })
}

const compositePlugin = function (subplugin) {
  return function (files, metalsmith) {
    const resolver = new Resolver(...arguments)
    resolver
      .use(subplugin())
      .run()
  }
}

const renamePluginSync = function () {
  return function (files, metalsmith) {
    rename(files)
  }
}

const renamePluginAsync = function () {
  return function (files, metalsmith, done) {
    Promise.resolve()
      .then(() => rename(files))
      .then(() => done())
      .catch(err => done(err))
  }
}

const rename = function (files) {
  Object.keys(files).forEach(fn => {
    let newfn = path.join("moved", fn)
    files[newfn] = files[fn]
    delete files[fn]
  })
}
