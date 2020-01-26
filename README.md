# tauri forage
![test library](https://github.com/tauri-apps/tauri-forage/workflows/test%20library/badge.svg?branch=dev)
![npm version](https://img.shields.io/npm/v/@tauri-apps/tauri-forage.svg)

[localForage](https://localforage.github.io/localForage/) is a great way to make sure that you've got the most persistent localStorage available on the device and webview that you are using, but operations (like replacing a keyValue) can be tedious, and our approach of multi-op currying makes it very flexible. It is written and tested in typescript, and ships with commonjs and an ejs versions - as well as all of its own typings in case you are using typescript.

If you don't know how localForage works, you would do well to check out those docs - because that is the underlying engine that this library uses. But for a refresher, localForage uses IndexedDB, WebSQL, or localStorage - depending on the best engine that the browser offers.

## Installation

Install with your package manager
```
yarn add @tauri-apps/tauri-forage
```

Import into your JS / TS
```
import { forage } from '@tauri-apps/tauri-forage'
```

Use it:
```
forage.setItem({
  key: 'yourKey',
  value: 'a value'
})()
```

## How does it work?
Here is the `getItem` function. There is a lot to discuss, and once you've understood the principle all of the other functions will make sense to you. If you want to see more details, check out the tests in `test/__tests__/tauriForage.spec.ts`

```ts
getItem ({ key, logger, returner, before, store }: BeforeItem = {}) {
  return async function (curry?: MaybeFunction) {
    const storage = await _defineStore({ store: store })
    key = before ? await handler.maybeCurry(curry || null)(key) : key
    return handler.returner(
      storage.getItem(key).then(async (v: any) => {
        return !before ? handler.maybeCurry(curry || null)(v) : v
      }).catch((err: any) => {
        /* istanbul ignore next */
        return handler.logger(err, logger)
      })
    )(returner)
  }
}
```

In its most simple incarnation, you can just get the keyValue of the keyName.
```
```

### Returner
You can instruct every function to return the value in specific ways.

#### TYPES
- 1(quiet) - return void 0
- 2(console) - log the returned value to the console
- 3(break) - throw an error with the contents of the return
- 4(truthy) - return a true or false value
- 5(typeof) - return type of response
- 6(trace) - get a console.trace() of the call stack
- 7(passthrough) - the default does nothing to the return


### Logger
If an error occurs, you can determine how to respond:

#### TYPES
- 1(none) - just return
- 2(string) - returned the string value of the error
- 3(trace) - try to return a stack trace up to the error
- 4(console) - write a console.error
- 5(throw) - throw the error
- 6(default) - return undefined

> If you want, you can also use these handler functions yourself! They are properly exported and typed!

### Currying
However you can also curry the returned value with a function you can pass into the function call.

Let's look at a few tests to see how currying can be applied:
```ts
it('will curry after', async () => {

  await forage.setItem({
    key: 'user',
    value: { name: 'Alice' }
  } as any)()

  const curry = (v: any) => v.toUpperCase()

  const user = await forage.getKeyValue({
    key: 'user',
    value: 'name'
  } as any)(curry)

  expect(user).toStrictEqual('ALICE')
})
```

You can also curry the value BEFORE it is used by localForage. This example is obviously quite trivial, but you may start to see a pattern emerge.
```ts
  it('will curry before', async () => {

    // you can set objects or arrays or even huge base64 strings for values
    await forage.setItem({
      key: 'user',
      value: {
        name: 'Alice'
      }
    }  as any)()

    const curry = (v: any) => v.toLowerCase()

    const user = await forage.getKeyValue({
      key: 'user',
      value: 'NAME',
      before: true
    } as any)(curry)

    expect(user).toStrictEqual('Alice')
  })
```

If you want to have multiple "stores", you can easily do that too.


## Extensions to localForage
Of note are the extensions to the generic interface:
 - mergeItem (with a number of merge strategies available)
 - getKeyValue
 - deleteItemKey
 - hasKey
 - hasKeyValue

## undefined / void 0 => always returns null!
> Even if undefined is saved, null will be returned by getItem().
This is due to a limitation in localStorage, and for compatibility
reasons localForage cannot store the value undefined.

# Development
## Testing
Tests are written with Jasmine flavor using Jest.

## Docs
The docs are available as a static site in /docs

## License
(c) 2019-2020 - Daniel Thompson-Yvetot and contributors

MIT
