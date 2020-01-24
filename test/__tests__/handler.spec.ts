/* eslint no-undef: 0 */

import { handler } from '../../src'

/*********************************************************************************
 *
 *    INTERNALS
 *    Pure Unit Testing
 *
 ********************************************************************************/

describe('[Forage]:internals (maybeCurry)', () => {
  it('applies function to the value', async () => {
    let curryFn = (val: any) => { return val + 1 }
    expect(handler.maybeCurry(curryFn)(1)).toStrictEqual(2)
    curryFn = (val: any) => val.toUpperCase()
    expect(handler.maybeCurry(curryFn)('jane')).not.toStrictEqual('Jane')
    expect(handler.maybeCurry(curryFn)('jane')).toStrictEqual('JANE')
  })
  it('works with arrow functions 1', async () => {
    let curryFn = (val: any) => val.toUpperCase()
    expect(handler.maybeCurry(curryFn)('hello')).toStrictEqual('HELLO')
  })
  it('works with arrow functions 2', async () => {
    let curryFn = (val: any) => {
      val += 1
      return val
    }
    expect(handler.maybeCurry(curryFn)(1)).toStrictEqual(2)
  })
  it('works with arrow functions 3', async () => {
    let curryFn = (val: any) => {
      val++
      return val
    }
    expect(handler.maybeCurry(curryFn)(1)).toStrictEqual(2)
  })

  it('works with async functions using await', async () => {
    let curryFn = async (val: any) => {
      const thing = val + 1
      return thing
    }
    expect(await handler.maybeCurry(curryFn)(1)).toStrictEqual(2)
  })
  it('won\'t resolve async functions without using await', async () => {
    let curryFn = async (val: any) => {
      const thing = val + 1
      return thing
    }
    // this expect is dubious, because it really returns an object and a promise. :/
    expect(handler.maybeCurry(curryFn)(1)).not.toStrictEqual(2)
  })

  it('applies nothing to the value if function not passed', async () => {
    expect(handler.maybeCurry(void 0)(false)).toStrictEqual(false)
    expect(handler.maybeCurry(undefined)(false)).toStrictEqual(false)
    expect(handler.maybeCurry('' as any)(false)).toStrictEqual(false)
    expect(handler.maybeCurry([] as any)(false)).toStrictEqual(false)
    expect(handler.maybeCurry({} as any)(false)).toStrictEqual(false)
    expect(handler.maybeCurry(true as any)(false)).toStrictEqual(false)
  })
})

describe('[Forage]:internals (logger)', () => {
  it('returns nothing if given nothing', async () => {
    expect((handler.logger as any)()()).toStrictEqual(void 0)
  })
  it('returns nothing by default', async () => {
    expect(handler.logger('hello')()).toStrictEqual(void 0)
    expect((handler.logger as any)()()).toStrictEqual(void 0)
  })
  it('returns nothing if you use an unavailable logger', async () => {
    expect(handler.logger('hello')('notavailable' as any)).toStrictEqual(void 0)
  })
  it('returns nothing if you use "none" or undefined', async () => {
    expect(handler.logger('hello')('none')).toStrictEqual(void 0)
    expect(handler.logger('hello')(void 0)).toStrictEqual(void 0)
  })
  it('returns a string (double-curry style)', async () => {
    expect(handler.logger('hello')()).toStrictEqual(void 0)
    expect(handler.logger('[Err]: Unknown')('string')).toStrictEqual('[Err]: Unknown')
  })
  it('returns a string (curry style)', async () => {
    expect(handler.logger('hello')()).toStrictEqual(void 0)
    expect(handler.logger('[Err]: Unknown')('string')).toStrictEqual('[Err]: Unknown')
  })
  it('returns a string (callback style)', async () => {
    expect(handler.logger('hello')()).toStrictEqual(void 0)
    expect(handler.logger('[Err]: Unknown', 'string')()).toStrictEqual('[Err]: Unknown')
  })
  it('returns a console message', async () => {
    // not sure exactly how to trace this
    jest.spyOn(console, 'trace')
    handler.logger('message')('trace')
    expect((console.trace as any).mock.calls[0][0]).toBe('TRACE: message')
    jest.clearAllMocks()
  })
  it('returns a console message', async () => {
    jest.spyOn(console, 'error')
    handler.logger('hello')('console')
    expect((console.error as any).mock.calls[0][0]).toBe('hello')
    jest.clearAllMocks()
  })
  it('returns a console message but doesn\'t propegate', async () => {
    expect(handler.logger('hello')('console')).toStrictEqual(void 0)
  })
  it('throws a clean error', async () => {
    try {
      handler.logger('Unknown')('throw')
    } catch (e) {
      expect(e.message).toBe('Unknown')
    }
  })
  it('does not double throw error', async () => {
    try {
      handler.logger(new Error('Unknown'))('throw')
    } catch (e) {
      expect(e.message).toBe('Unknown')
    }
  })
  it('does not double throw error but tampers with message if no message passed', async () => {
    try {
      handler.logger(new Error())('throw')
    } catch (e) {
      expect(e.message).toBe('No message')
    }
  })
})

describe('[Forage]:internals (returner)', () => {
  it('returns nothing if given nothing', async () => {
    expect((handler.returner as any)()()).toStrictEqual(void 0)
  })
  it('returns message by default', async () => {
    expect(handler.returner('hello')(0)).toStrictEqual('hello')
    expect(handler.returner('hello')()).toStrictEqual('hello')
    expect(handler.returner('hello')('blah')).toStrictEqual('hello')
    expect(handler.returner('hello')({})).toStrictEqual('hello')
    expect(handler.returner('hello')([])).toStrictEqual('hello')
    expect(handler.returner('hello')(void 0)).toStrictEqual('hello')
  })
  it('returns message if you use an unavailable logger', async () => {
    expect(handler.returner('not ava')('hello')).toStrictEqual('not ava')
  })
  it('returns undefined if you use "none" or undefined', async () => {
    expect(handler.returner('none')(1)).toStrictEqual(void 0)
  })
  it('returns a console message', async () => {
    jest.spyOn(console, 'log')
    handler.returner('console message')(2)
    expect((console.log as any).mock.calls[0][0]).toBe('console message')
    jest.clearAllMocks()
  })
  it('returns a console message but doesn\'t propegate', async () => {
    expect(handler.returner('console')(2)).toStrictEqual(void 0)
  })
  it('throws an error', async () => {
    try {
      handler.returner('catch this breakpoint')(3)
    } catch (e) {
      expect(e.message).toBe('catch this breakpoint')
    }
  })
  it('Returns no result if there is an error and the val is empty', async () => {
    try {
      (handler.returner as any)()(3)
    } catch (e) {
      expect(e.message).toBe('No result')
    }
  })
  it('Returns no result if there is an error and the val is empty', async () => {
    try {
      handler.returner(new Error())(3)
    } catch (e) {
      expect(e.message).toBe('No value')
    }
  })
  it('Returns no result if there is an error and the val is empty', async () => {
    try {
      handler.returner(new Error('Message'))(3)
    } catch (e) {
      expect(e.message).toBe('Message')
    }
  })
  it('returns true if the element is truthy', async () => {
    expect(handler.returner('happy', 4)()).toStrictEqual(true)
  })
  it('returns true if the element is truthy', async () => {
    expect(handler.returner(true, 4)()).toStrictEqual(true)
  })
  it('returns true if the element is truthy', async () => {
    expect(handler.returner([])(4)).toStrictEqual(true)
  })
  it('returns true if the element is truthy', async () => {
    expect(handler.returner({})(4)).toStrictEqual(true)
  })
  it('returns false if the element is false', async () => {
    expect(handler.returner(false)(4)).toStrictEqual(false)
  })
  it('returns null if the value is null', async () => {
    expect(handler.returner(null, 4)()).toStrictEqual(false)
  })
  it('returns undefined if the value is undefined', async () => {
    expect(handler.returner(void 0)(4)).toStrictEqual(false)
  })
  it('returns array if the value is an array', async () => {
    expect(handler.returner([1, 2, 3])(5)).toStrictEqual('array')
  })
  it('returns object if the value is an object', async () => {
    expect(handler.returner({ name: 'Ada' })(5)).toStrictEqual('object')
  })
  it('returns string if the value is an string', async () => {
    expect(handler.returner('string')(5)).toStrictEqual('string')
  })
  it('returns number if the value is an number', async () => {
    expect(handler.returner(42)(5)).toStrictEqual('number')
  })
  it('returns undefined if the value is undefined', async () => {
    expect(handler.returner(undefined)(5)).toStrictEqual('undefined')
  })
  it('returns null if the value is null', async () => {
    expect(handler.returner(null)(5)).toStrictEqual('null')
  })
  it('returns undefined if the value is undefined', async () => {
    expect(handler.returner(void 0)(5)).toStrictEqual('undefined')
  })
  it('returns number if the value is an number', async () => {
    expect(handler.returner(42)(5)).toStrictEqual('number')
  })
  it('returns number if the value is an number', async () => {
    const fn = (x: any) => 5
    expect(handler.returner(fn)(5)).toStrictEqual('function')
  })
  it('returns number if the value is an number', async () => {
    const create = new Error()
    expect(handler.returner(create)(5)).toStrictEqual('error')
  })
  it('returns number if the value is an number', async () => {
    jest.spyOn(console, 'trace')
    handler.returner('message')('trace')
    expect((console.trace as any).mock.calls[0][0]).toBe('TRACE: message')
    jest.clearAllMocks()
  })
  it('returns the value if the type is an unmapped number', async () => {
    expect(handler.returner(42)(7)).toStrictEqual(42)
  })
  it('returns the value if the type is an unmapped number', async () => {
    expect(handler.returner(42)(5345)).toStrictEqual(42)
  })
})

describe('[Forage]:internals (jsonPurify)', () => {
  it('validates data with correct model', async () => {
    let model = ['name', 'type']
    const objectSafe = { 'name': 'Ada', 'type': 'programmer' }
    const result = await handler.jsonPurify({
      model: model
    })(JSON.stringify(objectSafe))
    expect(result).toStrictEqual(objectSafe)
  })

  it('trims data with non-matching model', async () => {
    let model = ['name', 'type']
    const objectSafe = { 'name': 'Ada', 'person': 'programmer' }
    const result = await handler.jsonPurify({
      model: model
    })(JSON.stringify(objectSafe))
    expect(result).toStrictEqual({ name: 'Ada' })
  })

  it('trims data with non-matching model', async () => {
    let model = ['name', 'type']
    const objectSafe = { 'avatar': 'Ada', 'person': 'programmer' }
    const result = await handler.jsonPurify({
      model: model
    })(JSON.stringify(objectSafe))
    expect(result).toStrictEqual({})
  })

  it('trims data with non-matching model', async () => {
    let model = ['name', 'type']
    const objectSafe = {
      name: 'Ada',
      person: 'programmer',
      type: 'dead'
    }
    const result = await handler.jsonPurify({
      model: model,
      length: 10
    } as any)(JSON.stringify(objectSafe))
    expect(result).toStrictEqual({ 'name': 'Ada', 'type': 'dead' })
  })

})
