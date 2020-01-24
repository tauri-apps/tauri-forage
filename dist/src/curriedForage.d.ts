import { LoggerType, ReturnerType, MaybeLoggerType } from './handler';
import { MaybeFunction } from './types';
export declare type Store = {};
export interface Item {
    key?: string;
    logger?: LoggerType;
    returner?: ReturnerType;
    store?: string;
}
export interface BeforeItem extends Item {
    before?: boolean;
}
export interface IndexItem extends BeforeItem {
    index?: number;
}
export interface KeyValueItem extends BeforeItem {
    value?: string;
}
export interface MergeItem extends KeyValueItem {
    type?: string;
}
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
 *  The process is:
 *  1. forage.config({object})
 *  2. forage.ready()
 *  3. forage.set('user', { age: 12 })
 *  4. forage.get('user')
 *  5. forage.clear()
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
declare const forage: {
    /**
     * @description get the object of a specific row if it exists.
     * @
     * @param {string} key
     * @param {string} logger
     * @param {number} returner
     * @returns {Promise<object|string|*>}
     * @function getItem
     * @memberof forage
     */
    getItem({ key, logger, returner, before, store }?: BeforeItem): (curry?: MaybeFunction) => Promise<any>;
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
    getKeyValue({ key, value, logger, returner, before, store }?: KeyValueItem): (curry?: MaybeFunction) => Promise<any>;
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
    setItem({ key, value, logger, returner, before, store }?: KeyValueItem): (curry?: MaybeFunction) => Promise<any>;
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
    key({ index, logger, returner, before, store }?: IndexItem): (curry: MaybeFunction) => Promise<any>;
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
    mergeItem({ key, value, type, returner, logger, before, store }?: MergeItem): (curry?: MaybeFunction) => Promise<any>;
    removeItem({ key, logger, returner, before, store }?: BeforeItem): (curry?: MaybeFunction) => Promise<any>;
    deleteItemKey: (key: string, value: string | string[], ...restArgs: any[]) => Promise<any>;
    clear({ logger, store }?: {
        logger?: MaybeLoggerType;
        store?: string;
    }): (curry?: MaybeFunction) => Promise<any>;
    length({ logger, returner, store }?: {
        logger?: LoggerType;
        returner?: ReturnerType;
        store?: string;
    }): (curry?: MaybeFunction) => Promise<any>;
    /**
     * EXPERIMENTAL!!!
     * @param {number} index
     * @returns {Promise<string>}
     */
    keys({ logger, returner, store }?: {
        logger?: LoggerType;
        returner?: ReturnerType;
        store?: any;
    }): (curry: MaybeFunction) => Promise<any>;
    hasKey({ key, logger, returner, store }?: Item): (curry?: MaybeFunction) => Promise<any>;
    hasKeyValue({ key, value, logger, returner }?: {
        key?: string;
        value?: string;
        logger?: LoggerType;
        returner?: ReturnerType;
    }): (curry?: MaybeFunction) => Promise<any>;
    iterate<T, U>(iteratorCallback: (value: T, key: string, iterationNumber: number) => U, callback: (err: any, result: U) => void): void;
    /**
     *
     * @param {object} options
     */
    config(options: any): boolean;
    /**
     * not async, not thenable
     * don't use this. prefer to use config
     * @returns {string}
     */
    driver(): string;
    ready: () => Promise<boolean>;
    /**
     * This will return the entire object.
     * If you just want to know if it worked, do this:
     * ```
     * const driver = !!forage.createInstance({ name: 'Test' })
     * ```
     * @param {string} name
     * @returns {boolean}
     */
    createInstance({ name, logger }?: {
        name?: string;
        logger?: any;
    }): LocalForage;
    dropInstance: ({ name }: {
        name: string;
    }) => Promise<boolean>;
    dropAll: () => Promise<boolean>;
    dropStore({ name, storeName }: {
        name: string;
        storeName: string;
    }): Promise<void>;
};
declare const internals: {
    _mapArgs: (arr: any[]) => ({
        curry: any;
        logger?: undefined;
        returner?: undefined;
        before?: undefined;
    } | {
        logger: any;
        curry?: undefined;
        returner?: undefined;
        before?: undefined;
    } | {
        returner: any;
        curry?: undefined;
        logger?: undefined;
        before?: undefined;
    } | {
        before: any;
        curry?: undefined;
        logger?: undefined;
        returner?: undefined;
    })[];
    _defineStore: ({ store }?: {
        store?: string;
    }) => LocalForage;
};
declare const getItem: ({ key, logger, returner, before, store }?: BeforeItem) => (curry?: MaybeFunction) => Promise<any>;
declare const getKeyValue: ({ key, value, logger, returner, before, store }?: KeyValueItem) => (curry?: MaybeFunction) => Promise<any>;
declare const setItem: ({ key, value, logger, returner, before, store }?: KeyValueItem) => (curry?: MaybeFunction) => Promise<any>;
declare const key: ({ index, logger, returner, before, store }?: IndexItem) => (curry: MaybeFunction) => Promise<any>;
declare const mergeItem: ({ key, value, type, returner, logger, before, store }?: MergeItem) => (curry?: MaybeFunction) => Promise<any>;
declare const removeItem: ({ key, logger, returner, before, store }?: BeforeItem) => (curry?: MaybeFunction) => Promise<any>;
declare const deleteItemKey: ({ key, logger, returner, before, store }?: BeforeItem) => (curry?: MaybeFunction) => Promise<any>;
declare const clear: ({ logger, store }?: {
    logger?: MaybeLoggerType;
    store?: string;
}) => (curry?: MaybeFunction) => Promise<any>;
declare const length: ({ logger, returner, store }?: {
    logger?: LoggerType;
    returner?: ReturnerType;
    store?: string;
}) => (curry?: MaybeFunction) => Promise<any>;
declare const keys: ({ logger, returner, store }?: {
    logger?: LoggerType;
    returner?: ReturnerType;
    store?: any;
}) => (curry: MaybeFunction) => Promise<any>;
declare const hasKey: ({ key, logger, returner, store }?: Item) => (curry?: MaybeFunction) => Promise<any>;
declare const hasKeyValue: ({ key, value, logger, returner }?: {
    key?: string;
    value?: string;
    logger?: LoggerType;
    returner?: ReturnerType;
}) => (curry?: MaybeFunction) => Promise<any>;
declare const ready: () => Promise<boolean>;
declare const defineStore: ({ store }?: {
    store?: string;
}) => LocalForage;
export { forage, getItem, getKeyValue, setItem, key, mergeItem, removeItem, deleteItemKey, clear, length, keys, hasKey, hasKeyValue, ready, defineStore, internals };
