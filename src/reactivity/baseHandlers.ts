import { isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly=false) {
  return function get(target,key) {
    if(key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }else if(key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    let res = Reflect.get(target,key)
    if(isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    if(!isReadonly) {
      track(target,key)
    }
    return res
  }
}

function createSetter(isReadonly = false) {
  return function get(target,key,val) {
    let res = Reflect.set(target,key,val)
    trigger(target,key)
    return res
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target,key,val) {
    console.warn(`key:${key} set 失败，因为 target是readonly`,target)
    return true
  }
}