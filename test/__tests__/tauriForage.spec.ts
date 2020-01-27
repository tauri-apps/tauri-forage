/* eslint no-undef: 0 */

/**
 * Note:
 * Unit testing forage is important, but will need integration testing later.
 * This is just about validating the units.
 */

import { forage, handler } from '../../src'
import { internals } from '../../src/tauriForage'
import localForage from 'localforage'

/*********************************************************************************
 *
 *    INTERNALS
 *    Pure Unit Testing
 *
 ********************************************************************************/

describe('[Forage]:internals (_mapArgs)', () => {
  const curry = () => true
  it('passes four args', async () => {
    const restArgs = [2, 'console', curry, true]
    expect(internals._mapArgs(restArgs)).toStrictEqual(
      [{ 'returner': 2 }, { 'logger': 'console' }, { 'curry': curry }, { 'before': true }])
  })
  it('passes three args', async () => {
    const restArgs = [2, 'console', curry]
    expect(internals._mapArgs(restArgs)).toStrictEqual(
      [{ 'returner': 2 }, { 'logger': 'console' }, { 'curry': curry }])
  })
  it('doesn\'t care about order', async () => {
    const restArgs2 = ['console', curry, 2]
    expect(internals._mapArgs(restArgs2)).toStrictEqual(
      [{ 'logger': 'console' }, { 'curry': curry }, { 'returner': 2 }])
  })
  it('accepts just one arg', async () => {
    const restArgs2 = [2]
    expect(internals._mapArgs(restArgs2)).toStrictEqual(
      [{ 'returner': 2 }])
  })
  it('accepts two args', async () => {
    const restArgs2 = ['console', curry]
    expect(internals._mapArgs(restArgs2)).toStrictEqual(
      [{ 'logger': 'console' }, { 'curry': curry }])
  })
  it('accepts an undefined array', async () => {
    // technically this is caught with the default case in the switch
    // and with the default `arr = []`
    // but this is just a failsafe test
    const restArgs2: any = void 0
    expect(internals._mapArgs(restArgs2)).toStrictEqual(
      [])
  })
})

/*********************************************************************************
 *
 *    FORAGE UTILITIES
 *    Make sure builtins work as expected
 *
 ********************************************************************************/

describe('[Forage] config', () => {
  it('must setup a new DB', async () => {
    const config = await forage.config({
      options: {
        driver: [ // the normal order of things
          localForage.INDEXEDDB,
          localForage.WEBSQL,
          localForage.LOCALSTORAGE
        ],
        name: 'Database',
        storeName: 'Secret Stuff',
        version: '1.0',
        description: 'Private and encrypted data.'
      }
    })
    console.log(config)
    expect(config).toBe(true)
  })
})

describe('[Forage] ready', () => {
  it('must be true', async () => {
    const ready = await forage.ready()
    expect(ready).toStrictEqual(true)
  })
})

describe('[Forage] driver', () => {
  it('must be true', async () => {
    const driver = forage.driver()
    expect(driver).toStrictEqual('localStorageWrapper')
  })
})

describe('[Forage] config', () => {
  it('must be true', async () => {
    const driver = forage.driver()
    expect(driver).toStrictEqual('localStorageWrapper')
  })
})

describe('[Forage] createInstance', () => {
  it('must be true', async () => {
    const driver = !!forage.createInstance({ name: 'Test' })
    console.log(driver)
    expect(driver).toBe(true)
  })
  it('must be true', async () => {
    const driver: any = forage.createInstance({ name: 'Test' })
    console.log(driver)
    expect(driver._config.name).toBe('Test')
  })
})

describe('[Forage] dropInstance', () => {
  it('must drop current store', async () => {
    await forage.createInstance({ name: 'Test' })
    const driver = !!forage.dropInstance({ name: null })
    console.log(driver)
    expect(driver).toBe(true)
  })
  it('must drop a named store', async () => {
    await forage.createInstance({ name: 'Test' })
    const driver = !!forage.dropInstance({ name: 'Test' })
    console.log(driver)
    expect(driver).toBe(true)
  })
})

describe('[Forage] dropAll', () => {
  it('must drop current instance', async () => {
    await forage.createInstance({ name: 'Test', storeName: 'specialThing' } as any)
    const driver = !!forage.dropAll()
    console.log(driver)
    expect(driver).toEqual(true)
  })
})

describe('[Forage] dropStore', () => {
  it('must drop current instance', async () => {
    await forage.createInstance({ name: 'Test', storeName: 'specialThing' } as any)
    const driver = !!forage.dropStore({
      name: 'Test',
      storeName: 'specialThing'
    })
    console.log(driver)
    expect(driver).toEqual(true)
  })
  it('must drop current instance', async () => {
    await forage.createInstance({ name: 'Test', storeName: 'specialThing' } as any)
    const driver = forage.dropStore({
      name: 'Test',
      storeName: 'specialThing'
    })
    console.log(driver)
    expect(driver).toEqual({ '_h': 0, '_i': 0, '_j': null, '_k': null })
  })
})

/*********************************************************************************
 *
 *    FORAGE FEATURES
 *    Unit and Integration testing
 *
 ********************************************************************************/

describe('[Forage] setItem', () => {
  it('sets with an object', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice' })
  })
  it('can set an object that is an emoji', async () => {
    const user = await forage.setItem({ key: '\uD83D\uDE24', value: { name: 'Alice' } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice' })
  })
  it('can get an object that has an emoji name', async () => {
    const user = await forage.getItem({ key: '\uD83D\uDE24' })()
    expect(user).toStrictEqual({ 'name': 'Alice' })
  })
})

describe('[Forage] getItem', () => {
  it('will return the whole object', async () => {
    await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    const user = await forage.getItem({ key: 'user' })()
    expect(user).toStrictEqual({ 'name': 'Alice' })
  })
  it('will return null for an empty', async () => {
    await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    const user = await forage.getItem('user2' as any)()
    expect(user).toStrictEqual(null)
  })
  it('will return null for a wrong type (object)', async () => {
    await (forage.setItem as any)('user', { name: 'Alice' })
    const user = await forage.getItem({ key: 'aString' })()
    expect(user).toStrictEqual(null)
  })
  it('will return null for a wrong type (array)', async () => {
    await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    const user = await forage.getItem({ key: ['a string', 'another'] } as any)()
    expect(user).toStrictEqual(null)
  })
  it('will return null for a wrong type (null)', async () => {
    const user = await forage.getItem()()
    expect(user).toStrictEqual(null)
  })
  /* This is an obvious structural error that should propegate to the user

  it('will return null for a wrong type (undefined)', async () => {
    const user = await forage.getItem(undefined)
    expect(user).toStrictEqual(null)
  })
  */
})

describe('[Forage] getKeyValue', () => {
  it('will return the key\'s value', async () => {
    await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    const user = await forage.getKeyValue({ key: 'user', value: 'name' })()
    expect(user).toStrictEqual('Alice')
  })
  it('will return `void 0` if key not found', async () => {
    await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    const user = await forage.getKeyValue({ key: 'user', value: 'age' })()
    expect(user).toStrictEqual(void 0)
  })
  it('will curry after', async () => {
    await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    const curry = (v: any) => v.toUpperCase()
    const user = await forage.getKeyValue({ key: 'user', value: 'name' })(curry)
    expect(user).toStrictEqual('ALICE')
  })
  it('will curry before', async () => {
    await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    const curry = (v: any) => v.toLowerCase()
    const user = await forage.getKeyValue({ key: 'user', value: 'NAME', before: true })(curry)
    expect(user).toStrictEqual('Alice')
  })
})

describe('[Forage] setItem', () => {
  it('will overwrite the whole object', async () => {
    await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    const user = await forage.getItem({ key: 'user' })()
    expect(user).toStrictEqual({ 'name': 'Alice' })
    const setup = await forage.setItem({ key: 'user', value: { firstName: 'Bob' } } as any)()
    expect(setup).toStrictEqual({ 'firstName': 'Bob' })
    const postSetup = await forage.getItem({ key: 'user' })()
    expect(postSetup).toStrictEqual({ 'firstName': 'Bob' })
  })
  it('will curry before', async () => {
    const curry = (v: any) => v.toLowerCase()
    const user = await forage.setItem({ key: 'user', value: 'NAME', before: true })(curry)
    expect(user).toStrictEqual('name')
    const postSetup = await forage.getItem({ key: 'user' })()
    expect(postSetup).toStrictEqual('name')
  })
})

describe('[Forage] mergeItem (default)', () => {
  it('merges with an object', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice' })
    const newUser = await forage.mergeItem({ key: 'user', value: { age: 21 } } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Alice', 'age': 21 })
  })
  it('merges and overwrites an object', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice' })
    const newUser = await forage.mergeItem({ key: 'user', value: { name: 'Bob', age: 21 } } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Bob', 'age': 21 })
  })
  it('overwrites an array', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice', numbers: [1, 2, 3, 4] } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice', 'numbers': [1, 2, 3, 4] })
    const newUser = await forage.mergeItem({ key: 'user', value: { numbers: [2, 9, 3, 7] } } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Alice', 'numbers': [2, 9, 3, 7] })
  })
})
describe('[Forage] mergeItem (deepWith)', () => {
  it('concats an array', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice', numbers: [1, 2, 3, 4] } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice', 'numbers': [1, 2, 3, 4] })
    const newUser = await forage.mergeItem({ key: 'user', value: { numbers: [2, 9, 3, 7] }, type: 'deepWith' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Alice', 'numbers': [1, 2, 3, 4, 2, 9, 3, 7] })
  })
  it('concats an array and merges (probably not what you want)', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice', numbers: [1, 2, 3, 4] } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice', 'numbers': [1, 2, 3, 4] })
    const newUser = await forage.mergeItem({ key: 'user', value: { name: 'Bob', age: 35, numbers: [2, 9, 3, 7] }, type: 'deepWith' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'AliceBob', 'age': 35, 'numbers': [1, 2, 3, 4, 2, 9, 3, 7] })
  })
  it('fails if you try to merge booleans', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice', age: true, numbers: [1, 2, 3, 4] } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice', 'age': true, 'numbers': [1, 2, 3, 4] })
    let res = await forage.mergeItem({ key: 'user', value: { name: 'Bob', age: false, numbers: [2, 9, 3, 7] }, type: 'deepWith' } as any)()
    try {
      res = await (forage.mergeItem as any)('user', { name: 'Bob', age: false, numbers: [2, 9, 3, 7] }, 'deepWith')
      console.log(res) // undefined
    } catch (e) {
      expect(e.message).toBe('[TypeError: true does not have a method named "concat" or "fantasy-land/concat"]')
    }
  })
})

describe('[Forage] mergeItem (with)', () => {
  it('merges with an object', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice' })
    const newUser = await forage.mergeItem({ key: 'user', value: { age: 21 }, type: 'with' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Alice', 'age': 21 })
  })
  it('concats an array and merges (probably not what you want)', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice', numbers: [1, 2, 3, 4] } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice', 'numbers': [1, 2, 3, 4] })
    const newUser = await forage.mergeItem({ key: 'user', value: { name: 'Bob', age: 35, numbers: [2, 9, 3, 7] }, type: 'with' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'AliceBob', 'age': 35, 'numbers': [1, 2, 3, 4, 2, 9, 3, 7] })
  })
  it('fails if you try to merge booleans', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice', age: true, numbers: [1, 2, 3, 4] } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice', 'age': true, 'numbers': [1, 2, 3, 4] })
    try {
      let res = await (forage.mergeItem as any)('user', { name: 'Bob', age: false, numbers: [2, 9, 3, 7] }, 'with')
      console.log(res) // undefined
    } catch (e) {
      expect(e.message).toBe('[TypeError: true does not have a method named "concat" or "fantasy-land/concat"]')
    }
  })
})

describe('[Forage] mergeItem (withKey)', () => {
  it('merges with an object', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice' })
    const newUser = await forage.mergeItem({ key: 'user', value: { age: 21 }, type: 'withKey' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Alice', 'age': 21 })
  })
  it('concats an array and merges (probably not what you want)', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice', numbers: [1, 2, 3, 4] } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice', 'numbers': [1, 2, 3, 4] })
    const newUser = await forage.mergeItem({ key: 'user', value: { name: 'Bob', age: 35, numbers: [2, 9, 3, 7] }, type: 'withKey' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Bob', 'age': 35, 'numbers': [2, 9, 3, 7] })
  })
  it('fails if you try to merge booleans', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice', age: true, numbers: [1, 2, 3, 4] } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice', 'age': true, 'numbers': [1, 2, 3, 4] })
    let newUser = await forage.mergeItem({ key: 'user', value: { name: 'Bob', age: false, numbers: [2, 9, 3, 7] }, type: 'withKey' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Bob', 'age': false, 'numbers': [2, 9, 3, 7] })
  })
})

describe('[Forage] mergeItem (deepRight)', () => {
  it('merges with an object', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice' })
    const newUser = await forage.mergeItem({ key: 'user', value: { age: 21 }, type: 'deepRight' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Alice', 'age': 21 })
  })
  it('concats an array and merges (probably not what you want)', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice', numbers: [1, 2, 3, 4] } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice', 'numbers': [1, 2, 3, 4] })
    const newUser = await forage.mergeItem({ key: 'user', value: { name: 'Bob', age: 35, numbers: [2, 9, 3, 7] }, type: 'deepRight' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Bob', 'age': 35, 'numbers': [2, 9, 3, 7] })
  })
  it('fails if you try to merge booleans', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice', age: true, numbers: [1, 2, 3, 4] } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice', 'age': true, 'numbers': [1, 2, 3, 4] })
    const newUser = await forage.mergeItem({ key: 'user', value: { name: 'Bob', age: false, numbers: [2, 9, 3, 7] }, type: 'deepRight' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Bob', 'age': false, 'numbers': [2, 9, 3, 7] })
  })
})

describe('[Forage] mergeItem (deepRight)', () => {
  it('merges with an object', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice' })
    const newUser = await forage.mergeItem({ key: 'user', value: { age: 21 }, type: 'right' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Alice', 'age': 21 })
  })
  it('concats an array and merges (probably not what you want)', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice', numbers: [1, 2, 3, 4] } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice', 'numbers': [1, 2, 3, 4] })
    const newUser = await forage.mergeItem({ key: 'user', value: { name: 'Bob', age: 35, numbers: [2, 9, 3, 7] }, type: 'right' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Bob', 'age': 35, 'numbers': [2, 9, 3, 7] })
  })
  it('fails if you try to merge booleans', async () => {
    const user = await forage.setItem({ key: 'user', value: { name: 'Alice', age: true, numbers: [1, 2, 3, 4] } } as any)()
    expect(user).toStrictEqual({ 'name': 'Alice', 'age': true, 'numbers': [1, 2, 3, 4] })
    const newUser = await forage.mergeItem({ key: 'user', value: { name: 'Bob', age: false, numbers: [2, 9, 3, 7] }, type: 'right' } as any)()
    expect(newUser).toStrictEqual({ 'name': 'Bob', 'age': false, 'numbers': [2, 9, 3, 7] })
  })
})

describe('[Forage] removeItem', () => {
  it('will return the whole object', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user', value: { name: 'Alice' } } as any)()
    await forage.setItem({ key: 'user2', value: { name: 'Alice' } } as any)()
    const userNew = await forage.removeItem({
      key: 'user'
    })()
    expect(userNew).toBe(true)
    const length = await forage.length()()
    expect(length).toStrictEqual(1)
  })
})

describe('[Forage] deleteItemKey', () => {
  it('will just prune one key', async () => {
    await (forage.setItem as any)({ key: 'user', value: { name: 'Alice' } })()
    const userNew = await forage.deleteItemKey('user', 'age')
    expect(userNew).toStrictEqual({ 'name': 'Alice' })
  })
  it('will just prune an array of keys', async () => {
    await (forage.setItem as any)('user', { 'name': 'Alice', age: 24, me: false })
    const userNew = await forage.deleteItemKey('user', ['age', 'me'])
    expect(userNew).toStrictEqual({ 'name': 'Alice' })
  })
})

describe('[Forage] clear (everything)', () => {
  it('should clear anything', async () => {
    const clear = await forage.clear()()
    expect(clear).toStrictEqual(true)
  })
})

describe('[Forage] getItem', () => {
  it('fails if no data', async () => {
    await forage.clear()()
    const user = await forage.getItem({ key: 'user' })()
    expect(user).toStrictEqual(null)
  })
})
describe('[Forage] length', () => {
  it('returns the number of "rows" starting at 1', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user1', value: { name: 'Alice', age: 24, me: false } } as any)()
    let length = await forage.length()()
    expect(length).toStrictEqual(1)
    await forage.setItem({ key: 'user2', value: { name: 'Bob', age: 24, me: false } } as any)()
    length = await forage.length()()
    expect(length).toStrictEqual(2)
    await forage.setItem({ key: 'user3', value: { name: 'Jane', age: 24, me: false } } as any)()
    length = await forage.length()()
    expect(length).toStrictEqual(3)
  })
})

describe('[Forage] key', () => {
  it('returns the name of the key identified by index', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user', value: 'Alice' })()
    const count = await (forage.key as any)({ index: 0 })()
    expect(count).toStrictEqual('user')
  })
  it('curries if you want it to', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user', 'name': 'Alice', age: 24, me: false } as any)()
    const curry = function (val: any) { return val.toUpperCase() }
    const count = await forage.key({ index: 0 })(curry)
    expect(count).toStrictEqual('USER')
  })
  it('curries if you want it to', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user', 'name': 'Alice', age: 24, me: false } as any)()
    let curry = function (val: any) { return val + 1 }
    const count = await forage.key({ index: 0 })(curry)
    expect(count).toStrictEqual('user1')
  })
})

describe('[Forage] keys', () => {
  it('returns the names of the rows', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user1', value: { name: 'Alice', age: 24, me: false } } as any)()
    await forage.setItem({ key: 'user2', value: { name: 'Bob', age: 17, me: false } } as any)()
    const count = await (forage as any).keys()()
    expect(count).toStrictEqual(['user1', 'user2'])
  })
  it('curries if you want it to', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'him', value: { name: 'Alice', age: 24, me: false } } as any)()
    await forage.setItem({ key: 'user2', value: { name: 'Bob', age: 17, me: false } } as any)()
    const curry = (val: any) => val.map((v: any) => v.toUpperCase())
    const count = await forage.keys()(curry)
    expect(count).toStrictEqual(['HIM', 'USER2'])
  })
})

describe('[Forage] hasKey', () => {
  it('returns true if row is found', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user1', value: { name: 'Alice', age: 24, me: false } } as any)()
    await forage.setItem({ key: 'user2', value: { name: 'Bob', age: 17, me: false } } as any)()
    const count = await forage.hasKey({ key: 'user1' })()
    expect(count).toStrictEqual(true)
  })
  it('returns false if no such row is found', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user1', value: { name: 'Alice', age: 24, me: false } } as any)()
    await forage.setItem({ key: 'user2', value: { name: 'Bob', age: 17, me: false } } as any)()
    const count = await forage.hasKey({ key: 'user4' })()
    expect(count).toStrictEqual(false)
    expect(count).not.toStrictEqual(true)
  })
  it('curries if you want it to', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user1', value: { name: 'Alice', age: 24, me: false } } as any)()
    await forage.setItem({ key: 'user2', value: { name: 'Bob', age: 17, me: false } } as any)()
    const curryTime = function () { return true }
    let count = await forage.hasKey({ key: 'user3' })(curryTime)
    expect(count).not.toStrictEqual(false)
    expect(count).toStrictEqual(true)
    // Out of scope
    const curry = function () { return true }
    count = await handler.maybeCurry(curry)(forage.hasKey('user3' as any))
    expect(count).toStrictEqual(true)
    console.log(typeof curry === 'function')
  })
})

describe('[Forage] hasKeyValue', () => {
  it('returns true if key exists', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user1', value: { name: 'Alice', age: 24, me: false } } as any)()
    await forage.setItem({ key: 'user2', value: { name: 'Bob', age: 17, me: false } } as any)()
    const count = await forage.hasKeyValue({ key: 'user1', value: 'name' })()
    expect(count).toStrictEqual(true)
  })
  it('returns false if key doesn\'t exist', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user1', value: { name: 'Alice', age: 24, me: false } } as any)()
    await forage.setItem({ key: 'user2', value: { name: 'Bob', age: 17, me: false } } as any)()
    const count = await forage.hasKeyValue({ key: 'user1', value: 'height' })()
    expect(count).toStrictEqual(false)
  })
  it('curries if you want it to', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user1', value: { name: 'Alice', age: 24, me: false } } as any)()
    await forage.setItem({ key: 'user2', value: { name: 'Bob', age: 17, me: false } } as any)()
    const curry = (val: any) => {
      return {
        type: typeof val,
        value: val
      }
    }
    const count = await forage.hasKeyValue({ key: 'user1', value: 'name' })(curry)
    expect(count).toStrictEqual({ 'type': 'boolean', 'value': true })
  })
})

describe('[Forage] clear', () => {
  it('clears', async () => {
    expect(await forage.clear()()).toStrictEqual(true)
  })
})

describe('[Forage] length', () => {
  it('returns length if key exists', async () => {
    await forage.clear()()
    await forage.setItem({ key: 'user1', value: { name: 'Alice', age: 24, me: false } } as any)()
    await forage.setItem({ key: 'user2', value: { name: 'Bob', age: 17, me: false } } as any)()
    expect(await forage.length()()).toStrictEqual(2)
  })
  it('returns zero length if key doesn\'t exist', async () => {
    await forage.clear()()
    expect(await forage.length()()).toStrictEqual(0)
    expect(await forage.length()()).not.toStrictEqual(1)
  })
  it('curries if you want it to', async () => {
    const numbers = ['zero', 'one', 'two', 'three']
    await forage.clear()()
    await forage.setItem({ key: 'user1', value: { name: 'Alice', age: 24, me: false } } as any)()
    await forage.setItem({ key: 'user2', value: { name: 'Bob', age: 17, me: false } } as any)()
    const curry = (v: any) => numbers[v]
    expect(await forage.length()(curry)).toStrictEqual('two')
  })
})

describe('[Forage] _defineStorage', () => {
  it('creates a new store', async () => {
    const success = internals._defineStore({
      store: 'eventStream'
    })
    expect(!!success).toStrictEqual(true)
  })
})

describe('[Forage] _defineStorage and use it', () => {
  it('creates a new store', async () => {
    const success = internals._defineStore({
      store: 'eventStream'
    })
    expect(!!success).toStrictEqual(true)
    const newStore = await forage.setItem({
      key: 'thing',
      value: 'entry',
      store: 'eventStream'
    })()
    console.log(newStore)
    const len = await forage.length({
      store: 'eventStream'
    })()
    expect(len).toBe(1)
  })
})
