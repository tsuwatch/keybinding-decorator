import * as Mousetrap from 'mousetrap';

interface KeybindWrapper {
  (args?: Array<any>): void;
  _mousetrapKey?: string;
}

/**
 * decorator wrapper
 * @param {string} key - keyboard
 */
export function outerDecorator(key: string) {
  return function innerDecorator(target: Object, name: string, descriptor: PropertyDescriptor) {
    return {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: function getter(): KeybindWrapper {
        Reflect.defineProperty(this, key, {
          configurable: true,
          enumerable: descriptor.enumerable,
          value: keybind(descriptor.value, key)
        });

        return this[key];
      }
    };
  };
}

export function unbind(target: string | KeybindWrapper) {
  if (typeof target === 'function' && target._mousetrapKey) {
    Mousetrap.unbind(target._mousetrapKey);
  } else if (typeof target === 'string') {
    Mousetrap.unbind(target);
  }
}

/**
 * keybind
 * @param {Function} cb - decorator's callback
 * @param {string} key - keyboard
 */
function keybind(cb: Function, key: string) {
  /**
   * wrapper
   * @param {Array} args - arguments from `apply`
   */
  const a: any = function keybindWrapper(...args: Array<any>) {
    Mousetrap.bind(key, () => Reflect.apply(cb, this, args));
  };

  a._mousetrapKey = key;

  return a as KeybindWrapper;
}
