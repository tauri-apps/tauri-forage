import { LoggerType, ReturnerType } from './handler';
import { Purifiable } from './types';
export interface Enbox {
    key?: string;
    loggerType?: LoggerType;
    returnType?: ReturnerType;
}
export interface Debox extends Enbox, Purifiable {
}
/**
 * @description Use currying process to inject
 * @namespace
 * @category forage
 */
declare const cryptoForage: {
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
    enBox: ({ key, loggerType, returnType }?: Enbox) => (val: any) => Promise<any>;
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
    deBox: ({ key, model, maxLen, loggerType, returnType }?: Debox) => (val: Promise<any>) => Promise<any>;
};
export { cryptoForage };
