// @flow

import expect from 'expect';
import memoize from '../build';

let instances = 0;
const getObjWithMemoizedFunction = (): {
  constructor: Function,
  fn: (...args: any) => { instanceNum: number, callCount: number },
} => {
  const instanceNum = ++instances;
  const classObj: Object = { constructor: function Foo() {} };
  const fn = () => {
    fn.callCount = (fn.callCount || 0) + 1;

    return { instanceNum, callCount: fn.callCount };
  };
  classObj.fn = memoize(classObj, 'myMethod', { value: fn }).value;
  return classObj;
};

test('memoizes a function', () => {
  const obj = getObjWithMemoizedFunction();
  const [a, b] = [obj.fn(), obj.fn()];

  expect(a).toBe(b);
});

test('independently memoizes functions across class instances', () => {
  const objA = getObjWithMemoizedFunction();
  const objB = getObjWithMemoizedFunction();

  const a = (objA.fn(), objA.fn());
  const b = (objB.fn(), objB.fn());

  expect(a.callCount).toEqual(b.callCount);
  expect(a.instanceNum).not.toEqual(b.instanceNum);
});

test('memoization is dependent on arguments', () => {
  const obj = getObjWithMemoizedFunction();

  const [a, b] = [obj.fn(42), obj.fn(42)];
  const [c, d] = [obj.fn(43), obj.fn(43)];
  const [e, f] = [obj.fn(1, null, undefined, []), obj.fn(1, null, undefined, [])];

  expect(a).toEqual(b);
  expect(c).toEqual(d);
  expect(e).toEqual(f);
  expect(a).not.toBe(c);
  expect(a).not.toBe(e);
});
