import { extend, isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true,true)
//抽象出createGetter 方法，相当于get方法收集依赖
function createGetter(isReadonly=false,shallow = false) {
  return function get(target,key) {
    if(key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }else if(key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    let res = Reflect.get(target,key)
    if(shallow) {
      return res
    }
    if(isObject(res)) {  
      return isReadonly ? readonly(res) : reactive(res)
    }
    if(!isReadonly) {
      track(target,key)
    }
    return res
  }
}
//createSetter 方法，相当于set方法触发依赖
function createSetter(isReadonly = false) {
  return function get(target,key,val) {
    let res = Reflect.set(target,key,val)
    //触发依赖
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

export const shallowReadonlyHandlers = extend({},readonlyHandlers,{
  get: shallowReadonlyGet,
})
