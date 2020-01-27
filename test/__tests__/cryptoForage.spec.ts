/* eslint no-undef: 0 */

import { cryptoForage, forage, crypto } from '../../src'
// import { handler } from 'src/utils/handler'

/**
 * Before you start reading these tests, a word of warning.
 * They are a little mind numbing. Sorry not sorry. At the end
 * of the day I'd rather have complete tests and clean code.
 */

let NACL_COMMON = {
  nonceArr: '7d067c2097806e0f34c0ae543517540c66036aa937fc422c',
  key: 'jCnxcqsK5REjJZb1n6L4bGIxXAGpFDSxR8S3CCJuvhE=',
  msg: { 'msg': 'Hello there.', 'from': 'me@me.me' },
  encrypted_stored: 'fQZ8IJeAbg80wK5UNRdUDGYDaqk3/EIsLdcNOOVJh85id6xtYjtMa7cBLiYmdRLlo6ykvw1o5NfZ2MnrEwQ/rdCMA0unMJeErh3oywC/2sU=',
  encrypted: '',
  decrypted: '',
  id: 'ck1tmd27o000i097551e1xea6',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjazF0bWQyN28wMDBpMDk3NTUxZTF4ZWE2Iiwicm9sZSI6IkFETUlOIiwiYWN0aXZlIjp0cnVlLCJpYXQiOjE1NzIxODc3NTV9.9KPIQAqQyZEaWJq_hm-4SnGGUY5jJChNeol6iSPENkw'
}

describe('[cryptoPrimitives] - encrypt and forage', () => {
  it('creates a box part 2', async () => {
    const boxFn = await crypto.secretBox.encrypt({
      key: NACL_COMMON.key,
      json: NACL_COMMON.msg
    })
    await forage.setItem({ key: 'user_keys', value: boxFn })()
    let store = await forage.getItem({ key: 'user_keys' })()
    console.log(store)
    console.log(boxFn)
    expect(!!boxFn).toBe(true)
  })
})

describe('[cryptoPrimitives] - decrypt and forage', () => {
  it('opens a box part 2', async () => {
    const boxFn = await crypto.secretBox.encrypt({
      key: NACL_COMMON.key,
      json: NACL_COMMON.msg
    })
    let store = await forage.setItem({ key: 'user_keys', value: boxFn })()
    console.log(store)
    const boxFn2 = await crypto.secretBox.decrypt({
      key: NACL_COMMON.key,
      msg: await forage.getItem({ key: 'user_keys' })()
    })
    store = await forage.getItem({ key: 'user_keys' })()
    console.log(store)
    console.log(boxFn2)
    expect(boxFn2).toStrictEqual(NACL_COMMON.msg)
  })
})

describe('[cryptoForage] - enBox', () => {
  it('creates a box', async () => {
    const boxFn = await cryptoForage.enBox({
      key: NACL_COMMON.key,
      row: 'user_keys',
      name: 'box',
      loggerType: 'throw',
      returnType: 7 // change this for other details
    } as any)(NACL_COMMON.msg)
    console.log(boxFn)
    expect(!!boxFn).toBe(true)
  })
})

describe('[cryptoForage] - enBox', () => {
  it('creates a box with injection', async () => {
    const boxed = await cryptoForage.enBox({
      key: NACL_COMMON.key,
      row: 'user_keys',
      name: 'box',
      loggerType: 'throw',
      returnType: 7
    } as any)(NACL_COMMON.msg)
    console.log(boxed)
    expect(!!boxed).toStrictEqual(true)
  })
})

describe('[cryptoForage] - enBox', () => {
  it('plays nice as curry with tauriForage', async () => {
    const boxed = cryptoForage.enBox({
      key: NACL_COMMON.key,
      loggerType: 'throw'
    })
    console.log(boxed)
    const set2 = await forage.setItem({
      key: 'user',
      value: await boxed(NACL_COMMON.msg)
    })()
    console.log(set2)
    expect(set2.length).toStrictEqual(108)
    const t = await forage.getItem({ key: 'user' })()
    console.log(t)
    expect(t.length).toStrictEqual(108)
  })
})

describe('[cryptoForage] - deBox', () => {
  it('plays nice currying tauriForage', async () => {
    const boxed = cryptoForage.enBox({
      key: NACL_COMMON.key,
      loggerType: 'throw'
    })
    console.log(boxed)
    const set2 = await forage.setItem({
      key: 'user2',
      value: await boxed(NACL_COMMON.msg)
    })()
    console.log(set2)
    expect(set2.length).toStrictEqual(108)
    const t = await forage.getItem({ key: 'user2' })()
    console.log(t)
    expect(t.length).toStrictEqual(108)

    const store = await forage.getItem({ key: 'user2' })()
    console.log(store)
    const deboxed = await cryptoForage.deBox({
      key: NACL_COMMON.key,
      loggerType: 'throw'
    })(await forage.getItem({ key: 'user2' })())
    console.log(deboxed)
    expect(deboxed).toStrictEqual(NACL_COMMON.msg)
  })
})

describe('[cryptoForage] - deBox', () => {
  it('plays nice currying tauriForage', async () => {
    forage.clear({})
    const boxed = cryptoForage.enBox({
      key: NACL_COMMON.key,
      loggerType: 'throw'
    })
    console.log(boxed)
    const set3 = await forage.setItem({
      key: 'user3',
      value: NACL_COMMON.msg,
      before: true
    } as any)(boxed)

    console.log(set3)
    expect(set3.length).toStrictEqual(108)
    const t = await forage.getItem({ key: 'user3' })()
    console.log(t)
    expect(t.length).toStrictEqual(108)

    const store = await forage.getItem({ key: 'user3' })()
    console.log(store)
    const deboxed = cryptoForage.deBox({
      key: NACL_COMMON.key,
      loggerType: 'throw'
    })
    await forage.getItem({ key: 'user3' })(await deboxed)
    console.log(deboxed)
  })
})

describe('[cryptoForage] - enBox', () => {
  it('plays nice standalone', async () => {
    await cryptoForage.enBox({
      key: NACL_COMMON.key,
      row: 'user_keys',
      name: 'box',
      returnType: 'default',
      loggerType: 'string'
    } as any)(NACL_COMMON.msg).then(val => {
      console.log(val)
      expect(val.length).toStrictEqual(108)
    })
  })
})

// BENCHMARKER
describe('[cryptoForage] - enBox benchmark', () => {
  it('Runs and times 1000 tests', async () => {
    const start = new Date()
    for (let x = 0; x <= 1000; x++) {
      const boxed = cryptoForage.enBox({
        key: NACL_COMMON.key,
        returnType: 'default',
        loggerType: 'console'
      })
      await forage.setItem({ key: 'user_keys', value: NACL_COMMON.msg, before: true } as any)(boxed)
    }
    const end = new Date()
    console.log(end.valueOf() - start.valueOf())
    expect(end.valueOf() - start.valueOf()).toBeLessThan(1000)
  })
})

describe('[cryptoForage] - deBox', () => {
  it('plays nice currying tauriForage', async () => {
    forage.clear({})

    const first = await forage.setItem({
      key: 'user',
      value: {
        id: NACL_COMMON.id,
        token: NACL_COMMON.token
      }
    } as any)()
    console.log(first)
    const boxed = cryptoForage.enBox({
      key: NACL_COMMON.key,
      returnType: 'default',
      loggerType: 'console'
    })
    const set3 = await forage.setItem({
      key: 'user3',
      value: NACL_COMMON.msg,
      before: true
    } as any)(boxed)
    console.log(set3)
    expect(set3.length).toStrictEqual(108)
    const t = await forage.getItem({ key: 'user3' })()
    console.log(t)
    expect(t.length).toStrictEqual(108)

    const store = await forage.getItem({ key: 'user3' })()
    console.log(store)
    const deboxed = cryptoForage.deBox({
      key: NACL_COMMON.key,
      loggerType: 'throw'
    })
    console.log(deboxed)
    const unbox = await forage.getItem({ key: 'user3' })(deboxed)
    console.log(unbox)
  })
})
describe('[cryptoForage] - deBox', () => {
  it('plays nice currying tauriForage', async () => {
    forage.clear({})

    const first = await forage.setItem({
      key: 'user',
      value: {
        id: NACL_COMMON.id,
        token: NACL_COMMON.token
      }
    } as any)()
    console.log(first)
    const boxed = cryptoForage.enBox({
      key: NACL_COMMON.key,
      returnType: 'default',
      loggerType: 'console'
    })
    const set3 = await forage.setItem({
      key: 'user3',
      value: NACL_COMMON.msg,
      before: true
    } as any)(boxed)
    console.log(set3)
    expect(set3.length).toStrictEqual(108)
    const t = await forage.getItem({ key: 'user3' })()
    console.log(t)
    expect(t.length).toStrictEqual(108)

    const store = await forage.getItem({ key: 'user3' })()
    console.log(store)
    const deboxed = cryptoForage.deBox({
      key: NACL_COMMON.key,
      loggerType: 'throw'
    })
    console.log(deboxed)
    const unbox = await forage.getItem({ key: 'user3' })(deboxed)
    console.log(unbox)
    expect(unbox).toStrictEqual({ msg: 'Hello there.', from: 'me@me.me' })
  })
})
describe('[cryptoForage] - deBox with model proof', () => {
  it('plays nice currying tauriForage', async () => {
    forage.clear({})

    const first = await forage.setItem({
      key: 'user',
      value: {
        id: NACL_COMMON.id,
        token: NACL_COMMON.token
      }
    } as any)()
    console.log(first)
    const boxed = cryptoForage.enBox({
      key: NACL_COMMON.key,
      returnType: 'default',
      loggerType: 'console'
    })
    const set3 = await forage.setItem({
      key: 'user3',
      value: NACL_COMMON.msg,
      before: true
    } as any)(boxed)
    console.log(set3)
    expect(set3.length).toStrictEqual(108)
    const t = await forage.getItem({ key: 'user3' })()
    console.log(t)
    expect(t.length).toStrictEqual(108)

    const store = await forage.getItem({ key: 'user3' })()
    console.log(store)
    const deboxed = cryptoForage.deBox({
      key: NACL_COMMON.key,
      loggerType: 'throw',
      model: ['msg', 'from']
    })
    console.log(deboxed)
    const unbox = await forage.getItem({ key: 'user3' })(deboxed)
    console.log(unbox)
    expect(unbox).toStrictEqual({ msg: 'Hello there.', from: 'me@me.me' })
  })
})
