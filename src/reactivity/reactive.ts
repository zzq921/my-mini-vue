/*
 * @Author: zhaozhiqiang
 * @Date: 2022-03-03 22:19:23
 * @LastEditTime: 2022-03-03 23:49:25
 * @LastEditors: zhaozhiqiang
 * @Description: 
 */

import { track,trigger} from "./effect"

export function reactive(raw) {
  return new Proxy(raw,{
    get(target,key) {
      let res = Reflect.get(target,key)
      track(target,key)
      return res
    },
    set(target,key,val) {
      let res = Reflect.set(target,key,val)
      trigger(target,key)
      return res
    }
  })
}