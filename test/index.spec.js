"use strict";
const assert = require("assert")
const equal = require("assert-dir-equal")
const Metalsmith = require("metalsmith")
const path = require("path")
const rimraf = require("rimraf")

const Resolver = require("../lib/index")

describe("plugin-resolver", function () {
  before(done => rimraf("test/fixtures/*/build", done))

  it("resolves sync plugin", function () {
    const dir = "test/fixtures/basic"
    return Metalsmith(dir)
      .use(compositePlugin(renamePluginSync))
      .build(err => {
        if (err) throw new Error(err)
        equal(path.join(dir, "expected"), path.join(dir, "build"))
      })
  })

  it("resolves async plugin", function (done) {
    const dir = "test/fixtures/basic"
    return Metalsmith(dir)
      .use(compositePlugin(renamePluginAsync))
      .build(err => {
        if (err) return done(err)
        equal(path.join(dir, "expected"), path.join(dir, "build"))
        done()
      })
  })
})

const compositePlugin = function (subplugin) {

  return function (files, metalsmith, done) {
    const resolver = new Resolver(...arguments)
    resolver
      .use(subplugin())
      .run(done)
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
    let newFn = path.join("moved", fn)
    files[newFn] = files[fn]
    delete files[fn]
  })
}
