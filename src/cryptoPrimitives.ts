import { secretbox, box, randomBytes, hash } from 'tweetnacl'

// todo: find better implementations of this, its 3 years old.
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} from 'tweetnacl-util'
import { MaybeUint8Array } from './types'

export interface Encryptable {
  json?: object
  key?: string
}

export interface Decryptable {
  msg?: string
  key?: string
}

export interface EncryptableBox {
  json: object
  key: Uint8Array
  secretOrSharedKey: Uint8Array
}

export interface DecryptableBox {
  secretOrSharedKey: Uint8Array
  messageWithNonce: string
  key: Uint8Array
}

// just a helper for a constant :)
const keyLength = secretbox.keyLength

// todo: https://github.com/dchest/tweetnacl-js/wiki/Using-with-Webpack
/**
 * @category crypto
 * @namespace
 */
const crypto = {
  /**
   * @name nonce
   * @category crypto
   * @memberof crypto
   * @returns {object}
   * @function
   */
  nonce (): Uint8Array {
    return randomBytes(secretbox.nonceLength)
  },
  /**
   * @name hash
   * @category crypto
   * @memberof crypto
   * @param {*} input
   * @returns {string}
   * @function
   */
  hash (input: string): string {
    return encodeBase64(hash(decodeUTF8(input))).slice(0, 44)
  },
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
    keyGen (input: MaybeUint8Array): string {
      input = input || randomBytes(secretbox.keyLength)
      return encodeBase64(input)
    },
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
    encrypt: async function ({ json, key }: Encryptable = {}) {
      if (!key) {
        throw new Error('[CryptoPrimitive] - missing key')
      }
      let keyUint8Array
      try {
        keyUint8Array = decodeBase64(key)
      } catch (err) {
        throw new Error('[CryptoPrimitive] - key wrong type')
      }
      // console.log(typeof keyUint8Array)

      const nonce = crypto.nonce()
      const messageUint8 = decodeUTF8(JSON.stringify(json))
      const box = secretbox(messageUint8, nonce, keyUint8Array)

      const fullMessage = new Uint8Array(nonce.length + box.length)
      fullMessage.set(nonce)
      fullMessage.set(box, nonce.length)

      const base64FullMessage = encodeBase64(fullMessage)
      return base64FullMessage
    },
    /*
    encrypt__TEST_DO_NOT_USE_IN_PRODUCTION: async function ({ json, key, nonce }) {
      if (!key) key = encodeBase64(randomBytes(secretbox.keyLength))
      const keyUint8Array = decodeBase64(key)

      const messageUint8 = decodeUTF8(JSON.stringify(json))
      const box = secretbox(messageUint8, nonce, keyUint8Array)

      const fullMessage = new Uint8Array(nonce.length + box.length)
      fullMessage.set(nonce)
      fullMessage.set(box, nonce.length)

      const base64FullMessage = encodeBase64(fullMessage)
      return base64FullMessage
    },
    */

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
    decrypt: async function ({ msg, key }: Decryptable = {}) {
      const keyUint8Array = decodeBase64(key)
      const messageWithNonceAsUint8Array = decodeBase64(msg)
      const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength)
      const message = messageWithNonceAsUint8Array.slice(
        secretbox.nonceLength,
        msg.length
      )
      const decrypted = secretbox.open(message, nonce, keyUint8Array)

      if (!decrypted) {
        throw new Error('Could not decrypt message')
      }
      const base64DecryptedMessage = encodeUTF8(decrypted)
      // this is potentially dangerous, because we are
      // deflating JSON that might be executable
      // todo: we need to handle exceptions here
      return JSON.parse(base64DecryptedMessage)
    }
  },
  // todo: fix, test and validate
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
    generateKeyPair () {
      return box.keyPair()
    },
    /**
     * @name box.encrypt
     * @category crypto
     * @memberof crypto.box
     * @param {string} secretOrSharedKey
     * @param {object} json
     * @param {string} key
     * @function
     */
    encrypt ({
      secretOrSharedKey,
      json,
      key
    }: EncryptableBox) {
      const nonce = this.crypto.nacl.nonce()
      const messageUint8 = decodeUTF8(JSON.stringify(json))
      const encrypted = key
        ? box(messageUint8, nonce, key, secretOrSharedKey)
        : box.after(messageUint8, nonce, secretOrSharedKey)

      const fullMessage = new Uint8Array(nonce.length + encrypted.length)
      fullMessage.set(nonce)
      fullMessage.set(encrypted, nonce.length)

      const base64FullMessage = encodeBase64(fullMessage)
      return base64FullMessage
    },
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
    decrypt ({
      secretOrSharedKey,
      messageWithNonce,
      key
    }: DecryptableBox) {
      const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce)
      const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength)
      const message = messageWithNonceAsUint8Array.slice(
        box.nonceLength,
        messageWithNonce.length
      )

      const decrypted = key
        ? box.open(message, nonce, key, secretOrSharedKey)
        : box.open.after(message, nonce, secretOrSharedKey)

      if (!decrypted) {
        throw new Error('Could not decrypt message')
      }

      const base64DecryptedMessage = encodeUTF8(decrypted)
      return JSON.parse(base64DecryptedMessage)
    }
  }
}

export {
  crypto,
  keyLength
}
