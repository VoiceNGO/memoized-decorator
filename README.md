# Memoized Decorator

A minimilistic memoize decorator. Written because the only other memoize
decorator I found in NPM didn't support arguments!

Serializes arguments via serialize-javascript package. Only caveat I know
of is that `undefined` serializes to `null`, but this behavior seems correct
to me. If you disagree open an issue and we can discuss :)

## Installation

```sh
npm install --save-dev memoized-decorator
```

## Usage

```js
import memoize from 'memoized-decorator';

class Foo {
  @memoize
  myMethod() {
    // ...
  }
}
```
