
import { extend } from "../shared"
//
let activeEffect; //一个fn函数
let shouldTrack;
export class ReactiveEffect{
  private _fn:any
  deps = []
  active = true
  onStop?:()=>void
  constructor(fn,public scheduler?) {
    //接受fn方法
    this._fn = fn  
  }
  //每次effect被调用时候，执行run方法，进而执行fn()方法
  run() {
    if(!this.active) {
      return this._fn()
    }
    shouldTrack = true
    activeEffect = this
    const result = this._fn();
    shouldTrack = false
    return result
  }
  stop() {
    if(this.active) {
      cleanupEffect(this)
      if(this.onStop) {
        this.onStop()
      }
      this.active = false
    }
    
  }
}
function cleanupEffect(effect) {
  effect.deps.forEach((dep:any)=>{
    dep.delete(effect)
  })
  effect.deps.length = 0
}
//创建targetMap的map数据结构存储结构为  target --  key  --  dep

let targetMap = new Map()
export function track(target,key) {
  //targetMap -- depsMap -- dep
  if(!isTracking())return
  //通过目标对象的target获取 depsMap对象，此对象为map结构 key-dep
  let depsMap = targetMap.get(target)
  //初始化时候depsMap不一定存在，所以要进行判断
  if(!depsMap) {
    //不存在初始化一个depsMap对象，
    depsMap = new Map()
    //设置目标target为key，新建的depsMap为value，targetMap为存储map容器
    targetMap.set(target,depsMap)
  }
  //当depsMap存在时候，通过key取到value对象
  let dep = depsMap.get(key)
  //如果dep容器不存在或者没有取到值
  if(!dep) {
    //新建一个dep对象，此对象结构为set结构。
    dep = new Set()
    // 属性值作为key，effect的集合dep作伪value，存储到depsMap的集合中。
    depsMap.set(key,dep)
  }
  //如果dep存在，把dep当作参数传入，进行依赖收集。封装成一个trackEffects方法，方便后续进行复用。
  trackEffects(dep)
}

export function trackEffects(dep) {
  //此dep为所有与key有关的effect集合，收集到set结构的dep中。dep = [effect,effect,effect,effect]
  if(dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function isTracking() {
  return shouldTrack && activeEffect !==undefined
}

export function trigger(target,key) {
  //通过目标值target，依赖的key值，获取所有与此依赖有关的集合dep
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  //触发依赖的方法，把dep当作参数传入，封装成一个triggerEffects方法，方便后续进行复用
  triggerEffects(dep)
}

export function triggerEffects(dep) {
  //循环set结构的dep数组
  for(let effect of dep) {
    //取出每一个effect，判断effect是否有第二个参数传入
    if(effect.scheduler) {
      effect.scheduler()
    }else{
      //如果没有第二个参数，直接进行依赖触发，执行run方法，run方法里会调用fn
      effect.run()
    }
    
  }
}



export function effect(fn,options:any = {}) {
  // 创建 ReactiveEffect 类，生成effect工厂，每次生成唯一的effect，每次调用effect的时候，执行fn方法。
  const _effect = new ReactiveEffect(fn,options.scheduler)
  //利用extend方法实现effect的第二个参数options的合并。
  extend(_effect,options)
  _effect.run()
  const runner:any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop(runner) {
  runner.effect.stop()
}
