'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createClassProxy;

var _createPrototypeProxy = require('./createPrototypeProxy');

var _createPrototypeProxy2 = _interopRequireDefault(_createPrototypeProxy);

var _bindAutoBindMethods = require('./bindAutoBindMethods');

var _bindAutoBindMethods2 = _interopRequireDefault(_bindAutoBindMethods);

var _deleteUnknownAutoBindMethods = require('./deleteUnknownAutoBindMethods');

var _deleteUnknownAutoBindMethods2 = _interopRequireDefault(_deleteUnknownAutoBindMethods);

var _supportsProtoAssignment = require('./supportsProtoAssignment');

var _supportsProtoAssignment2 = _interopRequireDefault(_supportsProtoAssignment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

const RESERVED_STATICS = ['length', 'name', 'arguments', 'caller', 'prototype', 'toString'];

function isEqualDescriptor(a, b) {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  for (let key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

function proxyClass(InitialComponent) {
  // Prevent double wrapping.
  // Given a proxy class, return the existing proxy managing it.
  if (Object.prototype.hasOwnProperty.call(InitialComponent, '__reactPatchProxy')) {
    return InitialComponent.__reactPatchProxy;
  }

  let CurrentComponent;
  let ProxyComponent;

  let staticDescriptors = {};
  function wasStaticModifiedByUser(key) {
    // Compare the descriptor with the one we previously set ourselves.
    const currentDescriptor = Object.getOwnPropertyDescriptor(ProxyComponent, key);
    return !isEqualDescriptor(staticDescriptors[key], currentDescriptor);
  }

  function instantiate(factory, context, params) {
    const component = factory();

    try {
      return component.apply(context, params);
    } catch (err) {
      // Native ES6 class instantiation
      const instance = new (Function.prototype.bind.apply(component, [null].concat(_toConsumableArray(params))))();

      Object.keys(instance).forEach(function (key) {
        if (RESERVED_STATICS.indexOf(key) > -1) {
          return;
        }
        context[key] = instance[key];
      });
    }
  }

  try {
    // Create a proxy constructor with matching name
    ProxyComponent = new Function('factory', 'instantiate', 'return function ' + (InitialComponent.name || 'ProxyComponent') + '() {\n         return instantiate(factory, this, arguments);\n      }')(function () {
      return CurrentComponent;
    }, instantiate);
  } catch (err) {
    // Some environments may forbid dynamic evaluation
    ProxyComponent = function () {
      return instantiate(function () {
        return CurrentComponent;
      }, this, arguments);
    };
  }

  // Proxy toString() to the current constructor
  ProxyComponent.toString = function toString() {
    return CurrentComponent.toString();
  };

  let prototypeProxy;
  if (InitialComponent.prototype && InitialComponent.prototype.isReactComponent) {
    // Point proxy constructor to the proxy prototype
    prototypeProxy = (0, _createPrototypeProxy2.default)();
    ProxyComponent.prototype = prototypeProxy.get();
  }

  function update(NextComponent) {
    if (typeof NextComponent !== 'function') {
      throw new Error('Expected a constructor. :p');
    }

    // Prevent proxy cycles
    if (Object.prototype.hasOwnProperty.call(NextComponent, '__reactPatchProxy')) {
      return update(NextComponent.__reactPatchProxy.__getCurrent());
    }

    // Save the next constructor so we call it
    CurrentComponent = NextComponent;

    // Try to infer displayName
    ProxyComponent.displayName = NextComponent.displayName || NextComponent.name;

    // Set up the same prototype for inherited statics
    ProxyComponent.__proto__ = NextComponent.__proto__;

    // Copy static methods and properties
    Object.getOwnPropertyNames(NextComponent).forEach(function (key) {
      if (RESERVED_STATICS.indexOf(key) > -1) {
        return;
      }

      const staticDescriptor = _extends({}, Object.getOwnPropertyDescriptor(NextComponent, key), {
        configurable: true
      });

      // Copy static unless user has redefined it at runtime
      if (!wasStaticModifiedByUser(key)) {
        Object.defineProperty(ProxyComponent, key, staticDescriptor);
        staticDescriptors[key] = staticDescriptor;
      }
    });

    // Remove old static methods and properties
    Object.getOwnPropertyNames(ProxyComponent).forEach(function (key) {
      if (RESERVED_STATICS.indexOf(key) > -1) {
        return;
      }

      // Skip statics that exist on the next class
      if (NextComponent.hasOwnProperty(key)) {
        return;
      }

      // Skip non-configurable statics
      const descriptor = Object.getOwnPropertyDescriptor(ProxyComponent, key);
      if (descriptor && !descriptor.configurable) {
        return;
      }

      // Delete static unless user has redefined it at runtime
      if (!wasStaticModifiedByUser(key)) {
        delete ProxyComponent[key];
        delete staticDescriptors[key];
      }
    });

    if (prototypeProxy) {
      // Update the prototype proxy with new methods
      const mountedInstances = prototypeProxy.update(NextComponent.prototype);

      // Set up the constructor property so accessing the statics work
      ProxyComponent.prototype.constructor = ProxyComponent;

      // We might have added new methods that need to be auto-bound
      mountedInstances.forEach(_bindAutoBindMethods2.default);
      mountedInstances.forEach(_deleteUnknownAutoBindMethods2.default);
    }
  };

  function get() {
    return ProxyComponent;
  }

  function getCurrent() {
    return CurrentComponent;
  }

  update(InitialComponent);

  const proxy = { get: get, update: update };

  Object.defineProperty(proxy, '__getCurrent', {
    configurable: false,
    writable: false,
    enumerable: false,
    value: getCurrent
  });

  Object.defineProperty(ProxyComponent, '__reactPatchProxy', {
    configurable: false,
    writable: false,
    enumerable: false,
    value: proxy
  });

  return proxy;
}

function createFallback(Component) {
  let CurrentComponent = Component;

  return {
    get: function () {
      return CurrentComponent;
    },
    update: function (NextComponent) {
      CurrentComponent = NextComponent;
    }
  };
}

function createClassProxy(Component) {
  return Component.__proto__ && (0, _supportsProtoAssignment2.default)() ? proxyClass(Component) : createFallback(Component);
}