// @flow
// @providesModule decorators/memoize

import serialize from 'serialize-javascript';

import type { PropertyDescriptor } from 'flow-types';

const instanceMap: WeakMap<Object, number> = new WeakMap();
const methodMap: Map<string, *> = new Map();
let counter = 1;

export default function(targetClass: Object, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const fn = descriptor.value;
  const className = targetClass.constructor.name;

  // todo: pull typeof checks out into const
  // dependent on https://github.com/facebook/flow/issues/5862
  if (typeof fn !== 'function') {
    throw new Error(`Decorator expected a function, but called on a ${typeof fn}`);
  }

  descriptor.value = function(...args): any {
    const instanceExists = instanceMap.has(this);
    const instanceNumber = instanceMap.get(this) || counter++;
    const serializedArgs = serialize(args).slice(1, -1); // .slice removes opening & closing []'s
    const methodKey = `${className}[${instanceNumber}].${methodName}(${serializedArgs})`;
    const methodExists = methodMap.has(methodKey);
    const value = methodExists ? methodMap.get(methodKey) : fn.call(this, ...args);

    if (!instanceExists) {
      instanceMap.set(this, instanceNumber);
    }
    if (!methodExists) {
      methodMap.set(methodKey, value);
    }

    return value;
  };

  return descriptor;
}
