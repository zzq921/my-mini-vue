/*
 * @Author: zhaozhiqiang
 * @Date: 2022-03-03 21:29:05
 * @LastEditTime: 2022-03-03 22:27:59
 * @LastEditors: zhaozhiqiang
 * @Description: 
 */
import { reactive } from '../reactive'
describe('reactive', () => {
  it('happy path',()=>{
    const original = {age:10}
    const observe = reactive(original)
    expect(observe).not.toBe(original)
    expect(observe.age).toBe(10)
  })
})

