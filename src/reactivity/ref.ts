import { hasChange, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any; //创建私有属性
  public dep; //创建公共属性dep，收集effect
  private _rawValue: any; 
  public __v_isRef = true //属性代表为是ref
  constructor(value){
    this._rawValue = value // 保存最新的value值，方便新旧object进行对比，不然object和reactive(object)无法进行对比
    this._value = convert(value) 
    this.dep = new Set();
  }
  get value() {
    trackRefValue(this) //进行依赖收集
    return this._value
  }
  set value(newValue) {
    if(hasChange(this._value,newValue)){
      this._rawValue = newValue // 保存最新的value值，方便新旧object进行对比，不然object和reactive(object)无法进行对比
      this._value = convert(newValue)
      triggerEffects(this.dep) //触发依赖
    }
    
  }
}
  //当ref 中包裹为对象时，我们用reactive包裹，使其具有响应式数据。否则直接返回value值
function convert(value) {
  return isObject(value)?reactive(value):value;
}

function trackRefValue(ref) {
  //当我们收集的时候首先必须当前effect，也就是activeEffect，才会被收集。
  if(isTracking()) {
    trackEffects(ref.dep)
  }
}

export function ref(value) {
  //创建一个ref的class类
  return new RefImpl(value)
}

export function isRef(ref) {
  //在ref类中添加一个__v_isRef变量，代表是ref
  return !!ref.__v_isRef
}

export function unRef(ref) {
  //如果数据是ref，我们返回ref.value,如果不是的话 ，直接返回value就好了
  return isRef(ref) ? ref.value : ref
}
//直接访问对象的属性，无需.value取值。
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs,{
    get(target,key) {
      //执行unRef逻辑（如果Reflect.get(target,key)值是ref，则返回ref.value 否则返回value）
      return unRef(Reflect.get(target,key))
    },
    set(target,key,value) {
      //赋值时候，点当原来的属性值target[key]为ref类型且赋给最新值不是ref类型时候，返回target[key].value
      if(isRef(target[key])&& !isRef(value)){
        return target[key].value = value
      }else {
        //否则直接替换最新值就好
        return Reflect.set(target,key,value)
      }
    }
  })
}