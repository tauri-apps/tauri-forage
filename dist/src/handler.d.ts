import { MaybeFunction, Empty, Purifiable } from './types';
export declare type ReturnerType = string | number | object;
export declare type MaybeReturnerType = ReturnerType | Empty;
export declare type LoggerType = 'none' | 'string' | 'trace' | 'console' | 'throw';
export declare type MaybeLoggerType = LoggerType | Empty;
/**
 * @namespace handler
 * @category handler
 */
export declare const handler: {
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
    returner(val: any, type: MaybeReturnerType): (returnerType?: ReturnerType) => any;
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
     * @param {MaybeLoggerType} type
     * @throws {Error} - just the message it is passed
     * @returns {*}
     */
    logger(msg: any, type: MaybeLoggerType): (loggerType?: LoggerType) => any;
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
    maybeCurry(fn: MaybeFunction): (val: any) => any;
    /**
     * @name jsonPurify
     * @description accepts an array and tries to parse the object passed
     * @category handler
     * @memberof handler
     * @param {object} model - the model to map against
     * @param {number} maxLen - max length of model
     * @function
     */
    jsonPurify({ model, maxLen }?: Purifiable): (str: string) => Promise<any>;
};
declare const _default: {
    handler: {
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
        returner(val: any, type: MaybeReturnerType): (returnerType?: ReturnerType) => any;
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
         * @param {MaybeLoggerType} type
         * @throws {Error} - just the message it is passed
         * @returns {*}
         */
        logger(msg: any, type: MaybeLoggerType): (loggerType?: LoggerType) => any;
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
        maybeCurry(fn: MaybeFunction): (val: any) => any;
        /**
         * @name jsonPurify
         * @description accepts an array and tries to parse the object passed
         * @category handler
         * @memberof handler
         * @param {object} model - the model to map against
         * @param {number} maxLen - max length of model
         * @function
         */
        jsonPurify({ model, maxLen }?: Purifiable): (str: string) => Promise<any>;
    };
};
export default _default;
