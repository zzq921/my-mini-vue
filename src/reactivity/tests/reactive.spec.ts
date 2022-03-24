
import { reactive } from '../reactive'
describe('reactive', () => {
  it('happy path',()=>{
    const original = {age:10}
    const observe = reactive(original)
    expect(observe).not.toBe(original)
    expect(observe.age).toBe(10)
  })
})

