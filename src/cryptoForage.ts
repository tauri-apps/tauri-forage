import { crypto } from './cryptoPrimitives'
import { forage } from './tauriForage'
import { handler, LoggerType, ReturnerType } from './handler'
import { Purifiable } from './types'

export interface Enbox {
  key?: string
  loggerType?: LoggerType
  returnType?: ReturnerType
}

export interface Debox extends Enbox, Purifiable {}

/**
 * @description Use currying process to inject
 * @namespace
 * @category forage
 */
const cryptoForage = {
  /**
   * @description encrypt a functional
   * @name enBox
   * @category forage
   * @uses forage.mergeItem
   * @memberof cryptoForage
   * @param {string} key - encryption key
   * @param {array} logger - loglevel of errors (forage)
   * @param {array} returner - return type (forage)
   * @returns {object|*} - the JSON results of our box
   * @function
   * @example
   *  const boxFn = await cryptoForage.enBox({
   *    key:key,
   *    loggerType: 'throw',
   *    returnType: 7
   *  })(new Date().now())
   */

  enBox: function ({ key, loggerType, returnType }: Enbox = {}) {
    return async function (val: any) {
      return handler.returner(
        await crypto.secretBox.encrypt({
          json: await val,
          key: key
        }).catch(err => {
          /* istanbul ignore next */
          return handler.logger(err)(loggerType)
        })
      )(returnType)
    }
  },

  /**
   * @name deBox
   * @description use the "box" system to decrypt something from the storage
   * @category forage
   * @memberof cryptoForage
   * @uses forage.getKeyValue
   * @param {string} key - encryption key
   * @param {array} model - array of acceptable properties (validate)
   * @param {string} maxlen - forage name of key (validate)
   * @param {string} row - forage row (forage)
   * @param {string} name - forage name of key (forage)
   * @param {string} logger - loglevel of errors (forage)
   * @param {number} returner - return type (forage)
   * @returns {object|*} - the JSON results of our box
   * @function
   * @example
   *  const curry = async function (val) {
   *    const box = await crypto.secretBox.encrypt({
   *      json: val,
   *      key: key
   *    })
   *    console.log(box)
   *    return box
   *  }
   */
  deBox: function ({ key, model, maxLen, loggerType, returnType }: Debox = {}) {
    return async function (val: Promise<any>) {
      const result = handler.returner(
        await crypto.secretBox.decrypt({
          msg: await val,
          key: key
        }).catch(err => {
        /* istanbul ignore next */
          return handler.logger(err)(loggerType)
        })
      /* istanbul ignore */
      )(returnType)
      if (model && typeof model === 'object') {
        return handler.jsonPurify({
          model: model,
          maxLen: maxLen || null
        })(JSON.stringify(result))
      } else {
        return result
      }
    }
  }
}

export {
  cryptoForage
}
