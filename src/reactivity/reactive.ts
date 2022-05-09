import { isObject } from "../shared/index";
import { mutableHandlers, readonlyHandlers,shallowReadonlyHandlers } from "./baseHandlers"

//创建枚举集合，匹配isReactive和isReadonly
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}
//导出reactive对象
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


//创建reactive对象的方法
function createActiveObject(raw: any,baseHandlers) {
  if(!isObject(raw)) {
    console.warn(`target:${raw}必须是一个对象`)
    return
  }
  //通过Proxy实现对象数据的响应式监听
  return new Proxy(raw, baseHandlers)
}
