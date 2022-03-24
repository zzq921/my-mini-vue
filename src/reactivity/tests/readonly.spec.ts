import { readonly } from "../reactive"

describe('readonly',()=>{
  it('happy path',()=>{
    const a = {foo:1,bar:{baz:2}}
    const wrapped = readonly(a)
    expect(wrapped).not.toBe(a)
    expect(wrapped.foo).toBe(1)
  })

  it('warn then call set',()=>{
    console.warn = jest.fn()
    const user = readonly({age:12})
    
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})