import { MaybeFunction, Empty, Purifiable } from './types'

export type ReturnerType = string | number | object

export type MaybeReturnerType = ReturnerType | Empty

export type LoggerType = string | number

export type MaybeLoggerType = LoggerType | Empty

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
   * @param {MaybeReturnerType} type
   * @throws {Error} the message it is passed (if type 3)
   * @returns {*}
   * @function
   */
  returner (val: any, type: MaybeReturnerType) {
    return function (returnerType?: ReturnerType) {
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
              val.map((v: any) => v)
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
   * ## TYPES
   * - 1(none) - just return
   * - 2(string) - returned the string value of the error
   * - 3(trace) - try to return a stack trace up to the error
   * - 4(console) - write a console.error
   * - 5(throw) - throw the error
   * - 6(default) - return undefined
   *
   * @category handler
   * @memberof handler
   * @param {*} msg
   * @param {MaybeLoggerType} type
   * @throws {Error} - just the message it is passed
   * @returns {*}
   */
  logger (msg: any, type: MaybeLoggerType) {
    // todo: discuss making things silent in production
    /*
    // set with a variable
    process.env.PRODUCTION === true ? type = 'none' : void 0

    // short circuit (best perf)
    if(process.env.LOGGING === 'none') return

    // delegate from .env (still global, most flexible)
    ? process.env.LOGGING ? type = process.env.LOGGING : void 0
    */
    return function (loggerType?: LoggerType) {
      if (!type) {
        type = loggerType
      }
      const t = typeof type
      if ((t === 'number' || t === 'string') && msg) {
        switch (type) {
          case 1:
          case 'none':
            return
          case 2:
          case 'string':
            return msg
          case 3:
          case 'trace':
            console.trace(`TRACE: ${msg}`)
            return
          case 4:
          case 'console':
            console.error(msg)
            return
          case 5:
          case 'throw':
            if (msg instanceof Error) {
              // if it already is an error no need to throw twice,
              // but if the message is empty, fill it.
              msg.message ? void 0 : msg.message = 'No message'
              throw msg
            } else {
              throw new Error(msg || 'No result')
            }
          case 6:
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
  maybeCurry (fn: MaybeFunction) {
    return (val: any) => {
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
  jsonPurify ({ model, maxLen }: Purifiable = {}) {
    let parsedObj: any
    let safeObj: { [key: string]: any } = {}
    /**
     * @param {string}
     */
    return async function (str: string) {
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
