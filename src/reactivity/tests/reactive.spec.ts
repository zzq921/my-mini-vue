
import { isReactive, reactive } from '../reactive'
describe('reactive', () => {
  it('happy path',()=>{
    const original = {age:10}
    const observe = reactive(original)
    expect(observe).not.toBe(original)
    expect(observe.age).toBe(10)
    expect(isReactive(observe)).toBe(true)
    expect(isReactive(original)).toBe(false)
  })
  test('nested reactive',()=>{
    const original = {
      nested:{
        foo:1
      },
      array:[{bar:2}]
    }
    const observe = reactive(original)
    expect(isReactive(observe.nested)).toBe(true)
    expect(isReactive(observe.array)).toBe(true)
    expect(isReactive(observe.array[0])).toBe(true)
  })
})

