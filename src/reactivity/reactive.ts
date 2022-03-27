import { mutableHandlers, readonlyHandlers,shallowReadonlyHandlers } from "./baseHandlers"


export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function reactive(raw) {
  return createActiveObject(raw,mutableHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function readonly(raw) {
  return createActiveObject(raw,readonlyHandlers)
}

export function shallowReadonly(raw) {
  return createActiveObject(raw,shallowReadonlyHandlers)
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(val) {
  return isReactive(val) || isReadonly(val)
}



function createActiveObject(raw: any,baseHandlers) {
  return new Proxy(raw, baseHandlers)
}
