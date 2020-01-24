/* eslint no-undef: 0 */

import { crypto } from '../../src'

// todo  =  mock nonce (aka crypto and remove test function)

let NACL_COMMON = {
  nonceArr: '7d067c2097806e0f34c0ae543517540c66036aa937fc422c',
  key: 'jCnxcqsK5REjJZb1n6L4bGIxXAGpFDSxR8S3CCJuvhE=',
  msg: { 'msg': 'Hello there.', 'from': 'me@me.me' },
  encrypted_stored: 'fQZ8IJeAbg80wK5UNRdUDGYDaqk3/EIsLdcNOOVJh85id6xtYjtMa7cBLiYmdRLlo6ykvw1o5NfZ2MnrEwQ/rdCMA0unMJeErh3oywC/2sU=',
  encrypted: '',
  decrypted: ''
}
// ///////////////////////////////  NACL

describe('[CryptoPrimitives]:nacl - nonce', () => {
  it('creates a nonce', async () => {
    const nonce = await crypto.nonce()
    console.log(nonce)
    expect(!!nonce).toBe(true)
  })
})
describe('[CryptoPrimitives]:nacl - secretBox.keyGen', () => {
  it('creates a key', async () => {
    const key = crypto.secretBox.keyGen()
    console.log(key)
    expect(!!key).toBe(true)
  })
})
describe('[CryptoPrimitives]:nacl - secretBox.encrypt', () => {
  it('encrypts', async () => {
    const box = await crypto.secretBox.encrypt({
      json: NACL_COMMON.msg, // { 'msg': 'Hello there.', 'from': 'me@me.me' },
      key: NACL_COMMON.key // crypto.nacl.secretBox.keyGen()
    })
    console.log(box)
    expect(!!box).toBe(true)
  })
})
/*
describe('[CryptoPrimitives]:nacl - secretBox.encrypt (stored nonce)', () => {
  it('encrypts', async () => {
    await _sodium.ready
    const sodium = _sodium
    const box = await crypto.secretBox.encrypt__TEST_DO_NOT_USE_IN_PRODUCTION({
      json: NACL_COMMON.msg, // { 'msg': 'Hello there.', 'from': 'me@me.me' },
      key: NACL_COMMON.key, // crypto.nacl.secretBox.keyGen(),
      nonce: sodium.from_hex(NACL_COMMON.nonceArr) // using sodium as a helper here
    })
    console.log(box)
    expect(!!box).toBe(true)
    expect(box).toBe(NACL_COMMON.encrypted_stored)
  })
})

describe('[CryptoPrimitives]:nacl - secretBox.decrypt', () => {
  it('encrypts', async () => {
    // await _sodium.ready
    // const sodium = _sodium
    const box = await crypto.secretBox.decrypt({
      msg: NACL_COMMON.encrypted_stored, // { 'msg': 'Hello there.', 'from': 'me@me.me' },
      key: NACL_COMMON.key
    })
    console.log(box)
    expect(!!box).toBe(true)
    expect(box).toStrictEqual(NACL_COMMON.msg)
  })
})
*/
// ///////////////////////////////  SODIUM

/*
describe('[CryptoPrimitives]:sodium - nonce', () => {
  it('creates a nonce', async () => {
    await _sodium.ready
    const sodium = _sodium

    const thing = await crypto.sodium.nonce({ sodium, settings })
    expect(!!thing).toBe(true)
  })
  it('two nonces are not the same', async () => {
    await _sodium.ready
    const sodium = _sodium
    const settings = {}
    const thing = await crypto.sodium.nonce({ sodium, settings })
    const thing2 = await crypto.sodium.nonce({ sodium, settings })
    // console.log(thing)
    // console.log(thing2)
    expect(!thing !== !thing2).toBe(false) // xor em
    expect(thing !== thing2).toBe(true) //
  })
})

describe('[CryptoPrimitives]:sodium - keyGen', () => {
  it('creates a strong key', async () => {
    await _sodium.ready
    const sodium = _sodium
    const key = crypto.sodium.keyGen({ sodium })
    // console.log(key)
    expect(!!key).toBe(true)
  })
})

describe('[CryptoPrimitives]:sodium - nonce', () => {
  it('encrypts a string', async () => {
    await _sodium.ready
    const sodium = _sodium
    const key = crypto.sodium.keyGen({ sodium })
    COMMON.encrypted = await crypto.sodium.encrypt({
      sodium: sodium,
      msg: COMMON.msg,
      key: key
    })
    // console.log(COMMON.encrypted)
    expect(!!COMMON.encrypted).toBe(true)
  })

  it('encrypts a string', async () => {
    await _sodium.ready
    const sodium = _sodium
    // console.log(COMMON.nonceArr)
    // console.log(COMMON.key)
    // console.log(sodium.from_hex(COMMON.key))
    COMMON.encrypted = await crypto.sodium._encrypt____TESTING_DO_NOT_USE_IN_PRODUCTION({
      sodium: sodium,
      msg: COMMON.msg,
      key: sodium.from_hex(COMMON.key),
      nonceArr: COMMON.nonceArr
    })
    // console.log(COMMON.encrypted) // spa
    // console.log(COMMON.encrypted_stored)
    expect(!!COMMON.encrypted).toBe(true)
    expect(COMMON.encrypted).toBe(COMMON.encrypted_stored)
  })

  /*
  it('decrypts the string', async () => { // doesn't want to work for me. :(
    await _sodium.ready
    const sodium = _sodium
    console.log(COMMON.nonceArr)
    console.log(COMMON.key)
    console.log(sodium.from_hex(COMMON.key))
    COMMON.encrypted = await crypto.sodium.decrypt({
      sodium: sodium,
      nonceAndCiphertext: COMMON.encrypted_stored,
      key: sodium.from_hex(COMMON.key)
    })
    console.log(COMMON.encrypted)
    expect(!!COMMON.encrypted).toBe(true)
    expect(COMMON.encrypted).toBe(COMMON.encrypted_stored)
  })
  */
// })
