import { effect } from "../effect"
import { reactive } from "../reactive"
import { isRef, proxyRefs, ref, unRef } from "../ref"

describe('ref',()=>{
  it('happy path',()=>{
    const a = ref(1)
    expect(a.value).toBe(1)
  })
  it('should is reactive',()=>{
    const a = ref(1)
    let dummy;
    let calls = 0
    effect(()=>{
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })

  it("should make nested properties reactive",()=>{
    const a = ref({
      count:1
    })
    let dummy;
    effect(()=>{
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })

  it('isRef',()=>{
    const b = ref(1)
    const user = reactive({age:1})
    expect(isRef(b)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(user)).toBe(false)
  })

  it('unRef',()=>{
    const b = ref(1)
    expect(unRef(b)).toBe(1)
    expect(unRef(1)).toBe(1)
  })

  it('proxyRefs',()=>{
    const user = {
      age:ref(1),
      b:2
    }
    const proxyUser = proxyRefs(user)
    expect(user.age.value).toBe(1)
    expect(proxyUser.age).toBe(1)
    expect(proxyUser.b).toBe(2)

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20)
    expect(user.age.value).toBe(20)

    proxyUser.age = ref(10)
    expect(proxyUser.age).toBe(10)
    expect(user.age.value).toBe(10)
   
  })
})