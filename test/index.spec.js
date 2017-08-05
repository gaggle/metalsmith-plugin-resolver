"use strict";
const assert = require("assert")
const equal = require("assert-dir-equal")
const Metalsmith = require("metalsmith")
const path = require("path")
const rimraf = require("rimraf")

const Resolver = require("../index")

describe("plugin-resolver", function () {
  before(done => rimraf("test/fixtures/*/build", done))

  it("resolves sync plugin", function (done) {
    assertProcessingOf("test/fixtures/basic", [compositePlugin(renamePluginSync)], done)
  })

  it("resolves async plugin", function (done) {
    assertProcessingOf("test/fixtures/basic", [compositePlugin(renamePluginAsync)], done)
  })
})

const assertProcessingOf = function (dir, plugins = [], done) {
  const ms = Metalsmith(dir)
  plugins.forEach(p => ms.use(p))
  ms.build(err => {
    if (err) return done(err)
    equal(path.join(dir, "expected"), path.join(dir, "build"))
    done()
  })
}

const compositePlugin = function (subplugin) {
  return function (files, metalsmith, done) {
    const resolvePlugin = Resolver(files, metalsmith)
    Promise.resolve()
      .then(() => resolvePlugin(subplugin))
      .then(() => done())
      .catch(err => done(err))
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
