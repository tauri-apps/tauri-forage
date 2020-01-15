/* eslint no-fallthrough: 0 */

/**
 * @namespace handler
 * @category handler
 */
export const handler = {
  /**
   * @name returner
   * @description Return the value - or don't.
   * Of special note is case 4, which will tell you if the
   * result of the operation is true, false, null or undefined.
   * You can use numbers or strings
   *
   * ## TYPES
   * - 1(quiet) - return void 0
   * - 2(console) - log the returned value to the console
   * - 3(break) - throw an error with the contents of the return
   * - 4(truthy) - return a true or false value
   * - 5(typeof) - return type of response
   * - 6(trace) - get a console.trace() of the call stack
   * - 7(passthrough) - the default does nothing to the return
   *
   * @category handler
   * @memberof handler
   * @param {*} val
   * @param {number|string} type
   * @throws {Error} the message it is passed (if type 3)
   * @returns {*}
   * @function
   */
  returner (val, type) {
    return function (returnerType) {
      if (!type) {
        type = returnerType
      }
      const t = typeof type
      if (t === 'number' || t === 'string') {
        switch (type) {
          case 1:
          case 'quiet': // be totally quiet
            return void 0
          case 2:
          case 'console': // helpful for debugging
            console.log(val)
            break
          case 3:
          case 'break': // manual breakpoint
            if (val instanceof Error) {
              // if it already is an error no need to throw twice
              // but if the message is empty, fill it.
              val.message ? void 0 : val.message = 'No value'
              throw val
            } else {
              throw new Error(val || 'No result')
            }
          case 4:
          case 'truthy': // 'truthy': undefined not null
            return val === null || val === void 0 ? false : val !== false
          case 5:
          case 'typeof': // return 'typeof'
            if (val === null) return 'null'
            if (val === void 0) return 'undefined'
            if (val instanceof Error) return 'error'
            try {
              val.map(v => v)
              return 'array'
            } catch (e) {
              return typeof val
            }
          case 6:
          case 'trace':
            console.trace(`TRACE: ${val}`)
            break
          case 7:
          case 'passthrough': // short-circuit
          case 'default':
          default:
            return val
        }
      } else { // not a string or a number
        return val
      }
    }
  },

  /**
   * @function logger
   * @description Set logging type for returning errors in a number of ways.
   * @examples
   *  handler.returner('not ava')() // returns 'not ava'
   *  handler.returner('not ava')('truthy') // returns true
   *  handler.returner('not ava', 'truthy')() // returns true
   *
   * @category handler
   * @memberof handler
   * @param {*} msg
   * @param {string} type
   * @throws {Error} - just the message it is passed
   * @returns {*}
   */
  logger (msg, type) {
    // todo: discuss making things silent in production
    /*
    // set with a variable
    process.env.PRODUCTION === true ? type = 'none' : void 0

    // short circuit (best perf)
    if(process.env.LOGGING === 'none') return

    // delegate from .env (still global, most flexible)
    ? process.env.LOGGING ? type = process.env.LOGGING : void 0
    */
    return function (loggerType) {
      if (!type) {
        type = loggerType
      }
      if (typeof type === 'string' && msg) {
        switch (type) {
          case 'none':
            return
          case 'string':
            return msg
          case 'trace':
            console.trace(`TRACE: ${msg}`)
            return
          case 'console':
            console.error(msg)
            return
          case 'throw':
            if (msg instanceof Error) {
              // if it already is an error no need to throw twice,
              // but if the message is empty, fill it.
              msg.message ? void 0 : msg.message = 'No message'
              throw msg
            } else {
              throw new Error(msg || 'No result')
            }
          default:
            break
        }
      } else {
        return void 0
      }
    }
  },
  /**
   * @name maybeCurry
   * @description If a function is passed, apply it to the value.
   * Otherwise, just return the value.
   * @category handler
   * @memberof handler
   * @param {function} fn
   * @param {*} val
   * @returns {*}
   * @function
   */
  maybeCurry (fn) {
    return (val) => {
      /* also works - just seems dirty (and dangerous)
      try {
        return fn(val)
      } catch (e) {
        return val
      }
      */
      if (typeof fn === 'function') {
        return fn(val)
      } else {
        return val
      }
    }
  },

  /**
   * @name jsonPurify
   * @description accepts an array and tries to parse the object passed
   * @category handler
   * @memberof handler
   * @param {object} model - the model to map against
   * @param {number} maxLen - max length of model
   * @function
   */
  jsonPurify ({ model, maxLen } = {}) {
    let parsedObj, safeObj = {}
    /**
     * @param {string}
     */
    return async function (str) {
      try {
        if (maxLen && str.length > maxLen) {
          return null
        } else {
          parsedObj = JSON.parse(str)
          if (typeof parsedObj !== 'object' || Array.isArray(parsedObj)) {
            safeObj = parsedObj
          } else {
            // copy only expected properties to the safeObj
            model.forEach((prop) => {
              if (parsedObj.hasOwnProperty(prop)) {
                // eslint-disable-next-line security/detect-object-injection
                safeObj[prop] = parsedObj[prop]
              }
            })
          }
          return safeObj
        }
      } catch (e) {
        return e
      }
    }
  }
}

export default { handler }
