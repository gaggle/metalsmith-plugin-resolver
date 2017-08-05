"use strict";

module.exports = function (files, metalsmith) {
  return function (plugin, ...rest) {
    return new Promise((resolve, reject) => {
      let fn
      try {
        fn = plugin(...rest)
      }
      catch (err) {
        reject(err)
      }

      const isAsync = fn.length === 3

      try {
        if (isAsync) {
          const next = err => err ? reject(err) : resolve()
          fn(files, metalsmith, next)
        } else {
          fn(files, metalsmith)
          resolve()
        }
      }
      catch (err) {
        reject(err)
      }
    })
  }
}

// const wrap = require("wrapped")
// const ware = require("ware")
// export function applyPlugin(files, metalsmith) {
//   var ware = new Ware(plugins || this.plugins);
//   var run = thunkify(ware.run.bind(ware));
//   var res = yield run(files, this);
//   return res[0];
//
//
//   const middlware = ware()
//
//   var middleware = ware()
//     .use(function (req, res, next) {
//       res.x = 'hello';
//       next();
//     })
//     .use(function (req, res, next) {
//       res.y = 'world';
//       next();
//     });
//
//   middleware.run({}, {}, function (err, req, res) {
//     res.x; // "hello"
//     res.y; // "world"
//   });
//
// }
