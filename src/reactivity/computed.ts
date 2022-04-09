import { ReactiveEffect } from "./effect"

class ComputedIml {
  private _getter: any
  private _dirty: boolean = true
  private _value: any
  private _effect: any
  constructor(getter) {
    this._getter = getter
    //第二个参数就是调度器 scheduler，此逻辑在前面文章中有讲到，欢迎观看https://juejin.cn/post/7083073866980917284
    this._effect = new ReactiveEffect(getter,()=>{
       //默认_dirty为true，当数据发生变化，也就是trigger时候，我们传入调度器，把开关打开。当下一次调用computed的value时候，开关打开，重新执行，获取最新的值返回
      if(!this._dirty) {
        this._dirty = true
      }
    })
  }
  get value() {
     //默认_dirty为true，第一次时候进行执行，然后又把开关关闭。只有再次打开才会执行。
    if(this._dirty){
      this._dirty = false
      //执行run方法，进行触发依赖。将最新的值返回
      this._value = this._effect.run()
    }
    //如果开关关闭，则返回之前的值。
    return this._value
  }
}

export function computed(getter) {
  return new ComputedIml(getter)
}