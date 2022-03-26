import { isReadonly, shallowReadonly } from "../reactive"

describe('shallowReadonly',()=>{
  test('浅响应 readonly',()=>{
    const props = shallowReadonly({
      n:{
        foo:1
      }
    })
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
  })

  it('warn then call set',()=>{
    console.warn = jest.fn()
    const user = shallowReadonly({age:12})
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})