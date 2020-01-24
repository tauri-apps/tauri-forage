import { MaybeUint8Array } from './types';
export interface Encryptable {
    json?: object;
    key?: string;
}
export interface Decryptable {
    msg?: string;
    key?: string;
}
export interface EncryptableBox {
    json: object;
    key: Uint8Array;
    secretOrSharedKey: Uint8Array;
}
export interface DecryptableBox {
    secretOrSharedKey: Uint8Array;
    messageWithNonce: string;
    key: Uint8Array;
}
declare const keyLength: number;
/**
 * @category crypto
 * @namespace
 */
declare const crypto: {
    /**
     * @name nonce
     * @category crypto
     * @memberof crypto
     * @returns {object}
     * @function
     */
    nonce(): Uint8Array;
    /**
     * @name hash
     * @category crypto
     * @memberof crypto
     * @param {*} input
     * @returns {string}
     * @function
     */
    hash(input: string): string;
    /**
     * @name secretBox
     * @category crypto
     * @description Make a public key / private key box
     * @namespace
     * @memberof crypto
     * @example
     * ```
     *  const key = generateKey()
     *  const obj = { "hello": "world" }
     *  const encrypted = crypto.nacl.secretBox.encrypt(obj, key)
     *  const decrypted = crypto.nacl.secretBox.decrypt(encrypted, key)
     *  console.log(decrypted, obj) // should be shallow equal
     * ```
     */
    secretBox: {
        /**
         * @name keyGen
         * @category crypto
         * @memberof crypto.secretBox
         * @param {*} input
         * @function
         */
        keyGen(input: MaybeUint8Array): string;
        /**
         * @name encrypt
         * @category crypto
         * @memberof crypto.secretBox
         * @param {object} json
         * @param {string} key
         * @throws {Error}
         * @returns {string}
         * @function
         */
        encrypt: ({ json, key }?: Encryptable) => Promise<string>;
        /**
         * @name decrypt
         * @category crypto
         * @memberof crypto.secretBox
         * @param {string} msg
         * @param {string} key
         * @throws {error} - Could not decrypt message
         * @returns {object}
         * @function
         */
        decrypt: ({ msg, key }?: Decryptable) => Promise<any>;
    };
    /**
     * @name box
     * @category crypto
     * @namespace
     * @memberof crypto
     * @description Make a public key / private key box
     * @example
     * ```
     *  const obj = { hello: 'world' };
     *  const pairA = crypto.nacl.box.generateKeyPair();
     *  const pairB = gcrypto.nacl.box.enerateKeyPair();
     *  const sharedA = box.before(pairB.publicKey, pairA.secretKey);
     *  const sharedB = box.before(pairA.publicKey, pairB.secretKey);
     *  const encrypted = crypto.nacl.box.encrypt(sharedA, obj);
     *  const decrypted = crypto.nacl.box.decrypt(sharedB, encrypted);
     *  console.log(obj, encrypted, decrypted);
     * ```
     *
     */
    box: {
        /**
         * @name generateKeyPair
         * @category crypto
         * @memberof crypto.box
         * @returns {object}
         * @function
         */
        generateKeyPair(): import("tweetnacl").BoxKeyPair;
        /**
         * @name box.encrypt
         * @category crypto
         * @memberof crypto.box
         * @param {string} secretOrSharedKey
         * @param {object} json
         * @param {string} key
         * @function
         */
        encrypt({ secretOrSharedKey, json, key }: EncryptableBox): string;
        /**
         * @name decrypt
         * @category crypto
         * @memberof crypto.box
         * @param {string} secretOrSharedKey
         * @param {string} messageWithNonce
         * @param {string} key
         * @throws {error}
         * @returns {string}
         * @function
         */
        decrypt({ secretOrSharedKey, messageWithNonce, key }: DecryptableBox): any;
    };
};
export { crypto, keyLength };
