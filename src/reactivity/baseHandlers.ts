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
      //isReactive的实现，如果匹配到且不是只读属性，则返回true，即!isReadonly
      return !isReadonly
    }else if(key === ReactiveFlags.IS_READONLY) {
      //isReadonly的实现，如果匹配到是只读属性，则返回
      return isReadonly
    }
    let res = Reflect.get(target,key)
    //判断是否为shallow，直接返回值就好
    if(shallow) {
      return res
    }
    //数据嵌套判断，如果是isReadonly，就用readonly包裹嵌套的深层数据，如果不是，就用reactive嵌套深层，使其成为响应式数据
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
