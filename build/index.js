'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (targetClass, methodName, descriptor) {
  const fn = descriptor.value;
  const className = targetClass.constructor.name;

  // todo: pull typeof checks out into const
  // dependent on https://github.com/facebook/flow/issues/5862
  if (typeof fn !== 'function') {
    throw new Error(`Decorator expected a function, but called on a ${typeof fn}`);
  }

  descriptor.value = function (...args) {
    const instanceExists = instanceMap.has(this);
    const instanceNumber = instanceMap.get(this) || counter++;
    const serializedArgs = (0, _serializeJavascript2.default)(args).slice(1, -1); // .slice removes opening & closing []'s
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
};

var _serializeJavascript = require('serialize-javascript');

var _serializeJavascript2 = _interopRequireDefault(_serializeJavascript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const instanceMap = new WeakMap();

const methodMap = new Map();
let counter = 1;