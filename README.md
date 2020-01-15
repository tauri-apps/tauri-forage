# curriedForage



## forage

`localForage` is great, but operations with it can be tedious, and currying is a fun exercise.

Internally, we are using the same API as localForage,
with the exception of the dropInstance interface, which, while
still available, has been split out into three distinct calls.
 Also, are using `.then` instead of the callback approach, and
always catch an error.

Of note are the extensions to the generic interface:
 - mergeItem (with a number of merge strategies available)
 - getKeyValue
 - deleteItemKey
 - hasKey
 - hasKeyValue

> Even if undefined is saved, null will be returned by getItem().
This is due to a limitation in localStorage, and for compatibility
reasons localForage cannot store the value undefined.

### Process
1. forage.config({object})
2. forage.ready()
3. forage.set('user', { age: 12 })
4. forage.get('user')
5. forage.clear()

### Usage
1. Exactly the same interface as localForage
2. With a currying function applied to the result
3. Modify the value returned (with or without curry)
4. Define error suppression

## cryptoForage

# Development
## Testing
Tests are written with Jasmine flavor using Jest.

## Docs
the docs are available as a static site in /docs

## License
:copy: 2020 - Daniel Thompson-Yvetot and contributors

MIT