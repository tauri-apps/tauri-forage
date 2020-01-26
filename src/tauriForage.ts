import localForage from 'localforage'
import {
  mergeDeepRight,
  mergeDeepWith,
  mergeDeepWithKey,
  mergeRight,
  mergeWith,
  mergeWithKey,
  concat } from 'ramda'
import { handler, LoggerType, ReturnerType, MaybeLoggerType } from './handler'
import { MaybeFunction } from './types'

export type Store = {}

export interface Item {
  key?: string
  logger?: LoggerType
  returner?: ReturnerType
  store?: string
}

export interface BeforeItem extends Item{
  before?: boolean
}

export interface IndexItem extends BeforeItem {
  index?: number
}

export interface KeyValueItem extends BeforeItem {
  value?: string
}

export interface MergeItem extends KeyValueItem {
  type?: string;
}

// todo: rename keys to rows / row, values to keys

/**
 *  @description -> externally, we are using the same API as localForage,
 *  with the exception of the dropInstance interface, which, while
 *  still available, has been split out into three distinct calls.
 *  Also, are using `.then` instead of the callback approach, and
 *  always catch an error.
 *
 *  Of note are the extensions to the generic interface:
 *  - mergeItem (with a number of merge strategies available)
 *  - getKeyValue
 *  - deleteItemKey
 *  - hasKey
 *  - hasKeyValue
 *
 *  Note:
 *  Even if undefined is saved, null will be returned by getItem().
 *  This is due to a limitation in localStorage, and for compatibility
 *  reasons localForage cannot store the value undefined.
 *
 * Usage Options:
 * 1. Exactly the same interface as localForage
 * 2. With a currying function applied to the result
 * 3. Modify the value returned (with or without curry)
 * 4. Define error suppression
 *
 * @category forage
 * @namespace forage
 */
const forage = {
  /**
   * @description get the object of a specific row if it exists.
   * @
   * @param {string} key
   * @param {string} logger
   * @param {number} returner
   * @param {boolean} before
   * @param {string} store
   * @returns {Promise<object|string|*>}
   * @function getItem
   * @memberof forage
   */
  getItem ({ key, logger, returner, before, store }: BeforeItem = {}) {
    return async function (curry?: MaybeFunction) {
      const storage = await _defineStore({ store: store })
      key = before ? await handler.maybeCurry(curry || null)(key) : key
      return handler.returner(
        storage.getItem(key).then(async (v: any) => {
          return !before ? handler.maybeCurry(curry || null)(v) : v
        }).catch((err: any) => {
          /* istanbul ignore next */
          return handler.logger(err)(logger)
        })
      )(returner)
    }
  },
  /**
   * @description get the value of a specific key in a row if it exists.
   *
   * @param {string} key
   * @param {string} value
   * @param {function} curry
   * @param {string} logger
   * @param {number|string} returner
   * @returns {Promise<object|string|*>}
   * @function getKeyValue
   * @memberof forage
   */
  getKeyValue ({ key, value, logger, returner, before, store }: KeyValueItem = {}) {
    return async function (curry?: MaybeFunction) {
      const storage = await _defineStore({ store: store })
      value = before ? await handler.maybeCurry(curry || null)(value) : value
      return handler.returner(
        storage.getItem(key).then((v: any) => {
          // console.log(v)
          return !before ? handler.maybeCurry(curry || null)(v[value]) : v[value]
        }).catch((err: any) => {
          /* istanbul ignore next */
          return handler.logger(err)(logger)
        })
      )(returner)
    }
  },
  /**
   * @description set an row if it exists, completely overwrite it if
   * it does not exist.
   *
   * @param {string} key
   * @param {string} value
   * @param {...Function|string|number} restArgs
   * @param {function} restArgs.curry
   * @param {string} restArgs.logger
   * @param {number} restArgs.returner
   * @returns {Promise<object|string|*>}
   * @function setItem
   * @memberof forage
   */
  setItem ({ key, value, logger, returner, before, store }: KeyValueItem = {}) {
    return async function (curry?: MaybeFunction) {
      const storage = _defineStore({ store: store })
      value = before ? await handler.maybeCurry(curry || null)(value) : value
      return handler.returner(
        storage.setItem(key, value).then(async (v: any) => {
          return !before ? handler.maybeCurry(curry || null)(v) : v
        }).catch((err: any) => {
          /* istanbul ignore next */
          return handler.logger(err)(logger)
        })
      )(returner)
    }
  },
  /**
   *
   * @param {...Function|string|number} restArgs
   * @param {number} restArgs.index
   * @param {function} restArgs.curry
   * @param {string} restArgs.logger
   * @param {number} restArgs.returner
   * @returns {Promise<string>}
   * @function setItem
   * @memberof forage
   */
  key ({ index, logger, returner, before, store }: IndexItem = {}) {
    return async function (curry: MaybeFunction) {
      const storage = await _defineStore({ store: store })
      index = before ? await handler.maybeCurry(curry || null)(index) : index
      return handler.returner(
        storage.key(index).then((v: any) => {
          return !before ? handler.maybeCurry(curry || null)(v) : v
        }).catch((err: any) => {
          /* istanbul ignore next */
          return handler.logger(err)(logger)
        })
      )(returner)
    }
  },
  /**
   * @description Merging data shouldn't be hard, so that logic is in here.
   * There are so many ways to do it though, that the caller can define
   * merge strategy. This is a "prebuilt" Curry.
   *
   * See https://ramdajs.com/docs/ for the exact features we are using.
   *
   * The default is to use the `deepWithKey` approach.
   *
   * @param {string} key
   * @param {string|object|array} value
   * @param {string} type
   * @param {...Function|string|number} restArgs
   * @param {function} restArgs.curry
   * @param {string} restArgs.logger
   * @param {number} restArgs.returner
   * @returns {Promise<object|string|*>}
   * @function mergeItem
   * @memberof forage
   */
  mergeItem ({ key, value, type, returner, logger, before, store }: MergeItem = {}) {
    const concatValues = (k: string, l: any, r: any) => k === 'values' ? concat(l, r) : r
    return async function (curry?: MaybeFunction) {
      const storage = _defineStore({ store: store })
      value = before ? await handler.maybeCurry(curry || null)(value) : value
      return handler.returner(
        await storage.getItem(key).then(async (v: any) => {
          let val
          switch (type) {
            case 'custom':
              try {
                val = await storage.setItem(key, await handler.maybeCurry(curry)(v))
                return val
              } catch (err) {
                /* istanbul ignore next */
                return handler.logger(err)(logger)
              }
            case 'right':
              try {
                val = await storage.setItem(key, mergeRight(v, value as any))
                return val
              } catch (err) {
                /* istanbul ignore next */
                return handler.logger(err)(logger)
              }
            case 'deepRight':
              try {
                val = await storage.setItem(key, mergeDeepRight(v, value as any))
                return val
              } catch (err) {
                /* istanbul ignore next */
                return handler.logger(err)(logger)
              }
            case 'with':
              try {
                val = await storage.setItem(key, mergeWith(concat, v, value))
                return val
              } catch (err) {
                /* istanbul ignore next */
                return handler.logger(err)(logger)
              }
            case 'withKey':
              try {
                return storage.setItem(key, mergeWithKey(concatValues, v, value))
              } catch (err) {
                /* istanbul ignore next */
                return handler.logger(err)(logger)
              }
            case 'deepWith': // watch out for booleans!
              try {
                return storage.setItem(key, mergeDeepWith(concat, v, value))
              } catch (err) {
                /* istanbul ignore next */
                return handler.logger(err)(logger)
              }
            case 'deepWithKey': // this is probably what you want
            default:
              try {
                val = await storage.setItem(key, mergeDeepWithKey(concatValues, v, value))
                return val
              } catch (err) {
                /* istanbul ignore next */
                return handler.logger(err)(logger)
              }
          }
        }).catch((err: any) => {
          /* istanbul ignore next */
          return handler.logger(err)(logger)
        }))(returner)
    }
  },

  removeItem ({ key, logger, returner, before, store }: BeforeItem = {}) {
    return async function (curry?: MaybeFunction) {
      key = before ? await handler.maybeCurry(curry || null)(key) : key
      const storage = await _defineStore({ store: store })
      return handler.returner(
        await storage.removeItem(key).then(() => {
          return true // !before ? handler.maybeCurry(curry || null)(true) : true
        }).catch((err: any) => {
          /* istanbul ignore next */
          return handler.logger(err)(logger)
        })
      )(returner)
    }
  },

  deleteItemKey: async function (key: string, value: string | string[], ...restArgs: any[]) {
    const args = _mapArgs(restArgs)
    return localForage.getItem(key).then((val: any) => {
      if (typeof value === 'string') {
        delete val[value]
      } else if (typeof value === typeof []) {
        value.forEach((v) => delete val[v])
      }
      return localForage.setItem(key, val).then((val: any) => {
        return val
      }).catch((err: any) => {
        /* istanbul ignore next */
        return handler.logger(err, args[0].logger)
      })
    }).catch((err: any) => {
      /* istanbul ignore next */
      return handler.logger(err, args[0].logger)
    })
  },
  clear ({ logger = 'none', store }: { logger?: LoggerType, store?: string } = {}) {
    return async function (curry?: MaybeFunction) {
      const storage = await _defineStore({ store: store })
      return storage.clear().then(() => {
        return handler.maybeCurry(curry || null)(true)
      }).catch((err: any) => {
        /* istanbul ignore next */
        return handler.logger(err)(logger)
      })
    }
  },
  length ({ logger, returner, store }: { logger?: LoggerType, returner?: ReturnerType, store?: string} = {}) {
    return async function (curry?: MaybeFunction) {
      const storage = await _defineStore({ store: store })
      return handler.returner(
        await storage.length().then((v: any) => {
          return handler.maybeCurry(curry || null)(v)
        }).catch((err: any) => {
          /* istanbul ignore next */
          return handler.logger(err)(logger)
        })
      )(returner)
    }
  },

  /**
   * EXPERIMENTAL!!!
   * @param {number} index
   * @returns {Promise<string>}
   */
  /*
  keyCurry: async (curry, index) => { // must be a key
    const future = async function res (curry) {
      return handler.maybeCurry2(curry)(2) // broken state
    }
    return future()
  },
  */
  keys ({ logger, returner, store }: { logger?: LoggerType, returner?: ReturnerType, store?: any } = {}) {
    return async function (curry: MaybeFunction) {
      const storage = await _defineStore({ store: store })
      return handler.returner(
        await storage.keys().then((v: any) => {
          return handler.maybeCurry(curry || null)(v)
        }).catch((err: any) => {
          /* istanbul ignore next */
          return handler.logger(err)(logger)
        })
      )(returner)
    }
  },

  hasKey ({ key, logger, returner, store }: Item = {}) { // must be a key
    return async function (curry?: MaybeFunction) {
      const storage = await _defineStore({ store: store })
      return handler.returner(
        await storage.keys().then((k: string[]) => {
          return handler.maybeCurry(curry || null)(k.includes(key))
        }).catch((err: any) => {
          /* istanbul ignore next */
          return handler.logger(err)(logger)
        })
      )(returner)
    }
  },

  // This version has destructuring and currying
  // call it like:
  //   forage.hasKey({ key: 'user4', closure: closureFn })
  /*
  hasKey_WORKS ({ key, curry, logger, returner }) { // must be a key
    return localForage.keys().then(k => {
      return handler.maybeCurry(curry)(k.includes(key))
    }).catch(err => {
      return handler.logger(err)(logger)
    })
  },
  */
  hasKeyValue ({ key, value, logger, returner }: { key?: string, value?: string, logger?: LoggerType, returner?: ReturnerType} = {}) { // boolean version of getKeyValue
    return async function (curry?: MaybeFunction) {
      return handler.returner(
        await localForage.getItem(key).then((val: any) => {
          return handler.maybeCurry(curry)(!!val[value])
        }).catch((err: any) => {
          /* istanbul ignore next */
          return handler.logger(err)(logger)
        })
      )(returner)
    }
  },

  iterate <T, U>(iteratorCallback: (value: T, key: string, iterationNumber: number) => U, callback: (err: any, result: U) => void) { // think ours are better tbh
    localForage.iterate(iteratorCallback, callback)
  },
  // UTILS
  /**
   *
   * @param {object} options
   */
  config (options: any) {
    return localForage.config(options)
  },
  /**
   * not async, not thenable
   * don't use this. prefer to use config
   * @returns {string}
   */
  driver () {
    return localForage.driver()
  },
  ready: async function () {
    return localForage.ready()
      .then(() => true)
      .catch((err: any) => {
        /* istanbul ignore next */
        console.error(err)
        /* istanbul ignore next */
        return false
      })
  },
  /**
   * This will return the entire object.
   * If you just want to know if it worked, do this:
   * ```
   * const driver = !!forage.createInstance({ name: 'Test' })
   * ```
   * @param {string} name
   * @returns {boolean}
   */
  createInstance ({ name, logger }: { name?: string, logger?: any} = {}) {
    // this should also register itself in a list of stores
    return localForage.createInstance({
      name: name || 'tauriForage'
    }
    // , (success: any, err: any) => {
    //   /* istanbul ignore next */
    //   return err ? handler.logger(err, logger) : success
    // }
    )
  },

  // todo: when purging data, this will be important.
  dropInstance: async function ({ name }: { name: string }) {
    return localForage.dropInstance({ name: name }).then(() => {
      return true
    }).catch((err: any) => {
      /* istanbul ignore next */
      console.log(err)
      /* istanbul ignore next */
     return false
    })
  },
  dropAll: async function () {
    return localForage.dropInstance({}).then(() => {
      return true
    }).catch((err: any) => {
      /* istanbul ignore next */
      console.log(err)
      /* istanbul ignore next */
      return false
    })
  },
  dropStore ({ name, storeName }: { name: string, storeName: string }) {
    return localForage.dropInstance({
      name: name,
      storeName: storeName
    })
  }
}

/**
 * @name _mapArgs
 * @description Internal function for mapping the args to be
 * passed to the forage functions. We don't care about order,
 * we just care about type. And speed.
 *
 * In fact, we care so much about speed, we will probably
 * deprecate this. :D
 *
 * @category tauriForage
 * @param {Array} arr
 * @returns {Array}
 * @private
 */
const _mapArgs = function (arr: any[]) {
  if (arr) {
    const arrint = arr.map(val => {
      let type = typeof val
      switch (type) {
        case 'function':
          return { curry: val } // function to curry with
        case 'string':
          return { logger: val } // name of logger to use
        case 'number':
          return { returner: val } // type of return
        case 'boolean':
          return { before: val } // curry before forage if true
        default:
          return { curry: val }
      }
    })
    return arrint
  } else return []
}

const _defineStore = function ({ store }: { store?: string } = {}) {
  if (!store) return localForage
  return forage.createInstance({
    name: store
  })
}

// we are exporting the internals for testing purposes
const internals = { _mapArgs, _defineStore }
const getItem = forage.getItem
const getKeyValue = forage.getKeyValue
const setItem = forage.setItem
const key = forage.key
const mergeItem = forage.mergeItem
const removeItem = forage.removeItem
const deleteItemKey = forage.removeItem
const clear = forage.clear
const length = forage.length
const keys = forage.keys
const hasKey = forage.hasKey
const hasKeyValue = forage.hasKeyValue
const ready = forage.ready
const defineStore = _defineStore
export {
  forage,
  getItem,
  getKeyValue,
  setItem,
  key,
  mergeItem,
  removeItem,
  deleteItemKey,
  clear,
  length,
  keys,
  hasKey,
  hasKeyValue,
  ready,
  defineStore,
  internals // todo: move tauriForage entirely to external version of these
} // to use anywhere outside of vue contexts
