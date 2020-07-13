/**
 * by https://rjzaworski.com/2019/10/event-emitters-in-typescript
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventMap = Record<string, any>;

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

export interface Emitter<T extends EventMap> {
  on<K extends EventKey<T>>
  (eventName: K, fn: EventReceiver<T[K]>): void;
  fire<K extends EventKey<T>>
  (eventName: K, params: T[K]): void;
}

export default function eventEmitter<T extends EventMap>(): Emitter<T> {
  const listeners: {
    [K in keyof EventMap]?: Array<(p: EventMap[K]) => void>;
  } = {};

  return {
    on(key, fn) {
      listeners[key] = (listeners[key] || []).concat(fn);
    },
    fire(key, data) {
      (listeners[key] || []).forEach(function(fn) {
        fn(data);
      });
    },
  };
}
